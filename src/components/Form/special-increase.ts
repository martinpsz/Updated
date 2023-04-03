import { LitElement, html, css, nothing, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import '../Form/wage-events'
import '../Form/form-header'
import '../atoms/radio-prompt.js'
import {FieldLabels} from '../../config/settings.json'  assert { type: "json" };

@customElement('special-increase')
export class SpecialIncrease extends LitElement {
    static styles = css`
        div{
            display: flex;
            flex-direction: column;
        }

        button-comp{
            align-self: flex-end;
            margin-top: 1em;
        }
    `

    @state()
    _specialRaise = false;

    @state()
    _specialRaiseArray: Array<TemplateResult> = [];


    protected render() {
        let {Header, QuestionSpecialRaise} = FieldLabels.SpecialIncreases;
        return html`
            <form-header title=${Header}></form-header>
            <div>
                <radio-prompt prompt=${QuestionSpecialRaise}
                              @get-toggle-selection=${this._setSpecialRaise}>
                </radio-prompt>
                ${this._specialRaise ? html`<wage-events specialRaise></wage-events>
                ${this._specialRaiseArray.map((item) => item)}
                <button-comp buttonText=${FieldLabels.RaiseFields.AddSpecialRaise} 
                primary
                @click=${this._addSpecialRaise}
                icon="ic:baseline-add-chart">
                </button-comp>
                ` : nothing}
            </div>

        `

    }


    _setSpecialRaise = (e: CustomEvent) => {
        this._specialRaise = e.detail === 'Yes' ? true : false;
    }

    _addSpecialRaise = () => {
        this._specialRaiseArray = [...this._specialRaiseArray, html`<wage-events specialRaise></wage-events>`]
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'special-increase': SpecialIncrease;
    }
}