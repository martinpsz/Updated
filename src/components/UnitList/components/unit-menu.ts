import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { debounce } from "../../../utilities/debounce.js";


@customElement("unit-menu")
export class UnitMenu extends LitElement {
    static styles = css`
        .unit-menu{
            padding: 1.25em 0.5em;
            font-family: var(--font-family);
            color: rgb(var(--white));
        }

        .search{
            display: flex;
            align-items: center;
            justify-content: center;
        }

        input {
            background: inherit;
            border: none;
            border-bottom: 1px solid rgba(var(--white), 0.75);
            width: 90%;
            font-size: 1em;
            padding: 0.25em;
            color: rgb(var(--white));

        }

        input::placeholder{
            color: rgba(var(--white), 0.75);
        }

        input:focus{
            outline: transparent;
        }
    `

    protected render() {
        return html`
           <div class=unit-menu>
            <div class=search>
                <iconify-icon icon="ic:round-manage-search" style="color: white;" width="24"></iconify-icon>
                <input type="text" id="search-input" placeholder="Search by unit or reporter name" @input=${debounce(this._getSearchTerm)}>
            </div>
            <div class=filter>
            
            </div>
           </div>
        `
    }

    _getSearchTerm = () => {
        const inputElement = this.renderRoot.querySelector("#search-input") as HTMLInputElement;
        const searchTerm = inputElement.value;
        
        this.dispatchEvent(new CustomEvent("filter-by-search-term", {
            detail: searchTerm,
            bubbles: true,
            composed: true
        }))
    }

}

declare global {
    interface HTMLElementTagNameMap {
        "unit-menu": UnitMenu;
    }
}