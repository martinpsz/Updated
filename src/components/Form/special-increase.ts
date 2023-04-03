import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import '../Form/wage-events'
import '../Form/form-header'
import '../atoms/radio-prompt.js'
import {FieldLabels} from '../../config/settings.json'  assert { type: "json" };

@customElement('special-increase')
export class SpecialIncrease extends LitElement {
    @state()
    _specialRaise = false;


    protected render() {
        let {Header, QuestionSpecialRaise} = FieldLabels.SpecialIncreases;
        return html`
            <form-header title=${Header}></form-header>
            <div>
                <radio-prompt prompt=${QuestionSpecialRaise}
                              @get-toggle-selection=${this._setSpecialRaise}>
                </radio-prompt>
                ${this._specialRaise ? html`<wage-events specialRaise></wage-events>
                <button-comp buttonText=${FieldLabels.RaiseFields.AddSpecialRaise} 
                primary
                icon="ic:baseline-add-chart"
                </button-comp>
                ` : nothing}
            </div>

        `
    }

    _setSpecialRaise = (e: CustomEvent) => {
        this._specialRaise = e.detail === 'Yes' ? true : false;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'special-increase': SpecialIncrease;
    }
}