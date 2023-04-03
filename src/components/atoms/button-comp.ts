import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {classMap} from "lit-html/directives/class-map.js";
import { UrlObject } from "url";

@customElement('button-comp')
export class ButtonComp extends LitElement {
    static styles = css`
        button{
            background-color: rgba(var(--red), 1);
            color: rgb(var(--white));
            border: none;
            padding: 0.5em 1em;
            text-transform: uppercase;
            font-family: var(--font-family);
            font-weight: 300;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        }

        button:disabled{
            background-color: rgba(var(--red), 0.25);
            cursor: not-allowed;
        }

        .primary{
            background-color: rgba(var(--blue), 1);
        }

        .primary:disabled{
            background-color: rgba(var(--blue), 0.25);
        }

        #icon{
            margin-right: 0.25em;
        }
    
    `

    @property()
    buttonText!: string;

    @property()
    icon!: string;

    @state()
    buttonDisabled = false;

    @property({type: Boolean})
    primary = false;

    

    protected render() {
        const classes = {primary : this.primary}
        return html`
            <button ?disabled=${this.buttonDisabled} 
                    @click=${this.handleClick}
                    class=${classMap(classes)}
                    >${this.icon ? html`<iconify-icon id="icon" icon=${this.icon} width="20" height="20"></iconify-icon>`: html``}${this.buttonText}
            </button>
        `
    }

    handleClick = () => {
        this.dispatchEvent(new CustomEvent('button-clicked', {bubbles: true, composed: true}))
    }
    
    
}

declare global {
    interface HTMLElementTagNameMap {
        'button-comp': ButtonComp;
    }
}
