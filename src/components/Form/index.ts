import { LitElement, html, css} from "lit";
import { customElement, property, state } from "lit/decorators.js";
import '../Form/form-header';
import '../Form/employer-fields';
import '../Form/reporter-fields';
import '../Form/unit-status';
import '../Form/status-bar'
import { FormPayload} from "../../interfaces/interface.js";


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
        console.log(this.form_data)
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
                             .cba_file=${this.form_data?.cba_file}
                             @get-inactive-status=${this._setInactiveStatus}
                             @get-wage-status=${this._setWageStatus}
                             @get-unit-status=${this._setUnitStatusData}
                             @get-bargaining-status=${this._setBargainingStatus}
                             .RegularWageEvent=${this.form_data?.regular_wage_events[0]}
                             .SpecialWageEvent=${this.form_data?.special_wage_events[0]}
                             @get-feedback=${this._setUserFeedback}
                             @get-regular-event-array=${this._setRegularWageData}
                             @get-special-event-array=${this._setSpecialWageData}
                             @comment-toggle=${this._setCommentToggle}>
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

    _setUnitStatusData = (e: CustomEvent) => {
        const {memberCount, contractStartDate, contractEndDate, cba_file} = e.detail;
        this.form_data = {...this.form_data, number_of_members: memberCount, agreement_eff_date: contractStartDate, agreement_exp_date: contractEndDate, cba_file: cba_file}
    }

    _setRegularWageData = (e: CustomEvent) => {
        this.form_data = {...this.form_data, regular_wage_events: e.detail}
    }

    _setSpecialWageData = (e: CustomEvent) => {
        this.form_data = {...this.form_data, special_wage_events: e.detail}
    }

    _setInactiveStatus = (e: CustomEvent) => {
        if(e.detail === 'Yes'){
            this.form_data = {...this.form_data, number_of_members: null, agreement_eff_date: null, agreement_exp_date: null, cba_file: null, regular_wage_events: [], special_wage_events: [], bargaining_status: null, wage_status: null, filing_status: 'READY FOR SUBMISSION', inactive_status: e.detail}
        } else {
            this.form_data = {...this.form_data, inactive_status: e.detail}
        }
    }

    _setWageStatus = (e: CustomEvent) => {
        if(e.detail === 'Yes'){
            this.form_data = {...this.form_data, wage_status: e.detail, bargaining_status: null}
        } else {
            this.form_data = {...this.form_data, wage_status: e.detail, bargaining_status: 'No'}
        }
    }

    _setBargainingStatus = (e: CustomEvent) => {
        this.form_data = {...this.form_data, bargaining_status: e.detail, regular_wage_events: [], special_wage_events: []}
    }

    _setUserFeedback = (e: CustomEvent) => {
        this.form_data = {...this.form_data, comment: e.detail}
    }

    _setCommentToggle = (e: CustomEvent) => {
        if (e.detail === 'No'){
            this.form_data = {...this.form_data, comment: null}
        }
    }


    
}

declare global {
    interface HTMLElementTagNameMap {
        'unit-form': UnitForm;
    }
}