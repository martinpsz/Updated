import {LitElement, html, css, nothing, TemplateResult}  from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import '../atoms/input-field';
import '../atoms/raise-select';
import './form-header';
import '../atoms/button-comp';
import {FieldLabels} from '../../config/settings.json';
import {WageEventList, WageEvent} from '../../interfaces/interface.js';


@customElement('wage-events')
export class WageEvents extends LitElement {
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

    @property({type: Boolean})
    specialRaise = false;

    @property()
    key!: WageEvent['key'];

    @property({type: String})
    effective_date!: WageEvent['effective_date']; 

    @property()
    wage_event_type: WageEvent['wage_event_type'] = '% increase';

    @property()
    wage_event_value!: WageEvent['wage_event_value'];

    @property()
    starting_hourly!: WageEvent['starting_hourly'];

    @property()
    starting_annual!: WageEvent['starting_annual'];

    @property()
    num_affected!: WageEvent['num_affected'];

    @property()
    description!: WageEvent['description'];

    @property()
    supporting_doc!: WageEvent['supporting_doc'];

    @property()
    RegularWageEvent!: WageEvent;

    @property()
    SpecialWageEvent!: WageEvent;




    protected render(){
        console.log(this.RegularWageEvent)
        return html`
            <div class="wage-event ${this.specialRaise && 'special-raise'}">
                <input-field label=${FieldLabels.RaiseFields.EffectiveDate} 
                             type='date'
                             value=${this.RegularWageEvent?.effective_date}
                             @get-debounced-value=${(e:CustomEvent) => this._update_wage_event(e, 'effective_date')}
                             id="effective-date">
                </input-field>
                <raise-select label=${FieldLabels.RaiseFields.SelectRaise}
                              selected_option=${this.RegularWageEvent?.wage_event_type}
                              @get-raise-type=${(e: CustomEvent) => this._update_wage_event(e, 'wage_event_type')}
                              id="raise-select">
                </raise-select>
                ${this.RegularWageEvent?.wage_event_type === "% increase" || this.RegularWageEvent?.wage_event_type === "% decrease" ? html`
                    <div class="field-with-span" id="raise-amount">
                        <input-field label=${this.RegularWageEvent?.wage_event_type} 
                                     type="number"
                                     value=${this.RegularWageEvent?.wage_event_value}
                                    @get-debounced-value=${(e:CustomEvent) => this._update_wage_event(e, 'wage_event_value')}
                                     >
                        </input-field>
                        <span class=${this.RegularWageEvent?.wage_event_type === '% decrease' && 'red'}>%</span>
                    <div>
                ` : html`
                    <div class="field-with-span" id="raise-amount">
                        <input-field label=${this.RegularWageEvent?.wage_event_type} 
                                     type="number"
                                     value=${this.RegularWageEvent?.wage_event_value}
                                    @get-debounced-value=${(e:CustomEvent) => this._update_wage_event(e, 'wage_event_value')}
                                     >
                        </input-field>
                        <span class=${this.RegularWageEvent?.wage_event_type === 'hourly decrease' && 'red'}>$</span>
                    </div>
                    <div class="field-with-span" id="starting-wage">
                        <input-field label=${this.RegularWageEvent?.wage_event_type === 'lump sum/bonus' ? 'Starting Annual' : 'Starting Hourly'} 
                        type="number"
                        value=${this.RegularWageEvent?.wage_event_type === 'lump sum/bonus' ? this.RegularWageEvent?.starting_annual : this.RegularWageEvent?.starting_hourly}
                        @get-debounced-value=${(e: CustomEvent) => this._update_wage_event(e, 'starting_pay')}>
                        </input-field>
                        <span>$</span>
                    </div>
                `}
                <span class='remove' @click=${this._removeRaiseFromWageArray}>&#x2715;</span>
                ${this.specialRaise ? html`
                    <input-field label=${FieldLabels.RaiseFields.NumberAffected} type="number" id="num-affected" value=${this.num_affected}>
                    </input-field>
                    <input-field label=${FieldLabels.RaiseFields.Description} type="text" id="description" value=${this.description}>
                    </input-field>
                    <input-field label=${FieldLabels.RaiseFields.FileUpload} type="file" id="upload" value=${this.supporting_doc}>
                ` : nothing}
            </div>
        `
    }

    _update_wage_event = (e: CustomEvent, event_type: string) => {
        switch(event_type){
            case 'effective_date':
                const checkedDate = this._setEffectiveDate(e, e.detail.value)
                
                this.RegularWageEvent = {...this.RegularWageEvent, effective_date: checkedDate}
                break;
            case 'wage_event_type':
                this.RegularWageEvent = {...this.RegularWageEvent, wage_event_type: e.detail.toLowerCase(), wage_event_value: null, starting_hourly: null, starting_annual: null}
                break;
            case 'wage_event_value':
                console.log(`Wage event value`, e.detail.value)
                if(this.RegularWageEvent.wage_event_type === '% increase' || this.RegularWageEvent.wage_event_type === '% decrease'){
                    this.RegularWageEvent = {...this.RegularWageEvent, wage_event_value: e.detail?.value}
                } else if (this.RegularWageEvent.wage_event_type === 'lump sum/bonus' || this.RegularWageEvent.wage_event_type === 'hourly increase' || this.RegularWageEvent.wage_event_type === 'hourly decrease') {
                    this.RegularWageEvent = {...this.RegularWageEvent, wage_event_value: e.detail?.value}
                }
                break;
            case 'starting_pay':
                console.log(`Starting pay`, e.detail.value)
                if(this.RegularWageEvent.wage_event_type === 'lump sum/bonus'){
                    this.RegularWageEvent = {...this.RegularWageEvent, starting_annual: e.detail?.value, starting_hourly: null}
                } else if (this.RegularWageEvent.wage_event_type === 'hourly increase' || this.RegularWageEvent.wage_event_type === 'hourly decrease') {
                    this.RegularWageEvent = {...this.RegularWageEvent, starting_hourly: e.detail?.value, starting_annual: null}
                } 
                break;
                
        }
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

   

    _removeRaiseFromWageArray = () =>{
        //console.log(this)
    }

   

    
    
    
}

declare global {
    interface HTMLElementTagNameMap {
        'wage-events': WageEvents;
    }
}
