import { LitElement, html, css, nothing, TemplateResult, PropertyValueMap} from "lit";
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

    //@state()
    //_regularRaiseArray: TemplateResult[] = [];  // Initializes an array of HTML templates for the wage event

    //@state()
    //_initialRegularWageEventArray: Array<WageEventInterface> = []; //Provides a starting proint for collect wage events.

    //@state()
    //_regularWageEventArray: Array<WageEventInterface> = []; //New wage events that are added to the initial array.

    @property()
    RegularWageEvent!: WageEventInterface;

    @property()
    SpecialWageEvent!: WageEventInterface;

    @property()
    section_notes!: string;

    @property()
    regular_wage_events: Array<WageEventInterface> = [{key: '0', effective_date: '', wage_event_type: '% increase', wage_event_value: null, starting_value: null} as WageEventInterface] ;

    

    protected render() {
        console.log(this.regular_wage_events)
        return html`
            <form-header title=${FieldLabels.AcrossTheBoard.Header} warning=${this.section_notes}></form-header>

            

            ${this.regular_wage_events.map((wageEvent: WageEventInterface) => {
                return wageEvent.key === '0' ? 
                html`
                    <wage-event key=${'0'}
                        id='first'
                        @get-wage-event-data=${(e: CustomEvent) => this._setRegularWageEvent(e, 'ADD-RAISE')}
                    </wage-event>
                `: html`
                    <wage-event key=${wageEvent.key.toString()}
                        @get-wage-event-data=${(e: CustomEvent) => this._setRegularWageEvent(e, 'ADD-RAISE')}
                        @remove-raise=${(e: CustomEvent) => this._setRegularWageEvent(e, 'REMOVE-RAISE')}>
                    </wage-event>
                `
            }
                
                
            )}
            <button-comp buttonText=${FieldLabels.RaiseFields.AddRegularRaise} 
            primary
            @click=${this._addRegularRaise}
            icon="ic:baseline-add-chart">
            </button-comp>
            <special-section .SpecialWageEvent=${this.SpecialWageEvent}></special-section>
        `
    }

    _addRegularRaise = () => {
        console.log(this.renderRoot.querySelector('wage-event:last-of-type')?.getAttribute('key'))
        const key = this.regular_wage_events.length;
        this.regular_wage_events = [...this.regular_wage_events, {key: key.toString(), effective_date: '', wage_event_type: '% increase', wage_event_value: null, starting_value: null}]
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
    
            this.regular_wage_events = addToRegularWageArray(this.regular_wage_events, e.detail)
        }

        if (typeOfEvent === 'REMOVE-RAISE'){
            const removeFromRegularWageArray = (currWageArray: Array<WageEventInterface>, key: string) => {
                const indexMatch = currWageArray.findIndex(wageEvent => {
                    console.log(wageEvent.key, key)
                    return wageEvent.key === key 
                })
                
                if(indexMatch !== -1){
                    currWageArray.splice(indexMatch, 1)
                }
    
                //return currWageArray;
                console.log(currWageArray)
            }

            removeFromRegularWageArray(this.regular_wage_events, e.detail)

            
        }

        this.dispatchEvent(new CustomEvent('get-regular-event-array', {
            detail: this.regular_wage_events,
            bubbles: true,
            composed: true
        }))

        //Section error handling:

        this.regular_wage_events.forEach((wageEvent) => {
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