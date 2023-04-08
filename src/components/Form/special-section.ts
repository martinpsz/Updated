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

    @state()
    _specialRaiseArray: Array<TemplateResult> = []; // holds templates added on click of add new special raise

    @state()
    _initialSpecialWageEventArray: Array<WageEventInterface> = []; //Provides a starting proint for collect wage events.

    @state()
    _specialWageEventArray: Array<WageEventInterface> = []; //New wage events that are added to the initial array.

    @property()
    SpecialWageEvent!: WageEventInterface;

    @property()
    section_notes!: string;

    constructor(){
        super()

        this._initialSpecialWageEventArray = [{key: '0', effective_date: '', wage_event_type: '% increase', wage_event_value: null, starting_value: null,
        num_affected: null, description: '', supporting_doc: new File([], '')}]
    }


    protected render() {
        let {Header, QuestionSpecialRaise} = FieldLabels.SpecialIncreases;
        return html`
            <form-header title=${Header} warning=${this.section_notes}></form-header>
            <div>
                <radio-prompt prompt=${QuestionSpecialRaise}
                              @get-toggle-selection=${this._setSpecialRaise}>
                </radio-prompt>
                ${this._specialRaise ? html`<special-event id="first" key='0' .SpecialWageEvent=${this.SpecialWageEvent} @get-special-event-data=${(e: CustomEvent) => this._setSpecialWageEvent(e, 'ADD-RAISE')}></special-event>
                ${this._specialRaiseArray.map(item => item)}
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
            this._specialRaiseArray = [];
            this._specialWageEventArray = [];
            this.section_notes = '';
        }
    }

    _addSpecialRaise = () => {
        let key = this._specialRaiseArray.length + 1;

        this._specialWageEventArray.push({key: key.toString(), effective_date: '', wage_event_type: '% increase', wage_event_value: null, starting_value: null,
        num_affected: null, description: '', supporting_doc: new File([], '')})

        const newSpecialRaise = html`<special-event id=${key} key=${key} .SpecialWageEvent=${this._specialWageEventArray} @get-special-event-data=${(e: CustomEvent) => this._setSpecialWageEvent(e, 'ADD-RAISE')} @remove-raise=${(e: CustomEvent) => this._setSpecialWageEvent(e, 'REMOVE-RAISE')}></special-event>`

        this._specialRaiseArray = [...this._specialRaiseArray, newSpecialRaise]
    }

    _setSpecialWageEvent = (e: CustomEvent, typeOfEvent: 'ADD-RAISE' | 'REMOVE-RAISE') => {
        if (typeOfEvent === 'ADD-RAISE'){
            const addToRegularWageArray = (currWageArray: Array<WageEventInterface>, newWageEvent: WageEventInterface) => {

                const indexMatch = currWageArray.findIndex(wageEvent => wageEvent.key === newWageEvent.key)
    
                if(indexMatch !== -1){
                    currWageArray[indexMatch] = newWageEvent;
                } else {
                    currWageArray.push(newWageEvent)
                }
                
                return currWageArray;
            }
    
            this._specialWageEventArray = addToRegularWageArray(this._initialSpecialWageEventArray, e.detail)
        }

        if (typeOfEvent === 'REMOVE-RAISE'){
            const removeFromRegularWageArray = (currWageArray: Array<WageEventInterface>, key: string) => {
                const indexMatch = currWageArray.findIndex(wageEvent => wageEvent.key === key)
    
                if(indexMatch !== -1){
                    currWageArray.splice(indexMatch, 1)
                }
    
                return currWageArray;
            }

            this._specialWageEventArray = removeFromRegularWageArray(this._initialSpecialWageEventArray, e.detail)
        }

        this.dispatchEvent(new CustomEvent('get-special-event-array', {
            detail: this._specialWageEventArray,
            bubbles: true,
            composed: true
        }))

        //Section error handling:

        this._specialWageEventArray.forEach((wageEvent) => {
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