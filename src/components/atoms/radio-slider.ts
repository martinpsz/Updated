import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement('radio-slider')
export class RadioSlider extends LitElement {
    static styles = css`
        .toggle-switch {
            display: inline-block;
            position: relative;
            width: 80px;
            height: 30px;
        }
        
        .toggle-switch input[type="checkbox"] {
            display: none;
        }
        
        .toggle-switch .switch {
            display: block;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: rgb(var(--red));
            transition: background-color 0.2s ease;
        }
        
        .toggle-switch .switch::before {
            display: block;
            position: absolute;
            content: "";
            width: 40px;
            height: 30px;
            top: 0px;
            left: 0px;
            background-color: rgb(var(--white), 0.85);
            transition: transform 0.3s ease-in;
        }
        
        .toggle-switch input[type="checkbox"]:checked + .switch {
            background-color: rgb(var(--green));
        }
        
        .toggle-switch input[type="checkbox"]:checked + .switch::before {
            transform: translateX(40px);
        }
        
        .toggle-switch .label-on,
        .toggle-switch .label-off {
            display: inline-block;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            font-size: 14px;
            color: rgb(var(--white));
            font-family: var(--font-family);
            text-transform: uppercase;
        }
        
        .toggle-switch .label-on {
            left: 8px;
        }
        
        .toggle-switch .label-off {
            right: 8px;
        }
        `

        @property({type: 'string'})
        initialChecked!: string;


    protected render() {
        return html`
            <label class="toggle-switch">
                <input type="checkbox" ?checked=${this.initialChecked === 'Yes' ? true : false} @input=${this._getToggleSelection}>
                <span class="switch"></span>
                <span class="label-on">Yes</span>
                <span class="label-off">No</span>
            </label>
        `
    }


    _getToggleSelection = (e: Event) => {
        const checkbox = e.target as HTMLInputElement;
        const selection = checkbox.checked === true ? 'Yes' : 'No';
        
        this.dispatchEvent(new CustomEvent('get-toggle-selection', {
            detail: selection,
            bubbles: true,
            composed: true
        }))
    }
}