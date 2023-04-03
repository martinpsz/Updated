import { processedData } from "../../entry/index.js";
import { LitElement, html, css } from "lit";
import { customElement} from "lit/decorators.js";
import "./components/unit-container";



@customElement("unit-list")
export class UnitList extends LitElement {
    static styles = css`

    `
    protected render() {
        return html`
            <unit-container 
                .unit_data=${processedData}>
            </unit-container>
        `
    }

}


declare global {
    interface HTMLElementTagNameMap {
        "unit-list": UnitList;
    }
}