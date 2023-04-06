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

    constructor(){
        super()

        this._initialSpecialWageEventArray = [{key: '0', effective_date: '', wage_event_type: '% increase', wage_event_value: null, starting_value: null,
        num_affected: null, description: '', supporting_doc: new File([], '')}]
    }


    protected render() {
        console.log('Special raise events:', this._specialWageEventArray)
        let {Header, QuestionSpecialRaise} = FieldLabels.SpecialIncreases;
        return html`
            <form-header title=${Header}></form-header>
            <div>
                <radio-prompt prompt=${QuestionSpecialRaise}
                              @get-toggle-selection=${this._setSpecialRaise}>
                </radio-prompt>
                ${this._specialRaise ? html`<special-event id="first" key='0' .SpecialWageEvent=${this.SpecialWageEvent} @get-special-event-data=${this._setSpecialWageEvent}></special-event>
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
    }

    _addSpecialRaise = () => {
        let key = this._specialRaiseArray.length + 1;

        this._specialWageEventArray.push({key: key.toString(), effective_date: '', wage_event_type: '% increase', wage_event_value: null, starting_value: null,
        num_affected: null, description: '', supporting_doc: new File([], '')})

        const newSpecialRaise = html`<special-event id=${key} key=${key} .SpecialWageEvent=${this._specialWageEventArray} @get-special-event-data=${this._setSpecialWageEvent}></special-event>`

        this._specialRaiseArray = [...this._specialRaiseArray, newSpecialRaise]
    }


    _setSpecialWageEvent = (e: CustomEvent) => {
        const updateSpecialWageArray = (currWageArray: Array<WageEventInterface>, newWageEvent: WageEventInterface) => {

            const indexMatch = currWageArray.findIndex((wageEvent) => wageEvent.key === newWageEvent.key)

            if(indexMatch !== -1){
                currWageArray[indexMatch] = newWageEvent
            }else{
                currWageArray.push(newWageEvent)
            }

            return currWageArray
    }

        this._specialWageEventArray = updateSpecialWageArray(this._initialSpecialWageEventArray, e.detail)
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'special-section': SpecialSection;
    }
}