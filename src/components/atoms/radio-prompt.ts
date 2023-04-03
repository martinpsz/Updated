import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import '../atoms/radio-slider'

@customElement('radio-prompt')
export class RadioPrompt extends LitElement {
    static styles = css`
        div{
            display: flex;
            align-items: center;
            flex-wrap: wrap;
        }
        p{
            font-family: var(--font-family);
            margin: 0.5em 1em 0.5em 0;
            line-height: 1.5;
        }

    `

    @property({type: String})
    prompt!: 'Yes' | 'No'; 

    @property({type: String})
    initialChecked!: 'Yes' | 'No';

    protected render() {
        return html`
            <div>
                <p>${this.prompt}</p>
                <radio-slider initialChecked=${this.initialChecked}
                              @get-toggle-selection=${this._setToggleSelection}>
                </radio-slider>
            </div>
        `
    }

    _setToggleSelection = (e: CustomEvent) => {
        this.dispatchEvent(new CustomEvent('get-prompt-toggle-selection', {
            detail: {
                question: this.prompt,
                toggleSelection: e.detail
            }
        }))
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'radio-prompt': RadioPrompt;
    }
}