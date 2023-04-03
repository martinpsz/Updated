import { LitElement, html, css, nothing} from "lit";
import { customElement, property} from "lit/decorators.js";
import '../Form/form-header';
import '../Form/wage-events';
import '../Form/special-increase'
import {FieldLabels} from '../../config/settings.json'  assert { type: "json" };
import {WageEvent} from '../../interfaces/interface.js';

@customElement('wage-section')
export class WageSection extends LitElement {

    @property()
    regular_raises!: Array<WageEvent>;

    @property()
    special_raises!: Array<WageEvent>;

    protected render() {
        return html`
            <form-header title=${FieldLabels.AcrossTheBoard.Header}></form-header>
            <wage-events></wage-events>
            <button-comp buttonText=${FieldLabels.RaiseFields.AddRegularRaise} 
            primary
            icon="ic:baseline-add-chart"
            </button-comp>
            <special-increase></special-increase>
        `
    }

    /*_updateWageEvents = (e: CustomEvent) => {
        this.regular_raises = e.detail.regularRaise;
    }

    _updateSpecialWageEvents = (e: CustomEvent) => {
        this.special_raises = e.detail.specialRaise;
    }*/
}

declare global {
    interface HTMLElementTagNameMap {
        'wage-section': WageSection;
    }
}