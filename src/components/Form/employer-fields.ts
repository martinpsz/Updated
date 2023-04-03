import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {FieldLabels} from '../../config/settings.json';

@customElement('employer-fields')
export class EmployerFields extends LitElement {
    static styles = css`
        .employer-fields{
            display: grid;
            grid-template-columns: 3fr 1fr 1fr;
            grid-column-gap: 1em;
        }
    `
    
    @property({type: String})
    employer!: string;

    @property({type: Number})
    local!: number;

    @property({type: String})
    subunit!: string;


    protected render() {
        let {Employer, Local, Subunit} = FieldLabels.Employer;
    
        return html`
            <div class="employer-fields">
                <input-field label=${Employer} 
                             type="text" 
                             value=${this.employer}
                             required
                             @get-onchange-value=${(e: CustomEvent) => this._setEmployerFields(e)}>
                </input-field>
                <input-field label=${Local} 
                             type="number" 
                             value=${this.local}
                             required
                             @get-onchange-value=${this._setEmployerFields}
                             >
                </input-field>
                <input-field label=${Subunit} 
                             type="text"
                             value=${this.subunit}
                             required
                             @get-onchange-value=${this._setEmployerFields}>
                </input-field>
            </div>
        `
    }

    _setEmployerFields = (e: CustomEvent) =>{
        const {label, value} = e.detail;

        switch(label){
            case 'Employer':
                this.employer = value;
                break;
            case 'Local':
                this.local = Number(value);
                break;
            case 'Subunit':
                this.subunit = value;
                break;
        }

        this.dispatchEvent(new CustomEvent('get-employer-fields', {
            detail: {
                employer: this.employer,
                local: this.local,
                subunit: this.subunit
            },
            bubbles: true,
            composed: true
        }))
        
    }
       
}

declare global {
    interface HTMLElementTagNameMap {
        'employer-fields': EmployerFields;
    }
}