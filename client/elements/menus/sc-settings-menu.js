import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import '@polymer/paper-radio-button/paper-radio-button.js';
import '@polymer/paper-radio-group/paper-radio-group.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-spinner/paper-spinner-lite.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/iron-overlay-behavior/iron-overlay-backdrop.js';
import '@polymer/app-storage/app-localstorage/app-localstorage-document.js';

import { ReduxMixin } from '../../redux-store.js';
import { API_ROOT } from '../../constants.js';
import { Localized } from '../addons/localization-mixin.js';

/*
Settings menu appears in the toolbar on text pages only. It has setting for textual-details (paragraph numbers),
type of view for segmented pages (showing pali next to translated text), lookup tools and publication details .
*/

class SCSettingsMenu extends ReduxMixin(Localized(PolymerElement)) {
  static get template() {
    return html`
    <style>
      :host {
        --primary-color: var(--sc-primary-color);
        --accent-color: var(--sc-primary-accent-color);
      }

      .paper-dialogue-container {
        max-width: 720px;
      }

      .dialog-header {
        @apply --paper-font-title;
        margin: 0;
      }

      #settingsbutton {
        color: var(--sc-tertiary-text-color);
      }

      .dialog-section {
        margin: var(--sc-size-md-larger) 0;
      }

      .nerdy-row {
        @apply --paper-font-body1;
        color: var(--sc-secondary-text-color);
        margin: var(--sc-size-sm) 0;
      }

      .menu-item-title {
        @apply --paper-font-title;
        color: var(--sc-primary-text-color);
        margin: var(--sc-size-sm) 0;
      }

      .menu-option {
        --paper-radio-button-unchecked-color: var(--sc-disabled-text-color);
        --paper-radio-button-checked-color: var(--sc-primary-accent-color);
        --paper-radio-button-label-color: var(--sc-primary-text-color);
      }

      .menu-item .menu-icon {
        margin-right: var(--sc-size-xs);
      }

      .menu-icon {
        color: var(--sc-disabled-text-color);
      }

      .menu-item {
        @apply --sc-skolar-font-size-md;
        color: var(--sc-primary-text-color);
        --paper-item-selected-weight: 500;
        cursor: pointer;
      }

      .menu-item:hover {
        background-color: var(--sc-tertiary-background-color);
      }

      .menu-dropdown, .menu-listbox {
        @apply --sc-skolar-font-size-md;
        --paper-input-container-focus-color: var(--sc-primary-accent-color);
        --paper-dropdown-menu-icon: {
          color: var(--sc-disabled-text-color);
        };
        --paper-dropdown-menu-input: {
          --paper-input-container-input-color: var(--sc-primary-text-color);
          --paper-input-container-color: var(--sc-secondary-text-color);
        };
        --paper-menu-button-dropdown: {
          @apply --shadow-elevation-8dp;
          background-color: var(--sc-secondary-background-color);
        };
        background-color: var(--sc-secondary-background-color);
        width: 200px;
      }

      .menu-listbox {
        --paper-input-container-focus-color: var(--sc-primary-accent-color);
        --paper-input-container-color: var(--sc-secondary-text-color);
        --paper-input-container-input-color: var(--sc-secondary-text-color);
        --paper-dropdown-menu-icon: {
          color: var(--sc-disabled-text-color);
        };
        background-color: var(--sc-secondary-background-color);
      }

      .menu-toggle-button {
        --paper-toggle-button-unchecked-bar-color: var(--sc-secondary-text-color);
        --paper-toggle-button-checked-bar-color: var(--sc-primary-accent-color-light);
        --paper-toggle-button-checked-button-color: var(--sc-primary-accent-color);
        --paper-toggle-button-checked-ink-color: var(--sc-primary-accent-color-dark);
        margin-top: var(--sc-size-md);
      }

      @media screen and (max-width: 769px) {
        #sides {
          display: none;
        }
      }

      .loading-indicator {
        @apply --sc-skolar-font-size-s;
        width: 90%;
        display: flex;
        text-align: center;
        position: absolute;
        height: inherit;
        justify-content: center;
        align-items: center;
      }
    </style>

    <iron-ajax id="paragraphs_ajax" url="[[_getParagraphsUrl()]]" handle-as="json" last-response="{{textualInfoResponse}}"></iron-ajax>

    <div class="paper-dialogue-container">
      <div class="loading-indicator">
        <paper-spinner-lite active="[[showLoadingSpinner]]"></paper-spinner-lite>
      </div>

      <div class="dialog-section">
        <h3 class="menu-item-title">{{localize('viewTextualInfo')}}</h3>
        <div class="nerdy-row">{{localize('displaysInfo')}}</div>
        <paper-toggle-button id="textual_info_toggle_button" class="menu-toggle-button" active="{{textualInfoToggleEnabled}}"></paper-toggle-button>
      </div>

      <div class="dialog-section">
        <h3 class="menu-item-title">{{localize('viewOriginal')}}</h3>
        <div class="nerdy-row">{{localize('onlyWorks')}}</div>
        <paper-radio-group id="text_view_menu" selected="{{selectedTextView}}">
          <paper-radio-button name="none" class="menu-option">
            {{localize('none')}}
          </paper-radio-button>
          <paper-radio-button id="sides" name="sidebyside" class="menu-option">
            <iron-icon class="menu-icon" icon="sc-iron-icons:view-column"></iron-icon>
            {{localize('sideBySide')}}
          </paper-radio-button>
          <paper-radio-button name="linebyline" class="menu-option">
            <iron-icon class="menu-icon" icon="sc-iron-icons:view-headline"></iron-icon>
            {{localize('lineByLine')}}
          </paper-radio-button>
          <paper-radio-button name="popup" class="menu-option">
            <iron-icon class="menu-icon" icon="sc-iron-icons:insert-comment"></iron-icon>
            {{localize('popUp')}}
          </paper-radio-button>
        </paper-radio-group>
      </div>

      <div class="dialog-section">
        <h3 class="menu-item-title">{{localize('activatePaliLookup')}}</h3>
        <div class="nerdy-row">
          {{localize('activatePaliDescription')}}
        </div>
        <paper-dropdown-menu class="menu-dropdown" label="{{localize('lookup')}}" id="pali_lookup_menu" vertical-align="auto">
          <paper-listbox class="menu-listbox" slot="dropdown-content" selected="{{paliLookupSelected}}">
            <template is="dom-repeat" items="[[paliLookupArray]]" as="dictlanguage">
              <paper-item class="menu-item">[[dictlanguage.language]]</paper-item>
            </template>
          </paper-listbox>
        </paper-dropdown-menu>
      </div>

      <div class="dialog-section">
        <h3 class="menu-item-title">{{localize('activateChineseLookup')}}</h3>
        <div class="nerdy-row">
          {{localize('activateChineseDescription')}}
        </div>
        <paper-dropdown-menu class="menu-dropdown" label="{{localize('lookup')}}" id="chinese_lookup_menu" vertical-align="auto">
          <paper-listbox class="menu-listbox" slot="dropdown-content" selected="{{chineseLookupSelected}}">
            <template is="dom-repeat" items="[[chineseLookupArray]]" as="dictlanguage">
              <paper-item class="menu-item">[[dictlanguage.language]]</paper-item>
            </template>
          </paper-listbox>
        </paper-dropdown-menu>
      </div>

      <div class="dialog-section">
        <h3 class="menu-item-title">{{localize('changePaliScript')}}</h3>
        <div class="nerdy-row">{{localize('changePaliScriptDescription')}}</div>
        <paper-dropdown-menu class="menu-dropdown" label="{{localize('changePaliScriptLabel')}}" id="pali_script_menu" vertical-align="auto">
          <paper-listbox class="menu-listbox" slot="dropdown-content" selected="{{paliScriptSelected}}">
            <template is="dom-repeat" items="[[paliScripts]]" as="script">
              <paper-item class="menu-item">[[script.language]]</paper-item>
            </template>
          </paper-listbox>
        </paper-dropdown-menu>
      </div>

      <div class="dialog-section">
        <h3 class="menu-item-title">{{localize('rememberSettings')}}</h3>
        <div class="nerdy-row">{{localize('rememberSettingsDescription')}}</div>
        <paper-toggle-button id="remember_settings_button" class="menu-toggle-button" noink="" checked="" active="{{rememberSettings}}"></paper-toggle-button>
      </div>

    </div>

    <app-localstorage-document key="rememberTextSettings" data="{{rememberSettings}}"></app-localstorage-document>`;
  }

  static get properties() {
    return {
      // Selected type of view for segmented-text pages.
      selectedTextView: {
        type: String,
        observer: '_textViewChanged',
        statePath: 'textOptions.segmentedSuttaTextView'
      },
      paliLookupArray: {
        type: Array,
        value: [
          {
            'dict': 'none',
            'language': 'None'
          },
          {
            'dict': 'pli2en',
            'language': 'Pāli → English'
          },
          {
            'dict': 'pli2es',
            'language': 'Pāli → Español'
          },
          {
            'dict': 'pli2zh',
            'language': 'Pāli → 汉语'
          },
          {
            'dict': 'pli2pt',
            'language': 'Pāli → Português'
          },
          {
            'dict': 'pli2id',
            'language': 'Pāli → Bahasa Indonesia'
          },
          {
            'dict': 'pli2nl',
            'language': 'Pāli → Nederlands'
          }
        ]
      },
      paliLookupLanguage: {
        type: String,
        statePath: 'textOptions.paliLookupTargetDictRepr'
      },
      // pali to language lookup selected number.
      paliLookupSelected: {
        type: Number,
        computed: '_findPaliLookupLanguageIndex(paliLookupLanguage)'
      },
      // possible values for the chinese to language lookup.
      chineseLookupArray: {
        type: Array,
        value: [
          {
            'dict': 'none',
            'language': 'None'
          },
          {
            'dict': 'lzh2en',
            'language': '汉语 → English'
          }
        ]
      },
      chineseLookupLanguage: {
        type: String,
        statePath: 'textOptions.chineseLookupTargetDictRepr'
      },
      // chinese to language lookup selected number.
      chineseLookupSelected: {
        type: Number,
        computed: '_findChineseLookupLanguageIndex(chineseLookupLanguage)'
      },
      // possible values for the script chooser for pali.
      paliScripts: {
        type: Array,
        value: [
          {
            'script': 'latin',
            'language': 'Latin'
          },
          {
            'script': 'sinhala',
            'language': 'සිංහල'
          },
          {
            'script': 'devanagari',
            'language': 'नागरी'
          },
          {
            'script': 'thai',
            'language': 'ไทย'
          },
          {
            'script': 'myanmar',
            'language': 'မြန်မာဘာသာ'
          }
        ]
      },
      // pali script selected number.
      paliScriptSelected: {
        type: Number,
        computed: '_findPaliScriptIndex(paliScript)'
      },
      paliScript: {
        type: String,
        statePath: 'textOptions.script'
      },
      // The state of the textual info paper-toggle-button
      textualInfoToggleEnabled: {
        type: Boolean,
        statePath: 'textOptions.paragraphsEnabled'
      },
      textualInfoResponse: {
        type: Object,
        observer: '_onParagraphsLoaded'
      },
      textualParagraphs: {
        type: Object,
        statePath: 'textOptions.paragraphDescriptions'
      },
      // Boolean that remembers settings on this page.
      rememberSettings: {
        type: Boolean
      },
      showLoadingSpinner: {
        type: Boolean,
        value: false
      },
      paliSelectedItemChanged: {
        type: Boolean,
        value: false
      },
      chineseSelectedItemChanged: {
        type: Boolean,
        value: false
      },
      paliScriptItemChanged: {
        type: Boolean,
        value: false
      },
      textViewItemChanged: {
        type: Boolean,
        value: false
      },
      localizedStringsPath: {
        type: String,
        value: '/localization/elements/sc-settings-menu'
      }
    }
  }

  static get actions() {
    return {
      toggleTextualInfo(enabled) {
        return {
          type: 'TOGGLE_TEXTUAL_INFORMATION_ENABLED',
          enabled: enabled
        }
      },
      downloadParagraphs(data) {
        return {
          type: 'DOWNLOAD_PARAGRAPH_DESCRIPTIONS',
          descriptions: data
        }
      },
      chooseSegmentedSuttaTextView(view) {
        return {
          type: 'CHOOSE_SEGMENTED_SUTTA_TEXT_VIEW',
          view: view
        }
      },
      choosePaliTextScript(script) {
        return {
          type: 'CHOOSE_PALI_TEXT_SCRIPT',
          script: script
        }
      },
      activatePaliLookup(activated, targetLanguage, targetDictRepr) {
        return {
          type: 'ACTIVATE_PALI_LOOKUP',
          paliLookupTargetLanguage: targetLanguage,
          paliLookupActivated: activated,
          paliLookupTargetDictRepr: targetDictRepr
        }
      },
      activateChineseLookup(activated, targetLanguage, targetDictRepr) {
        return {
          type: 'ACTIVATE_CHINESE_LOOKUP',
          chineseLookupTargetLanguage: targetLanguage,
          chineseLookupActivated: activated,
          chineseLookupTargetDictRepr: targetDictRepr
        }
      }
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.shadowRoot.querySelector('#textual_info_toggle_button').addEventListener('active-changed', (e) => {
      this._textualInfoToggleStateChanged(e.detail.value);
    });
    this.shadowRoot.querySelector('#text_view_menu').addEventListener('selected-item-changed', () => {
      this.textViewItemChanged = true;
    });
    this.shadowRoot.querySelector('#pali_lookup_menu').addEventListener('value-changed', (e) => {
      this._paliLookupChanged(e.detail.value);
    });
    this.shadowRoot.querySelector('#chinese_lookup_menu').addEventListener('value-changed', (e) => {
      this._chineseLookupChanged(e.detail.value);
    });
    this.shadowRoot.querySelector('#pali_lookup_menu').addEventListener('selected-item-changed', () => {
      this.paliSelectedItemChanged = true;
    });
    this.shadowRoot.querySelector('#chinese_lookup_menu').addEventListener('selected-item-changed', () => {
      this.chineseSelectedItemChanged = true;
    });
    this.shadowRoot.querySelector('#pali_script_menu').addEventListener('value-changed', (e) => {
      this._changeScript(e.detail.value);
    });
    this.shadowRoot.querySelector('#pali_script_menu').addEventListener('selected-item-changed', () => {
      this.paliScriptItemChanged = true;
    });
    this.shadowRoot.querySelector('#remember_settings_button').addEventListener('active-changed', (e) => {
      this._rememberSettingsChanged(e.detail.value);
    });
  }

  _textualInfoToggleStateChanged(toggleChecked) {
    if (this.textualParagraphs) {
      if (toggleChecked) {
        this.showLoadingSpinner = true;
        this.$.paragraphs_ajax.generateRequest().completes.then(() => {
          this.dispatch('toggleTextualInfo', true);
          this.showLoadingSpinner = false;
        });
        this._showToast(this.localize('textualInformationEnabled'));
      } else {
        this.dispatch('toggleTextualInfo', false);
        this._showToast(this.localize('textualInformationDisabled'));
      }
    }
  }

  _onParagraphsLoaded() {
    if (this.textualInfoResponse) {
      if (!this.textualInfoDescriptions || this.textualInfoDescriptions.length === 0) {
        this.dispatch('downloadParagraphs', this.textualInfoResponse);
      } else {
        this.dispatch('toggleTextualInfo', true);
      }
    }
  }

  _paliLookupChanged(lookupLanguage) {
    if (!lookupLanguage) {
      return;
    }
    const langIndex = this._findPaliLookupLanguageIndex(lookupLanguage);
    const target = this.paliLookupArray[langIndex];
    const targetLanguage = target.dict.split('2')[1];
    const targetDictRepr = target.language;
    if (this.paliSelectedItemChanged) {
      this._showLookupToast(targetDictRepr, 'pli');
      this.paliSelectedItemChanged = false;
    }
    this.dispatch('activatePaliLookup', !!(langIndex), targetLanguage, targetDictRepr);
  }

  _findPaliLookupLanguageIndex(languageName) {
    return this.paliLookupArray.findIndex(i => i.language === languageName);
  }

  _chineseLookupChanged(lookupLanguage) {
    if (!lookupLanguage) {
      return;
    }
    const langIndex = this._findChineseLookupLanguageIndex(lookupLanguage);
    const target = this.chineseLookupArray[langIndex];
    const targetLanguage = target.dict.split('2')[1];
    const targetDictRepr = target.language;
    if (this.chineseSelectedItemChanged) {
      this._showLookupToast(targetDictRepr, 'lzh');
      this.chineseSelectedItemChanged = false;
    }
    this.dispatch('activateChineseLookup', !!(langIndex), targetLanguage, targetDictRepr);
  }

  _findChineseLookupLanguageIndex(languageName) {
    return this.chineseLookupArray.findIndex(i => i.language === languageName);
  }

  _textViewChanged() {
    this.showLoadingSpinner = true;
    if (this.textViewItemChanged) {
      if (this.selectedTextView !== 'none') {
        let textViewMessage = '';
        switch (this.selectedTextView) {
          case 'sidebyside':
            textViewMessage = this.localize('sideBySide');
            break;
          case 'linebyline':
            textViewMessage = this.localize('lineByLine');
            break;
          case 'popup':
            textViewMessage = this.localize('popUp');
            break;
        }
        this._showToast(this.localize('textViewEnabled', 'textView', textViewMessage));
      } else {
        this._showToast(this.localize('textViewDisabled'));
      }
      this.textViewItemChanged = false;
    }
    setTimeout(() => {
      this.dispatch('chooseSegmentedSuttaTextView', this.selectedTextView);
      this.showLoadingSpinner = false;
    }, 0);
  }

  // Fires the choice of pali script to sc-page-selector.html and from there to the segmented text pages.
  _changeScript(language) {
    if (!language) {
      return;
    }
    if (this.paliScriptItemChanged) {
      const scriptChangeMessage = this.localize('scriptChanged', 'paliScript', language);
      this._showToast(scriptChangeMessage);
      this.paliScriptItemChanged = false;
    }
    const script = this.paliScripts.find(i => i.language === language).script;
    this.showLoadingSpinner = true;
    setTimeout(() => {
      this.dispatch('choosePaliTextScript', script);
      this.showLoadingSpinner = false;
    }, 0);
  }

  _getParagraphsUrl() {
    return `${API_ROOT}/paragraphs`;
  }

  _findPaliScriptIndex(paliScript) {
    return this.paliScripts.findIndex(i => i.script === paliScript);
  }

  _rememberSettingsChanged(setting) {
    if (setting) {
      this._showToast(this.localize('rememberSettingsEnabled'));
    } else {
      this._showToast(this.localize('rememberSettingsDisabled'));
    }
  }

  _showLookupToast(dictName, lang) {
    if (dictName !== 'None') {
      const dictChangeMessage = this.localize('lookupDictionaryEnabled', 'lookupDictionary', dictName);
      this._showToast(dictChangeMessage);
    } else {
      if (lang === 'pli') {
        this._showToast(this.localize('paliLookupDictionaryDisabled'));
      } else {
        this._showToast(this.localize('chineseLookupDictionaryDisabled'));
      }
    }
  }

  _showToast(inputMessage) {
    this.dispatchEvent(new CustomEvent('show-sc-toast', {
      detail: {
        toastType: 'info',
        message: inputMessage
      },
      bubbles: true,
      composed: true
    }));
  }
}

customElements.define('sc-settings-menu', SCSettingsMenu);
