import { LitElement, html, css, PropertyValueMap } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import '../Form/form-header';
import '../Form/employer-fields';
import '../Form/reporter-fields';
import '../Form/unit-status';
import '../Form/status-bar'
import { Unit, WageEvent, FormPayload, Contact } from "../../interfaces/interface.js";


@customElement('unit-form')
export class UnitForm extends LitElement {
    static styles = css`
        form{
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 1.5em;
            overflow-y: scroll;
            height: calc(100vh - 18em);
            //position: relative;  //for position the status bar
        }

        form::-webkit-scrollbar{
            width: 0.25em;
        }

        form::-webkit-scrollbar-track{
            box-shadow: inset 0 0 6px rgba(var(--white), 0.25);
        }

        form::-webkit-scrollbar-thumb{
            background: rgb(var(--green));
        }

        form-header{
           // width: 100%;
        }

    `

    @property()
    unit_data!: Unit & FormPayload;

    @property({attribute: false})
    formData!: FormPayload;


    protected render() {
        return html`
            <status-bar></status-bar>
            <form>
                <employer-fields employer=${this.unit_data?.unit_name}
                                 local=${this.unit_data?.local}
                                 subunit=${this.unit_data?.subunit}
                                 @get-employer-fields=${(e: CustomEvent) => this._setEmployerFieldData(e)}>
                </employer-fields>
                <reporter-fields reporter=${this.unit_data?.contact?.name}
                                 email=${this.unit_data?.contact?.email}
                                 phone=${this.unit_data?.contact?.phone}
                                 @get-reporter-fields=${this._setReporterFieldData}>
                </reporter-fields>
                <unit-status memberCount=${this.unit_data?.number_of_members}
                             contractStartDate=${this.unit_data?.agreement_eff_date}
                             contractEndDate=${this.unit_data?.agreement_exp_date}
                             @get-inactive-status=${this._setInactiveStatus}
                             @get-wage-status=${this._setWageStatus}
                             @get-bargaining-status=${this._setBargainingStatus}
                             @get-unit-status=${this._setUnitStatusData}
                             @get-feedback=${this._setUserFeedback}>
                </unit-status>
            </form>
        `
    }

    _setEmployerFieldData = (e: CustomEvent) => {
        const {employer, local, subunit} = e.detail;
        this.unit_data = {...this.unit_data, unit_name: employer, local:local, subunit: subunit}
    }

    _setReporterFieldData = (e: CustomEvent) => {
        const {reporter, email, phone} = e.detail;
        this.unit_data = {...this.unit_data, contact: {...this.unit_data.contact, name: reporter, email: email, phone: phone}}
    }

    _setInactiveStatus = (e: CustomEvent) => {
        this.unit_data = {...this.unit_data, inactive_status: e.detail}
    }

    _setWageStatus = (e: CustomEvent) => {
        this.unit_data = {...this.unit_data, wage_status: e.detail}
    }

    _setBargainingStatus = (e: CustomEvent) => {
        this.unit_data = {...this.unit_data, bargaining_status: e.detail}
    }

    _setUnitStatusData = (e: CustomEvent) => {
        const {memberCount, contractStartDate, contractEndDate, CBAFile} = e.detail;
        this.unit_data = {...this.unit_data, number_of_members: memberCount, agreement_eff_date: contractStartDate, agreement_exp_date: contractEndDate, cba: CBAFile}
    }

    _setUserFeedback = (e: CustomEvent) => {
        this.unit_data = {...this.unit_data, comment: e.detail}
    }

    
    
}

declare global {
    interface HTMLElementTagNameMap {
        'unit-form': UnitForm;
    }
}