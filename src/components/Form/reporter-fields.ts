import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import {FieldLabels} from '../../config/settings.json';
import { contactList } from "../../entry/index";


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
        //console.log(this.autoFillFields('Carla'))
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


    
        

            /*
            for(let contact in contactList){
                if(contact.startsWith(searchString.join(''))){
                    this.reporter = contact;
                    this.email = contactList[contact].email;
                    this.phone = contactList[contact].phone;
                }
            }*/
        //}

        /*for (let contact in contactList){
            if(contact.startsWith(e.key)){
                this.reporter = contact;
                this.email = contactList[contact].email;
                this.phone = contactList[contact].phone;
            }
        }*/
    

    _setReporterFields = (e: CustomEvent) =>{
        const {label, value} = e.detail;

        const autoFill = (searchString: string): string => {
            this.reporter = ''
            this.email = ''
            this.phone = ''

            for (let contact in contactList){
                if(contact.startsWith(searchString)){
                    this.reporter = contact;
                    this.email = contactList[contact].email;
                    this.phone = contactList[contact].phone;
                } else {
                    this.reporter = searchString;
                }
            }

            return this.reporter;
        }
        
        switch(label){
            case 'Full Name':
                this.reporter = autoFill(value);
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