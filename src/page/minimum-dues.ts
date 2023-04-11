import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import '../components/html-header';
import '../components/html-footer';
import '../components/UnitList/index';
import '../components/atoms/input-field';
import '../components/Form/index.js'
import {FormPayload, Unit, WageEventInterface} from '../interfaces/interface.js';

@customElement('minimum-dues')
export class MinimumDues extends LitElement {
    static styles = css`
        .container{
            display: flex;
            flex-direction: column;
            height: 100vh;
        }

        main{
            flex: 1;
            margin: 0.5em;
            border: 1px solid rgba(var(--black), 0.1);
        }

        @media (min-width: 1024px){
            main{
                display: grid;
                grid-template-columns: 30% 70%;
        }
    `

    @property()
    form_data!: FormPayload;
    
    protected render(){
        return html`
            <div class="container">
                <html-header></html-header>
                <main>
                    <unit-list @initial-unit-selection=${this.set_initial_unit_selection}
                               @update-unit-selection=${this.set_updated_unit_selection}>
                    </unit-list>
                    <unit-form .form_data=${this.form_data}></unit-form>
                </main>
                <html-footer></html-footer>
            </div>
        `
    }

    connectedCallback = () => {
        super.connectedCallback();
        this.addEventListener('initial-unit-selection', (e) => this.set_initial_unit_selection(e as CustomEvent))
    }

    disconnectedCallback = () => {
        super.disconnectedCallback();
        this.removeEventListener('initial-unit-selection', (e) => this.set_initial_unit_selection(e as CustomEvent))
    }
    
    set_initial_unit_selection = (e: CustomEvent) => {
        this.form_data = this.generateUnitDataForForm(e.detail.unit)
    }

    set_updated_unit_selection(e: CustomEvent){
        this.form_data = this.generateUnitDataForForm(e.detail.unit)

    }

    generateUnitDataForForm = (unit: Unit) => {
        //remove fields no longer needed from unit object
        const deleteProps = (unit: Unit, propsToRemove: string[]) => {
            for (const p of propsToRemove){
                delete unit[p as keyof Unit];
            }

            return unit;
        }

        const form_data_with_deleted_props = deleteProps(unit, ['master', 'master_id', 'master_name', 'report_individually', 'state', 'chapter'])

        //initialize values for form_data
        const form_fields = {
            inactive_status: "No" as FormPayload['inactive_status'],
            wage_status: 'Yes' as FormPayload['wage_status'],
            bargaining_status: null,
            cba_file : new File([], ''),
            comment: '',
            regular_wage_events: [{key: '0', effective_date: '', wage_event_type: '% increase', wage_event_value: null, starting_value: null} as WageEventInterface] ,
            special_wage_events: [{key: '0', effective_date: '', wage_event_type: '% increase', wage_event_value: null, starting_value: null, num_affected: null, description: '', supporting_doc: new File([], '')} as WageEventInterface],
            filing_status: 'Needs Review' as FormPayload['filing_status'],
            notes: ''
        }

        return {...form_data_with_deleted_props, ...form_fields}
        
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'minimum-dues': MinimumDues;
    }
}