import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import Logo from '../assets/afscme.webp';

@customElement("html-header")
export class HtmlHeader extends LitElement {
    static styles = css`
        header {  
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 6em;
        }

        @media (min-width: 768px){
            header{
                height: 8em;
            }
        }

        img {
            height: 4em;
        }

        @media (min-width: 768px){
            img{
                height: 6em;
            }
        }
        
        h1{
            font-family: var(--font-family);
            font-size: 1em;
            margin: 0;
            font-weight: 300;
        }

        @media (min-width: 768px){
            h1{
                font-size: 1.25em;
            }
        }
    `


    protected render() {
        return html`
            <header>
                <img src="${Logo}" alt="AFSCME Logo" />
                <h1>Minimum Dues Reporting</h1>
            </header>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "html-header": HtmlHeader;
    }
}