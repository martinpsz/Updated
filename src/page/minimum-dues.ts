import {LitElement, html, css} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import '../components/html-header';
import '../components/html-footer';
import '../components/UnitList/index';
import '../components/atoms/input-field';
import '../components/Form/index.js'
import {FormPayload, Unit} from '../interfaces/interface.js';

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

    @state()
    unit_data!: Unit & FormPayload;


    protected render(){
        return html`
            <div class="container">
                <html-header></html-header>
                <main>
                    <unit-list @initial-unit-selection=${this.set_initial_unit_selection}
                               @update-unit-selection=${this.set_updated_unit_selection}>
                    </unit-list>
                    <unit-form .unit_data=${this.unit_data}></unit-form>
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
        this.unit_data = e.detail.unit 
    }

    set_updated_unit_selection(e: CustomEvent){
        this.unit_data = e.detail.unit
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'minimum-dues': MinimumDues;
    }
}