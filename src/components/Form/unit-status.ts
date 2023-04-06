import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import '../Form/form-header';
import {FieldLabels} from '../../config/settings.json';
import '../atoms/radio-prompt';
import '../atoms/input-field';
import '../Form/wage-section';
import '../Form/comment-submit';
import {WageEventInterface} from '../../interfaces/interface.js';

@customElement('unit-status')
export class UnitStatus extends LitElement {
    static styles = css`
        :host{
            width: 100%;
        }

        

        .unit-status-meta{
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            grid-column-gap: 1em;
            margin: 1.25em 0;
        }
    `

    @state()
    _activeStatus!: {question: string, toggleSelection : 'Yes' | 'No'};

    @state()
    _wagesStatus!: {question: string, toggleSelection : 'Yes' | 'No'};

    @state()
    _bargainingStatus!: {question: string, toggleSelection : 'Yes' | 'No'};

    @property({type: Number})
    memberCount!: number;

    @property({type: String})
    contractStartDate!: string;

    @property({type: String})
    contractEndDate!: string;

    @property({type: File})
    cba_file!: File;

    @property({type: String})
    comment!: string;

    @property()
    RegularWageEvent!: WageEventInterface;

    @property()
    SpecialWageEvent!: WageEventInterface;


    constructor(){
        super();
        this._activeStatus = {
            question: '',
            toggleSelection: 'No'
        }

        this._wagesStatus = {
            question: '',
            toggleSelection: 'Yes'
        }

        this._bargainingStatus = {
            question: '',
            toggleSelection: 'No'
        }

    }


    protected render() {
        let {Header, QuestionActive, MemberCount, ContractDates, CBAUpload, QuestionWages, QuestionBargaining} = FieldLabels.UnitStatus;
        return html`
            <form-header title=${Header}></form-header>
            <div class="unit-status">
                <radio-prompt prompt=${QuestionActive} 
                              initialChecked="No"
                              @get-prompt-toggle-selection=${(e: CustomEvent) => this._setActiveStatus(e, QuestionActive)}>
                </radio-prompt>
                ${this._activeStatus.toggleSelection === 'No' ? html`
                    <div class="unit-status-meta">
                        <input-field label=${MemberCount} 
                                     type="number"
                                     value=${this.memberCount}
                                     @get-onchange-value=${(e: CustomEvent) => this._setUnitStatusFields(e)}>
                        </input-field>
                        <input-field label=${ContractDates.Start} 
                                     type="date"
                                     value=${this.contractStartDate}
                                     @get-debounced-value=${(e: CustomEvent) => this._setUnitStatusFields(e)}>
                        </input-field>
                        <input-field label=${ContractDates.End} 
                                     type="date"
                                     value=${this.contractEndDate}
                                     @get-debounced-value=${(e: CustomEvent) => this._setUnitStatusFields(e)}>
                        </input-field>
                        <input-field label=${CBAUpload} 
                                     type="file"
                                     value=${this.cba_file?.name}
                                     @get-onchange-value=${(e: CustomEvent) => this._setUnitStatusFields(e)}>
                        </input-field>
                    </div>
                    <radio-prompt prompt=${QuestionWages} 
                                  initialChecked="Yes"
                                  @get-prompt-toggle-selection=${(e: CustomEvent) => this._setWageStatus(e, QuestionWages)}>
                    </radio-prompt>
                    ${this._wagesStatus.toggleSelection === 'No' ? html`
                        <radio-prompt prompt=${QuestionBargaining}
                                      initialChecked="No"
                                      @get-prompt-toggle-selection=${(e: CustomEvent) => this._setBargainingStatus(e, QuestionBargaining)}>
                        </radio-prompt>
                        <comment-submit .value=${this.comment}></comment-submit>
                    ` : html`
                            <wage-section .RegularWageEvent=${this.RegularWageEvent}
                                          .SpecialWageEvent=${this.SpecialWageEvent}>
                            </wage-section>
                            <comment-submit .value=${this.comment}></comment-submit>
                            `}
                ` : html`<comment-submit .value=${this.comment}></comment-submit>`}
            </div>
        `
    }

    _setActiveStatus = (e: CustomEvent, question: string) =>{
        this._activeStatus = {
            question: question,
            toggleSelection: e.detail.toggleSelection
        }

        this.dispatchEvent(new CustomEvent('get-inactive-status', {
            detail: e.detail.toggleSelection,
            bubbles: true,
            composed: true
        }))
    }

    _setWageStatus = (e: CustomEvent, question: string) =>{ 
        this._wagesStatus = {
            question: question,
            toggleSelection: e.detail.toggleSelection
        }

        this.dispatchEvent(new CustomEvent('get-wage-status', {
            detail: e.detail.toggleSelection,
            bubbles: true,
            composed: true
        }))
    }

    _setBargainingStatus = (e: CustomEvent, question: string) =>{ 
        this._bargainingStatus = {
            question: question,
            toggleSelection: e.detail.toggleSelection
        }

        this.dispatchEvent(new CustomEvent('get-bargaining-status', {
            detail: e.detail.toggleSelection,
            bubbles: true,
            composed: true
        }))
    }

    _setUnitStatusFields = (e: CustomEvent) => {
        const {label, value} = e.detail;
        switch(label){
            case 'Number of members':
                this.memberCount = value;
                break;
            case 'Latest CBA Start':
                this.contractStartDate = value;
                break;
            case 'Latest CBA End':
                this.contractEndDate = value;
                break;
            case 'Upload Latest CBA':
                this.cba_file = value[0];
                break;
        }

        this.dispatchEvent(new CustomEvent('get-unit-status', {
            detail: {
                memberCount: this.memberCount,
                contractStartDate: this.contractStartDate,
                contractEndDate: this.contractEndDate,
                cba_file: this.cba_file
            },
            bubbles: true,
            composed: true
        }))
        
    }

    

}

declare global {
    interface HTMLElementTagNameMap {
        'unit-status': UnitStatus;
    }
}