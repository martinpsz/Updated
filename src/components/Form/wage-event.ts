import {LitElement, html, css}  from 'lit';
import {customElement, property} from 'lit/decorators.js';
import '../atoms/input-field';
import '../atoms/raise-select';
import './form-header';
import '../atoms/button-comp';
import {FieldLabels} from '../../config/settings.json';
import {WageEventInterface} from '../../interfaces/interface.js';
import {wageValueAdjusted} from '../Form/utilities/wageValueAdjusted.js';


@customElement('wage-event')
export class WageEvent extends LitElement {
    static styles = css`
        :host{
            display: flex;
            flex-direction: column;
            margin-bottom: 0.5em;
            padding: 0.25em;
        }


        :host(#first) .remove{
            display: none;
        }

        .wage-event{
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr 2em;
            grid-template-areas: 'effective-date raise-select raise-amount starting-wage remove'
                                'num-affected description description description .'
                                'upload upload . . .';
            grid-column-gap: 1em;
            margin: 1em 0;
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
            margin-top: -0.5em;
            cursor: pointer;
            grid-area: remove;
        }


        button-comp{
            margin-top: 1em;
            align-self: end;
        }

    `

    @property()
    key!: WageEventInterface['key'];

    @property({type: String})
    effective_date!: WageEventInterface['effective_date']; 

    @property()
    wage_event_type: WageEventInterface['wage_event_type'] = '% increase';

    @property()
    wage_event_value!: WageEventInterface['wage_event_value'];

    @property()
    starting_value!: WageEventInterface['starting_value'];

    @property()
    RegularWageEvent!: WageEventInterface;


    protected render(){
        return html`
            <div class="wage-event" key=${this.key}>
                <input-field label=${FieldLabels.RaiseFields.EffectiveDate} 
                             type='date'
                             value=${this.effective_date}
                             @get-debounced-value=${(e:CustomEvent) => this._update_wage_event(e, 'effective_date')}
                             id="effective-date">
                </input-field>
                <raise-select label=${FieldLabels.RaiseFields.SelectRaise}
                              selected_option=${this.wage_event_type}
                              @get-raise-type=${(e: CustomEvent) => this._update_wage_event(e, 'wage_event_type')}
                              id="raise-select">
                </raise-select>
                ${this.wage_event_type === "% increase" || this.wage_event_type === "% decrease" ? html`
                    <div class="field-with-span" id="raise-amount">
                        <input-field label=${this.wage_event_type} 
                                     type="text"
                                     value=${this.wage_event_value}
                                    @get-debounced-value=${(e:CustomEvent) => this._update_wage_event(e, 'wage_event_value')}
                                     >
                        </input-field>
                        <span class=${this.wage_event_type === '% decrease' && 'red'}>%</span>
                    <div>
                ` : html`
                    <div class="field-with-span" id="raise-amount">
                        <input-field label=${this.wage_event_type} 
                                     type="text"
                                     value=${this.wage_event_value}
                                    @get-debounced-value=${(e:CustomEvent) => this._update_wage_event(e, 'wage_event_value')}
                                     >
                        </input-field>
                        <span class=${this.wage_event_type === 'hourly decrease' && 'red'}>$</span>
                    </div>
                    <div class="field-with-span" id="starting-wage">
                        <input-field label=${this.wage_event_type === 'lump sum/bonus' ? 'Starting Annual' : 'Starting Hourly'} 
                        type="text"
                        value=${this.starting_value}
                        @get-debounced-value=${(e: CustomEvent) => this._update_wage_event(e, 'starting_pay')}>
                        </input-field>
                        <span>$</span>
                    </div>
                `}
                <span class='remove' @click=${this._removeRaiseFromWageArray}>&#x2715;</span>
            </div>
        `
    }

    _removeRaiseFromWageArray = () => {
        this.dispatchEvent(new CustomEvent('remove-raise', {
            detail: this.key,
            bubbles: true,
            composed: true
        }));
    }

    _update_wage_event = (e: CustomEvent, event_type: string) => {
        switch(event_type){
            case 'effective_date':
                const checkedDate = this._setEffectiveDate(e, e.detail.value)
                this.effective_date = checkedDate;
                break;
            case 'wage_event_type':
                this.wage_event_type = e.detail.toLowerCase()
                break;
            case 'wage_event_value':
                this.wage_event_value = e.detail?.value
                break;
            case 'starting_pay':
                this.starting_value = e.detail?.value
                break;   
        }


        this.RegularWageEvent = {
                key: this.key,
                effective_date: this.effective_date,
                wage_event_type: this.wage_event_type,
                wage_event_value: wageValueAdjusted(this.wage_event_type, this.wage_event_value),
                starting_value: this.wage_event_type === '% increase' || this.wage_event_type === '% decrease' ? null : this.starting_value ? '$'+this.starting_value : null,
        }


        this.dispatchEvent(new CustomEvent('get-wage-event-data', {
            detail: this.RegularWageEvent,
            bubbles: true,
            composed: true
        }))

    }


    _setEffectiveDate = (e: any, date:any) => {
        const component = e.target as any; //fix type here
        const input = component?.renderRoot.querySelector('input')
        const dateVal = date
        const dateValParsed = Date.parse(dateVal)

        const minDate = Date.parse(FieldLabels.InputFieldSettings.date.min)
        const maxDate = Date.parse(FieldLabels.InputFieldSettings.date.max)
    
        
        if(minDate <= dateValParsed && dateValParsed <= maxDate){ 
            input?.setCustomValidity('')
        }
        else{
            input?.setCustomValidity(FieldLabels.Errors.DateOutOfRange)
            input?.reportValidity()
        }

        return dateVal
    }

   

    

   

    
    
    
}

declare global {
    interface HTMLElementTagNameMap {
        'wage-event': WageEvent;
    }
}
