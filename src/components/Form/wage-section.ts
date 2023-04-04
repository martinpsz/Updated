import { LitElement, html, css, nothing, TemplateResult} from "lit";
import { customElement, state, property} from "lit/decorators.js";
import '../Form/form-header';
import '../Form/wage-events';
import '../Form/special-increase'
import {FieldLabels} from '../../config/settings.json';
import {WageEvent, WageEventList} from '../../interfaces/interface.js';


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

        wage-events:nth-of-type(n+2){
           border-top: 1px solid rgba(var(--blue), 0.25);
        }

    
    `

    @state()
    _regularRaiseArray: TemplateResult[] = [];

    @property()
    RegularWageEvent!: WageEvent;

    @property()
    SpecialWageEvent!: WageEvent;


    protected render() {
        return html`
            <form-header title=${FieldLabels.AcrossTheBoard.Header}></form-header>
            <wage-events id="first" 
                         key=0
                         .RegularWageEvent=${this.RegularWageEvent}>
            </wage-events>
            ${this._regularRaiseArray.map((item) => item)}

            <button-comp buttonText=${FieldLabels.RaiseFields.AddRegularRaise} 
            primary
            @click={}
            icon="ic:baseline-add-chart">
            </button-comp>
            <special-increase .SpecialWageEvent=${this.SpecialWageEvent}></special-increase>
        `
    }

    /*_addRegularRaise = () => {
        this._regularRaiseArray = [...this._regularRaiseArray,    html`<wage-events 
                                                                        key=${this._regularRaiseArray.length}
                                                                        effective_date=${this.RegularWageEvent?.effective_date}
                                                                        wage_event_type=${this.RegularWageEvent?.wage_event_type}
                                                                        wage_event_value=${this.RegularWageEvent?.wage_event_value}
                                                                        starting_hourly=${this.RegularWageEvent?.starting_hourly}
                                                                        starting_annual=${this.RegularWageEvent?.starting_annual}>
                                                                    </wage-events>`]}*/
    

    
}

declare global {
    interface HTMLElementTagNameMap {
        'wage-section': WageSection;
    }
}