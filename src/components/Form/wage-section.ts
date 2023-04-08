import { LitElement, html, css, nothing, TemplateResult} from "lit";
import { customElement, state, property} from "lit/decorators.js";
import '../Form/form-header';
import './wage-event';
import './special-section'
import {FieldLabels} from '../../config/settings.json';
import {WageEventInterface, WageEventList} from '../../interfaces/interface.js';



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
    _regularRaiseArray: TemplateResult[] = [];  // Initializes an array of HTML templates for the wage event

    @state()
    _initialRegularWageEventArray: Array<WageEventInterface> = []; //Provides a starting proint for collect wage events.

    @state()
    _regularWageEventArray: Array<WageEventInterface> = []; //New wage events that are added to the initial array.

    @property()
    RegularWageEvent!: WageEventInterface;

    @property()
    SpecialWageEvent!: WageEventInterface;

    @property()
    section_notes!: string;

    constructor(){
        super()

        this._initialRegularWageEventArray = [{key: '0', effective_date: '', wage_event_type: '% increase', wage_event_value: null, starting_value: null}]
    }

    

    protected render() {
        return html`
            <form-header title=${FieldLabels.AcrossTheBoard.Header} warning=${this.section_notes}></form-header>

            <wage-event id="first" key='0' .RegularWageEvent=${this.RegularWageEvent} @get-wage-event-data=${(e:CustomEvent) => this._setRegularWageEvent(e, 'ADD-RAISE')}></wage-event>

            ${this._regularRaiseArray.map(item => item)}
            <button-comp buttonText=${FieldLabels.RaiseFields.AddRegularRaise} 
            primary
            @click=${this._addRegularRaise}
            icon="ic:baseline-add-chart">
            </button-comp>
            <special-section .SpecialWageEvent=${this.SpecialWageEvent}></special-section>
        `
    }

    _addRegularRaise = () => {
        const key = this._regularRaiseArray.length + 1;

        this._regularWageEventArray.push({key: key.toString(), effective_date: '', wage_event_type: '% increase', wage_event_value: null, starting_value: null})

        const newWageEvent = html`<wage-event key=${key} .RegularWageEvent=${this._regularWageEventArray} @get-wage-event-data=${(e: CustomEvent) => this._setRegularWageEvent(e, 'ADD-RAISE')} @remove-raise=${(e: CustomEvent) => this._setRegularWageEvent(e, 'REMOVE-RAISE')}></wage-event>`;


        this._regularRaiseArray = [...this._regularRaiseArray, newWageEvent];
    }

    
    _setRegularWageEvent = (e: CustomEvent, typeOfEvent: 'ADD-RAISE' | 'REMOVE-RAISE') => {
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
    
            this._regularWageEventArray = addToRegularWageArray(this._initialRegularWageEventArray, e.detail)
        }

        if (typeOfEvent === 'REMOVE-RAISE'){
            const removeFromRegularWageArray = (currWageArray: Array<WageEventInterface>, key: string) => {
                const indexMatch = currWageArray.findIndex(wageEvent => wageEvent.key === key)
    
                if(indexMatch !== -1){
                    currWageArray.splice(indexMatch, 1)
                }
    
                return currWageArray;
            }

            this._regularWageEventArray = removeFromRegularWageArray(this._initialRegularWageEventArray, e.detail)
        }

        this.dispatchEvent(new CustomEvent('get-regular-event-array', {
            detail: this._regularWageEventArray,
            bubbles: true,
            composed: true
        }))

        //Section error handling:

        this._regularWageEventArray.forEach((wageEvent) => {
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
        'wage-section': WageSection;
    }
}