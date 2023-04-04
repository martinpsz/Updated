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
    form_data!: FormPayload;


    protected render() {
        return html`
            <status-bar></status-bar>
            <form>
                <employer-fields employer=${this.form_data?.unit_name}
                                 local=${this.form_data?.local}
                                 subunit=${this.form_data?.subunit}
                                 @get-employer-fields=${(e: CustomEvent) => this._setEmployerFieldData(e)}>
                </employer-fields>
                <reporter-fields reporter=${this.form_data?.contact?.name}
                                 email=${this.form_data?.contact?.email}
                                 phone=${this.form_data?.contact?.phone}
                                 @get-reporter-fields=${this._setReporterFieldData}>
                </reporter-fields>
                <unit-status memberCount=${this.form_data?.number_of_members}
                             contractStartDate=${this.form_data?.agreement_eff_date}
                             contractEndDate=${this.form_data?.agreement_exp_date}
                             .RegularWageEvent=${this.form_data?.regular_wage_events[0]}
                             .SpecialWageEvent=${this.form_data?.special_wage_events[0]}
                             comment=${this.form_data?.comment}
                             
                </unit-status>
            </form>
        `
    }

    _setEmployerFieldData = (e: CustomEvent) => {
        const {employer, local, subunit} = e.detail;
        this.form_data = {...this.form_data, unit_name: employer, local:local, subunit: subunit}
    }

    _setReporterFieldData = (e: CustomEvent) => {
        const {reporter, email, phone} = e.detail;
        this.form_data = {...this.form_data, contact: {...this.form_data.contact, name: reporter, email: email, phone: phone}}
    }

    

    /*_setInactiveStatus = (e: CustomEvent) => {
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
    }*/


    
}

declare global {
    interface HTMLElementTagNameMap {
        'unit-form': UnitForm;
    }
}