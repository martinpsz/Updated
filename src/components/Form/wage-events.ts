import {LitElement, html, css, nothing, TemplateResult}  from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import '../atoms/input-field';
import '../atoms/raise-select';
import './form-header';
import '../atoms/button-comp';
import {FieldLabels} from '../../config/settings.json';
import {WageEvent} from '../../interfaces/interface.js';


@customElement('wage-events')
export class WageEvents extends LitElement {
    static styles = css`
        :host{
            display: flex;
            flex-direction: column;
        }

        .wage-event{
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr 2em;
            grid-template-areas: 'effective-date raise-select raise-amount starting-wage remove'
                                'num-affected description description description .'
                                'upload upload . . .';
            grid-column-gap: 1em;
            margin: 1em 0;
            bottom-border: 1px solid rgba(var(--black), 0.25);
        }

        .special-raise{
            grid-row-gap: 1.5em;
        }

        #effective-date{
            grid-area: effective-date;
        }

        #raise-select{
            grid-area: raise-select;
        }

        #raise-amount{
            grid-area: raise-amount;
        }

        #starting-wage{
            grid-area: starting-wage;
        }

        #num-affected{
            grid-area: num-affected;
        }

        #description{
            grid-area: description;
        }

        #upload{
            grid-area: upload;
        }

        .field-with-span{
            position: relative;
        }

        .field-with-span span{
            font-family: var(--font-family);
            font-weight: 300;
            position: absolute;
            right: 0;
            bottom: 0;
            background-color: rgb(var(--black));
            color: rgb(var(--white));
            padding: 0 0.5em;
        }

        .field-with-span .red{
            background-color: rgb(var(--red));
        }

        .remove{
            font-size: 1.5em;
            justify-self: end;
            align-self: start;
            cursor: pointer;
            grid-area: remove;
        }

        .wage-event:nth-of-type(1) .remove{
            display: none;
        }

        button-comp{
            margin-top: 1em;
            align-self: end;
        }

    `

    @property({type: Boolean})
    specialRaise = false;

    @property()
    effectiveDate!: string;

    @state()
    _raiseType!: "% increase" | "% decrease" | "hourly increase" | "hourly decrease" | "lump sum/bonus";

    @state()
    _regularWageEvents: Array<TemplateResult> = [] ;

    @state()
    _specialWageEvents: Array<TemplateResult> = [];

    constructor(){
        super();
        this._raiseType = "% increase"
    }


    protected render(){
        return html`
            <div class="wage-event ${this.specialRaise && 'special-raise'}">
                <input-field label=${FieldLabels.RaiseFields.EffectiveDate} 
                             type="date"
                             @get-debounced-value=${this._setEffectiveDate}
                             id="effective-date">
                </input-field>
                <raise-select label=${FieldLabels.RaiseFields.SelectRaise}
                              @get-raise-type=${this._setRaiseType}
                              id="raise-select">
                </raise-select>
                ${this._raiseType === "% increase" || this._raiseType === "% decrease" ? html`
                    <div class="field-with-span" id="raise-amount">
                        <input-field label=${this._raiseType} type="number">
                        </input-field>
                        <span class=${this._raiseType === '% decrease' && 'red'}>%</span>
                    <div>
                ` : html`
                    <div class="field-with-span" id="raise-amount">
                        <input-field label=${this._raiseType} type="number"></input-field>
                        <span class=${this._raiseType === 'hourly decrease' && 'red'}>$</span>
                    </div>
                    <div class="field-with-span" id="starting-wage">
                        <input-field label=${this._raiseType === 'lump sum/bonus' ? 'Starting Annual' : 'Starting Hourly'} type="number"></input-field>
                        <span>$</span>
                    </div>
                `}
                <span class='remove'>&#x2715;</span>
                ${this.specialRaise ? html`
                    <input-field label=${FieldLabels.RaiseFields.NumberAffected}        type="number" id="num-affected">
                    </input-field>
                    <input-field label=${FieldLabels.RaiseFields.Description} type="text" id="description">
                    </input-field>
                    <input-field label=${FieldLabels.RaiseFields.FileUpload} type="file" id="upload">
                ` : nothing}
            </div>
        `
    }

    _setRaiseType = (e: CustomEvent) =>{
        this._raiseType = e.detail;
    }

    _setEffectiveDate = (e: CustomEvent) =>{
        const component = e.target as any; //fix type here
        const input = component?.renderRoot.querySelector('input')
        const inputVal = Date.parse(input?.value)


        const minDate = Date.parse(FieldLabels.InputFieldSettings.date.min)
        const maxDate = Date.parse(FieldLabels.InputFieldSettings.date.max)

        console.log(`Min date:`, minDate)
        console.log(`Input date:`, inputVal)
        console.log(`Max date:`, maxDate)
        
    
        if(minDate <= inputVal && inputVal <= maxDate){ 
            console.log('Value in range')
            input?.setCustomValidity('')
        }
        else{
            
            console.log('Value of out range')
            input?.setCustomValidity(FieldLabels.Errors.DateOutOfRange)
            input?.reportValidity()
            //this.effectiveDate = inputVal;
        }
    }

}

declare global {
    interface HTMLElementTagNameMap {
        'wage-events': WageEvents;
    }
}
