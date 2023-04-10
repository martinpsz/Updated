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

    @property()
    filterBy: string = 'all';
    
    protected render() {
        return html`
            <unit-container 
                .unit_data=${processedData}
                searchTerm=${this.searchTerm}
                filterBy=${this.filterBy}>
            </unit-container>
            <unit-menu @filter-by-search-term=${this._setSearchTerm}
                       @filter-by-filter-term=${this._setSearchFilter}>
            </unit-menu>
        `
    }

    _setSearchTerm = (e: CustomEvent) => {
        this.searchTerm = e.detail.toLowerCase()
    }

    _setSearchFilter = (e: CustomEvent) => {
        this.filterBy = e.detail.toLowerCase()
    }


}


declare global {
    interface HTMLElementTagNameMap {
        "unit-list": UnitList;
    }
}