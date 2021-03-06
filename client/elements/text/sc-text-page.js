import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';

import { Localized } from '../addons/localization-mixin.js';
import { ReduxMixin } from '../../redux-store.js';


export class SCTextPage extends ReduxMixin(Localized(PolymerElement)) {
  static get properties() {
    return {
      inputElement: {
        type: Object
      },
      showParagraphs: {
        type: Boolean,
      },
      chosenTextView: {
        type: String,
      },
      lang: {
        type: String
      }
    }
  }

  deathToTheBeast() {
    const inputText = this.inputElement.innerHTML;
    let outputText = '';
    if (inputText.indexOf('ṃ') > -1 || inputText.indexOf('Ṃ') > -1) {
      outputText = inputText.replace(/ṃ/g, 'ṁ').replace(/Ṃ/g, 'Ṁ');
    } else {
      outputText = inputText.replace(/ṁ/g, 'ṃ').replace(/Ṁ/g, 'Ṃ');
    }
    this.inputElement.innerHTML = outputText;
  }

  _applyQuoteHanger() {
    const paragraphs = this.inputElement.querySelectorAll('p');
    if ((window.innerWidth < 1280 || this.chosenTextView === 'sidebyside') && this.showParagraphs) {
      Array.from(paragraphs).forEach(paragraph => {
        paragraph.style.textIndent = null;
      });
      return;
    }

    const sutta = this.inputElement.querySelectorAll('.sutta')[0];
    if (!sutta) {
      return;
    }
    const suttaFont = window.getComputedStyle(sutta, null).getPropertyValue('font');

    Array.from(paragraphs).forEach(paragraph => {
      let paragraphNumber = paragraph.innerHTML.match(/>([0-9a-zA-Z\.]*)<\/a>/);
      let cleanParagraph = paragraph.textContent;
      if (paragraphNumber) {
        cleanParagraph = cleanParagraph.replace(paragraphNumber[1], '');
      }
      let paragraphMatch = cleanParagraph.match(/^[  \n0-9.-]*([“‘「『„«"]+)(.)/);
      if (paragraphMatch) {
        var quotedText = paragraphMatch[2];
        var quoteMark = paragraphMatch[1] + paragraphMatch[2];
        var canvas = document.createElement('canvas');
        var context = canvas.getContext("2d");
        context.font = suttaFont;
        var diff = context.measureText(quoteMark).width - context.measureText(quotedText).width;
        if (this.lang === 'lzh' || this.lang === 'zh') {
          paragraph.style.textIndent = `-${context.measureText(quotedText).width}px`;
        } else {
          paragraph.style.textIndent = `-${diff}px`;
        }
      }
    });
  }
}
