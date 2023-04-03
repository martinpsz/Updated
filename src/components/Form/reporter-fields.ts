import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import {FieldLabels} from '../../config/settings.json'  assert { type: "json" };

@customElement('reporter-fields')
export class ReporterFields extends LitElement {
    static styles = css`
        :host{
            width: 100%;
        }
        
        .reporter-fields{
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            grid-column-gap: 1em;
        }
    
    `
    @property()
    reporter!: string;

    @property()
    email!: string;

    @property()
    phone!: string;


    protected render() {
        let {Header, Reporter, Email, Phone} = FieldLabels.Reporter;
        return html`
            <form-header title=${Header}></form-header>
            <div class="reporter-fields">
                <input-field label=${Reporter} 
                             type="text" 
                             required
                             value=${this.reporter}
                             @get-debounced-value=${(e: CustomEvent) => this._setReporterFields(e)}>
                </input-field>
                <input-field label=${Email} 
                             type="email" 
                             required
                             value=${this.email}
                             @get-onchange-value=${(e: CustomEvent) => this._setReporterFields(e)}>
                </input-field>
                <input-field label=${Phone} 
                             type="tel" 
                             required
                             value=${this.phone}
                             @get-onchange-value=${(e: CustomEvent) => this._setReporterFields(e)}>
                </input-field>
            </div>
        `
    }

    _setReporterFields = (e: CustomEvent) =>{
        const {label, value} = e.detail;
        
        switch(label){
            case 'Full Name':
                this.reporter = value;
                break;
            case 'Email':
                this.email = value;
                break;
            case 'Phone':
                this.phone = value;
                break;
        }

        this.dispatchEvent(new CustomEvent('get-reporter-fields', {
            detail: {
                reporter: this.reporter,
                email: this.email,
                phone: this.phone
            },
            bubbles: true,
            composed: true
        }))
        
    }
    
}

declare global {
    interface HTMLElementTagNameMap {
        'reporter-fields': ReporterFields;
    }
}