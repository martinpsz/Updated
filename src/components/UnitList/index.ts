import { processedData } from "../../entry/index.js";
import { LitElement, html, css } from "lit";
import { customElement, property} from "lit/decorators.js";
import "./components/unit-container";
import { Unit, FormPayload } from "../../interfaces/interface.js";
import './components/unit-menu'


@customElement("unit-list")
export class UnitList extends LitElement {
    static styles = css`
        :host {
            background-color: rgb(var(--black));
        }

    `

    @property()
    searchTerm: string = '';
    
    protected render() {
        return html`
            <unit-container 
                .unit_data=${processedData}
                searchTerm=${this.searchTerm}>
            </unit-container>
            <unit-menu @filter-by-search-term=${this._setSearchFilter}></unit-menu>
        `
    }

    _setSearchFilter = (e: CustomEvent) => {
        this.searchTerm = e.detail
    }

}


declare global {
    interface HTMLElementTagNameMap {
        "unit-list": UnitList;
    }
}