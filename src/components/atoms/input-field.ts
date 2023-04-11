import { LitElement, html, css, nothing, PropertyValueMap } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {FieldLabels} from '../../config/settings.json'
import { debounce } from "../../utilities/debounce.js";

@customElement("input-field")
export class InputField extends LitElement {
    static styles = css`
        .input-container{
            position: relative;
            width: 100%;
        }

        label{
            position: absolute;
            top: 0;
            left: 0;
            pointer-events: none;
            font-family: var(--font-family);
            font-weight: 300;
            text-transform: uppercase;
            font-size: 0.8em;
        }

        input{
            margin: 0;
            padding-top: 1.5em;
            border: none;
            width: calc(100% - 0.25em);
            border-bottom: 1px solid rgba(var(--black), 0.25);
            font-family: var(--font-family);
            font-size: 1em;
            background: rgb(var(--white));
        }

        input:focus{
            outline: transparent;
        }

        input:focus + label{
            color: rgb(var(--red));
        }

        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
               -webkit-appearance: none;
               margin: 0;
        }

        input[type=number] {
        -moz-appearance: textfield;
        }

        input[type=file]{
            font-family: var(--font-family);
            border: none;
        }

        input[type=file]::file-selector-button{
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            background-color: rgb(var(--blue));
            border: none;
            padding: 0.1em 1em;
            font-family: var(--font-family);
            font-weight: 300;
            text-transform: uppercase;
            color: rgb(var(--white));
        }

        input[type=date]{
            font-family: var(--font-family);
            font-weight: 300;
            font-size: 0.98em;
            
        }
        input[type='date']::-webkit-input-placeholder {
            /* Chrome/Opera/Safari */
            font-size: 0.98em;
            font-family: var(--font-family);
            outline: 1px solid blue;
          }
          
        input[type=date]::-moz-placeholder {
            /* Firefox 19+ */
            font-size: 0.98em;
            font-family: var(--font-family);
          }
          
        input[type=date]:-ms-input-placeholder {
            /* IE 10+ */
            font-size: 0.98em;
            font-family: var(--font-family);
          }
          
        input[type=date]:-moz-placeholder {
            /* Firefox 18- */
            font-size: 0.98em;
            font-family: var(--font-family);
          }
    `

    @property({type: 'string'})
    label!: string;

    @property({type: 'string'})
    value!: string;

    @property({type: 'string'})
    type!: string;

    @property({type: 'boolean'})
    required!: boolean;


    protected render() {
        return html`
            <div class="input-container">
                <input type=${this.type} 
                       id=${this.label}
                       min=${this.type === 'date' ? FieldLabels.InputFieldSettings.date.min : nothing} 
                       max=${this.type === 'date' ? FieldLabels.InputFieldSettings.date.max : nothing}
                       required=${this.required ? this.required : nothing}
                       .value=${this.type!=='file' ? this.value : nothing}
                       @input=${debounce(this._getDebouncedInput)}
                       @change=${this._getOnChangeInput}/>

                <label for=${this.label}>
                           ${this.label ? this.label+':' : nothing}
                </label>
            </div>
        `
    }

    _getDebouncedInput = () => {
        const inputElement = this.renderRoot.querySelector('.input-container input') as HTMLInputElement;
        const inputValue = inputElement.value;


        this.dispatchEvent(new CustomEvent('get-debounced-value', {
            detail: {
                value: inputValue,
                label: this.label
            }
        }))
    }

    _getOnChangeInput = (e: InputEvent) => {
        const inputTarget = e.target as HTMLInputElement;
        const inputValue = inputTarget.value;
        const inputFile = inputTarget.type === 'file' ? inputTarget.files : new File([], '');

        this.dispatchEvent(new CustomEvent('get-onchange-value', {
            detail: {
                value: inputTarget.type === 'file' ? inputFile : inputValue,
                label: this.label
            },
            bubbles: true,
            composed: true
        }))
    }



}



declare global {
    interface HTMLElementTagNameMap {
        "input-field": InputField;
    }
}