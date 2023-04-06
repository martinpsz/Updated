import { LitElement, html, css, nothing, TemplateResult} from "lit";
import { customElement, state, property} from "lit/decorators.js";
import '../Form/form-header';
import './wage-event';
import './special-section'
import {FieldLabels} from '../../config/settings.json';
import {WageEventInterface} from '../../interfaces/interface.js';



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

    constructor(){
        super()

        this._initialRegularWageEventArray = [{key: '0', effective_date: '', wage_event_type: '% increase', wage_event_value: null, starting_value: null}]
    }

    

    protected render() {
        console.log('Regular raise events:', this._regularWageEventArray)
        return html`
            <form-header title=${FieldLabels.AcrossTheBoard.Header}></form-header>

            <wage-event id="first" key='0' .RegularWageEvent=${this.RegularWageEvent} @get-wage-event-data=${this._setRegularWageEvent}></wage-event>

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

        const newWageEvent = html`<wage-event key=${key} .RegularWageEvent=${this._regularWageEventArray} @get-wage-event-data=${this._setRegularWageEvent}></wage-event>`;


        this._regularRaiseArray = [...this._regularRaiseArray, newWageEvent];
    }

    
    _setRegularWageEvent = (e: CustomEvent) => {
        const updateRegularWageArray = (currWageArray: Array<WageEventInterface>, newWageEvent: WageEventInterface) => {

            const indexMatch = currWageArray.findIndex(wageEvent => wageEvent.key === newWageEvent.key)

            if(indexMatch !== -1){
                currWageArray[indexMatch] = newWageEvent;
            } else {
                currWageArray.push(newWageEvent)
            }
            
            return currWageArray;
        }

        this._regularWageEventArray = updateRegularWageArray(this._initialRegularWageEventArray, e.detail)
        
    }

    
    
}

declare global {
    interface HTMLElementTagNameMap {
        'wage-section': WageSection;
    }
}