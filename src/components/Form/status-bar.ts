import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import '../atoms/button-comp'

@customElement('status-bar')
export class StatusBar extends LitElement {
    static styles = css`
        :host{
            position: sticky;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1;
        }

        div{
            margin: 0 auto;
            width: 96%;
            background: rgba(var(--black), 0.9);
            color: rgb(var(--white));
            font-family: var(--font-family);
            padding: 0.5em;
            box-shadow: 0 6px 6px -3px rgba(var(--black), 0.5);
            border-bottom-left-radius: 0.25em;
            border-bottom-right-radius: 0.25em; 
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        span{
            font-weight: 300;
            display: flex;
            flex-direction: column;
        }

    `

    @property()
    statusMessage!: string;


    protected render() {
        return html`
            <div>
                <p>${this.statusMessage}</p>
                <button-comp buttonText="Upload Saved Reports"
                             icon="uil:folder-upload"
                             @click=${this._handleClick}>
                </button-comp>
            </div>
        `
    }

    _handleClick = () => {
        this.dispatchEvent(new CustomEvent('initiate-form-upload', {
            detail: 'OpenModal',
            bubbles: true,
            composed: true
        }))
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'status-bar': StatusBar;
    }
}