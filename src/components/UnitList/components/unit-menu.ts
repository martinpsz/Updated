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

        .filter{
            margin-top: 1em;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
        }

        .filter span{
            font-size: 0.8em;
            text-transform: uppercase;
        }

        .filter-option{
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .filter-option label{
            font-size: 0.9em;
            line-height: 1.1em;
        }

        input[type=radio]{
            height: 1em;
            //outline: 1px solid red;
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
                <span>Filter by:</span>
                <div class="filter-option">
                    <input type="radio" name="filter" id="all" value="all" checked>
                    <label for="all">All</label>
                
                    <input type="radio" name="filter" id="review" value="review">
                    <label for="review">Review Needed</label>
              
                    <input type="radio" name="filter" id="ready" value="ready">
                    <label for="ready">Ready for Submission</label>
             
                    <input type="radio" name="filter" id="submitted" value="submitted">
                    <label for="submitted">Submitted</label>
                </div>
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