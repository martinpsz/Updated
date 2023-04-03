import { LitElement, html, css, nothing, TemplateResult} from "lit";
import { customElement, state} from "lit/decorators.js";
import '../Form/form-header';
import '../Form/wage-events';
import '../Form/special-increase'
import {FieldLabels} from '../../config/settings.json'  assert { type: "json" };
import {WageEvent} from '../../interfaces/interface.js';

@customElement('wage-section')
export class WageSection extends LitElement {
    static styles = css`
        :host{
            display: flex;
            flex-direction: column;
        }

        button-comp{
            align-self: flex-end;
            margin-top: 1em;
        }
    
    `

    @state()
    _regularRaiseArray: Array<TemplateResult> = [];


    protected render() {
        return html`
            <form-header title=${FieldLabels.AcrossTheBoard.Header}></form-header>
            <wage-events></wage-events>
            ${this._regularRaiseArray.map((item) => item)}
            <button-comp buttonText=${FieldLabels.RaiseFields.AddRegularRaise} 
            primary
            @click=${this._addRegularRaise}
            icon="ic:baseline-add-chart">
            </button-comp>
            <special-increase></special-increase>
        `
    }

    _addRegularRaise = () => {
        this._regularRaiseArray = [...this._regularRaiseArray, html`<wage-events></wage-events>`]
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'wage-section': WageSection;
    }
}