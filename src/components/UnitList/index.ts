import { processedData } from "../../entry/index.js";
import { LitElement, html, css } from "lit";
import { customElement, property} from "lit/decorators.js";
import "./components/unit-container";
import { Unit, FormPayload } from "../../interfaces/interface.js";



@customElement("unit-list")
export class UnitList extends LitElement {
    static styles = css`
        :host {
            background-color: rgb(var(--black));
        }
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