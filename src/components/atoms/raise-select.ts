import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";

@customElement('raise-select')
export class RaiseSelect extends LitElement{
    static styles = css`
        .raise-select{
            display: flex;
            flex-direction: column;
            position: relative;
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

        select{
            margin: 0;
            padding-top: 1.5em;
            border: none;
            border-bottom: 1px solid rgba(var(--black), 0.25);
            font-family: var(--font-family);
            font-size: 1.05em;
            font-weight: 300;
            background: rgb(var(--white));
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
        }

        select:focus{
            outline: transparent;
        }
    `

    @state()
    _selected_option = '% increase'

    render() {
        return html`
            <div class="raise-select">
                <label>Select raise event:</label>
                <select @change=${this._raiseTypeSelection}>
                    <optgroup label="Percent Adjustment">
                        <option value="% increase">% INCREASE</option>
                        <option value="% decrease">% DECREASE</option>
                    </optgroup>
                    <optgroup label="Hourly Adjustment">
                        <option value="hourly increase">HOURLY INCREASE</option>
                        <option value="hourly decrease">HOURLY DECREASE</option>
                    </optgroup>
                    <optgroup label="One-time Adjustment">
                        <option value="lump sum/bonus">LUMP SUM/BONUS</option>
                    </optgroup>
                </select>
            </div>
        `
    }

    _raiseTypeSelection = () => {
        const options = this.renderRoot.querySelectorAll('option')

        for(let i=0; i<options.length; i++){
            if(options[i].selected){
                this._selected_option = options[i].value
            }
        }

        this.dispatchEvent(new CustomEvent('get-raise-type', {
            detail: this._selected_option,
            bubbles: true,
            composed: true
        }))
    }


}

declare global {
    interface HTMLElementTagName {
        'raises-select': RaiseSelect;
    }
}