import { LitElement, html, css, nothing, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import './wage-event'
import './form-header'
import '../atoms/radio-prompt'
import './special-event'
import '../atoms/button-comp'
import {FieldLabels} from '../../config/settings.json';
import {WageEventInterface} from '../../interfaces/interface.js';

@customElement('special-section')
export class SpecialSection extends LitElement {
    static styles = css`
        div{
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
    _specialRaise = false;

    //@state()
    //_specialRaiseArray: Array<TemplateResult> = []; // holds templates added on click of add new special raise

    //@state()
    //_initialSpecialWageEventArray: Array<WageEventInterface> = []; //Provides a starting proint for collect wage events.

    //@state()
   // _specialWageEventArray: Array<WageEventInterface> = []; //New wage events that are added to the initial array.

    //@property()
    //SpecialWageEvent!: WageEventInterface;

    @property()
    special_wage_events!: Array<WageEventInterface>;

    @property()
    section_notes!: string;

    protected render() {
        let {Header, QuestionSpecialRaise} = FieldLabels.SpecialIncreases;
        return html`
            <form-header title=${Header} warning=${this.section_notes}></form-header>
            <div>
                <radio-prompt prompt=${QuestionSpecialRaise}
                @get-toggle-selection=${this._setSpecialRaise}>
                </radio-prompt>
                ${this._specialRaise ? 
                    this.special_wage_events?.map((wageEvent: WageEventInterface) => {
                        return wageEvent.key === '0' ? 
                        html`
                            <special-event key=${wageEvent.key}
                                id='first'
                                effective_date=${wageEvent.effective_date}
                                wage_event_type=${wageEvent.wage_event_type}
                                wage_event_value=${wageEvent.wage_event_value}
                                starting_value=${wageEvent.starting_value}
                                num_affected=${wageEvent.num_affected}
                                description=${wageEvent.description}
                                supporting_doc=${wageEvent.supporting_doc}
                                @get-special-event-data=${(e: CustomEvent) => this._setSpecialWageEvent(e, 'ADD-RAISE')}
                            </special-event>
                        `: html`
                            <special-event key=${wageEvent.key}
                                effective_date=${wageEvent.effective_date}
                                wage_event_type=${wageEvent.wage_event_type}
                                wage_event_value=${wageEvent.wage_event_value}
                                starting_value=${wageEvent.starting_value}
                                @get-special-event-data=${(e: CustomEvent) => this._setSpecialWageEvent(e, 'ADD-RAISE')}
                                @remove-raise=${(e: CustomEvent) => this._setSpecialWageEvent(e, 'REMOVE-RAISE')}>
                            </special-event>
                        `
                    }
                    ): nothing}
                ${this._specialRaise ? html`
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

        if(this._specialRaise === false){
            this.special_wage_events = [{key: '0', effective_date: '', wage_event_type: '% increase', wage_event_value: null, starting_value: null, num_affected: null, description: '', supporting_doc: new File([], '')} as WageEventInterface];
            this.section_notes = '';
        }
    }


    _addSpecialRaise = () => {
        this.special_wage_events = [...this.special_wage_events, {key: this.special_wage_events.length.toString(), effective_date: '', wage_event_type: '% increase', wage_event_value: null, starting_value: null, num_affected: null, description: '', supporting_doc: new File([], '')}]
    }


    _setSpecialWageEvent = (e: CustomEvent, typeOfEvent: 'ADD-RAISE' | 'REMOVE-RAISE') => {
        if (typeOfEvent === 'ADD-RAISE'){
            const addToSpecialWageArray = (currWageArray: Array<WageEventInterface>, newWageEvent: WageEventInterface) => {

                const indexMatch = currWageArray.findIndex(wageEvent => wageEvent.key === newWageEvent.key)
    
                if(indexMatch !== -1){
                    currWageArray[indexMatch] = newWageEvent;
                } else {
                    currWageArray.push(newWageEvent)
                }
                
                return currWageArray;
            }
    
            this.special_wage_events = addToSpecialWageArray(this.special_wage_events, e.detail)
        }

        if (typeOfEvent === 'REMOVE-RAISE'){
            const removeFromSpecialWageArray = (currWageArray: Array<WageEventInterface>, key: string) => {
                
                const newCurrWageArray = currWageArray.filter(wageEvent => wageEvent.key !== key)

                return newCurrWageArray;
   
            }

            this.special_wage_events = removeFromSpecialWageArray(this.special_wage_events, e.detail)
        }

        this.dispatchEvent(new CustomEvent('get-special-event-array', {
            detail: this.special_wage_events,
            bubbles: true,
            composed: true
        }))


        //Section error handling:

        this.special_wage_events.forEach((wageEvent) => {
            console.log(wageEvent)
            if ((wageEvent.wage_event_type === 'hourly increase' || wageEvent.wage_event_type === 'hourly decrease') && wageEvent.starting_value === null){
                this.section_notes = FieldLabels.Errors.StartingHourlyMissing;
            }

            else if(wageEvent.wage_event_type === 'lump sum/bonus' && wageEvent.starting_value === null){
                this.section_notes = FieldLabels.Errors.StartingAnnualMissing;
            }
    
            else {
                this.section_notes = ''
            }
    
        })

    }   
}


declare global {
    interface HTMLElementTagNameMap {
        'special-section': SpecialSection;
    }
}