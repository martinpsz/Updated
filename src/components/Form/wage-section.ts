import { LitElement, html, css } from "lit";
import { customElement, property} from "lit/decorators.js";
import '../Form/form-header';
import '../Form/wage-events';
import '../Form/special-increase'
import {FieldLabels} from '../../config/settings.json'  assert { type: "json" };

@customElement('wage-section')
export class WageSection extends LitElement {



    protected render() {
        return html`
            <form-header title=${FieldLabels.AcrossTheBoard.Header}></form-header>
            <wage-events></wage-events>
            <special-increase></special-increase>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'wage-section': WageSection;
    }
}