import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";


@customElement("unit-element")
export class UnitElement extends LitElement {
    static styles = css`
        :host(.selected) .unit-contract-meta{
            background: rgb(var(--white));
            color: rgb(var(--red));
        }

        .unit-contract-meta{
            background-color: rgba(var(--red), 0.75);
            font-family: var(--font-family);
            color: rgb(var(--white));
            cursor: pointer;
            padding: 0.5em 0 0.5em 1em;
            margin: 0 0 0.25em 0.75em;
        }

        .unit-contract-meta span{
            font-size: 0.8em;
            text-transform: uppercase;
            font-weight: 300;
        }

        .unit-contract-meta h1{
            font-size: 1.2em;
            margin: 0;
        }

        @media (min-width: 1024px){
            .unit-contract-meta h1{
                width: 90%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
        
        
    `
    @property({type: 'number'})
    unit_id!: number;

    @property({type: 'string'})
    state!: string;

    @property({type: 'number'})
    local!: number;

    @property({type: 'number'})
    council!: number;

    @property({type: 'number'})
    number_of_members!: number;

    @property({type: 'string'})
    unit_name!: string;

    @property({type: 'number'})
    unitIndex!: number;

    @property({type: 'number'})
    unitLength!: number;


    protected render() {
        return html`
            <div class="unit-contract-meta" key=${this.unit_id}>
                ${this.state ? html`<span>${this.state}</span>` : nothing}
                ${this.local ? html`<span>L: ${this.local}</span>` : nothing}
                ${this.council ? html`<span>C: ${this.council}</span>` : nothing}
                ${this.number_of_members ? html`<span>Members: ${this.number_of_members}</span>` : nothing}
                <h1 title=${this.unit_name}>${this.unit_name}</h1>
                <div class="status-bar">
                    <span>Report: ${this.unitIndex} of ${this.unitLength}</span>
                </div>
            </div>
            
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "unit-element": UnitElement;
    }
}