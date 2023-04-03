import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import {FieldLabels} from '../config/settings.json';


@customElement("html-footer")
export class HtmlFooter extends LitElement {
    static styles = css`
        footer{
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 3em;
        }

        @media (min-width: 500px){
            footer{
                height: 2em;
            }
        }

        small {
            font-family: var(--font-family);
            text-transform: uppercase;
            font-weight: 300;
            font-size: 0.8em;
        }

        a{
            color: rgb(var(--red));
            font-family: inherit;
        }
    
    `

    protected render() {
        return html`
            <footer>
                <small>For assistance with this form: <a href="mailto:${FieldLabels.Footer.Email}">${FieldLabels.Footer.Email}</a> / <a href="tel:${FieldLabels.Footer.Phone}">${FieldLabels.Footer.Phone}</a></small>
            </footer>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "html-footer": HtmlFooter;
    }
}