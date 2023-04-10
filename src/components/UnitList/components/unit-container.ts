import { LitElement, html, css, nothing, TemplateResult} from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {processedData} from "../../../entry/utilities/preprocessing.js";
import '../components/unit-element'
import { ProcessedData, UnitList, Unit } from "../../../interfaces/interface.js";
import '../components/unit-menu'

 

@customElement("unit-container")
export class UnitContainer extends LitElement {
    static styles = css`
        .unit-list-container{
            display: none;
        }

        @media (min-width: 768px){
            .unit-list-container{
                display: block;
                height: 40vh;
                overflow-y: auto;
                padding: 0.25em;
                border-bottom: 1px solid rgb(var(--white));
            }

            .unit-list-container::-webkit-scrollbar{
                width: 0.5em;
            }
    
            .unit-list-container::-webkit-scrollbar-track{
                background: rgb(var(--white), 0.85);
            }
    
            .unit-list-container::-webkit-scrollbar-thumb{
                background: rgb(var(--green));
            }  
        }

        @media (min-width: 1024px){
            .unit-list-container{
                height: 52.5vh;
            }
        }

        .master-contract{
            font-family: var(--font-family);
            color: rgb(var(--white));
            cursor: pointer;
        }

        .master-contract-meta{
            background-color: rgba(var(--red), 1);
            padding: 0.5em 0 0.5em 1em;
            margin-bottom: 0.25em;
            position: sticky;
            top: -0.25em;
        }

        .master-contract-meta > div{
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .show .master-contract-meta{
            box-shadow: 0 0.5em 0.5em 0.5em rgba(var(--black), 0.5);
        }

        .master-contract-meta h1{
            margin: 0.5em 0 0 0;
            font-size: 1.2em;
            width: 90%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .master-contract-meta span:nth-of-type(1){
            background-color: rgb(var(--green));
            padding: 0 0.5em;
            border-radius: 0.25em;
            margin-right: 0.5em;
        }


        .master-contract-meta span{
            text-transform: uppercase;
            font-weight: 300;
            font-size: 0.8em;
        }

        .master-contract-units{
            display: none;
        }

        .show{
            outline: 1px solid rgb(var(--white));
            padding-bottom: 0.25em;
            margin-bottom: 0.5em;
        }

        .show .master-contract-units{
            display: block;
        }

        .show #icon{
            transform: rotate(180deg);
        }
        
    `

    @state()
    _unitSelection!: string;

    @state()
    _flattenedUnits!: UnitList;

    @property()
    searchTerm: string = '';

    @property()
    filterBy: string = 'all';
    
    constructor(){
        super()

        this._flattenedUnits = Object.values(processedData).flatMap(obj => Object.values(obj)).flat() as UnitList // Flattens the processedData object so we can get specific units on selection
    }

    _generateUnitList = (unitData: any) => {
        let result: string | TemplateResult = '';

        for(let group in unitData){
            const unitList = unitData[group].filter((unit: Unit) => {
                if(this.searchTerm === '') return true;
                return unit?.unit_name?.toLowerCase().startsWith(this.searchTerm.toLowerCase())
            }).map((unit: Unit) => {
                return html`
                    <unit-element 
                        unit_id=${unit.unit_id}
                        state=${unit.state}
                        local=${unit.local}
                        council=${unit.council}
                        number_of_members=${unit.number_of_members}
                        unit_name=${unit.unit_name}
                        @click=${this._selectUnit}
                        class=${this._unitSelection === unit?.unit_id?.toString() ? 'selected' : ''}
                        unitIndex=${this._flattenedUnits.findIndex(elem => elem.unit_id === unit.unit_id) + 1}
                        unitLength=${this._flattenedUnits.length}>
                    </unit-element>
                `
            })


           if (group !== 'unit_contracts' && unitList.length > 0) {
                result = html`
                    ${result}
                    <div class="master-contract" @click=${this._toggleMasterContract}>
                        <div class="master-contract-meta">
                            <div>
                                <span id="master-label">Master Agreement</span>
                                <span id="master-count">${unitList.length} Units</span>
                                <iconify-icon id="icon" icon="mdi:chevron-double-up" style="color: white;" width="32" height="32"></iconify-icon>
                            </div>
                            <h1 id="master-name" title=${group}>${group}</h1>
                        </div>
                        <div class="master-contract-units">
                            ${unitList}
                        </div>
                    </div>
                `; 
            } else {
                result = html`${result} ${unitList}`;
            }
        }
        return result
    }




    protected render() {
        return html`
            <div class='unit-list-container'>
                ${this._generateUnitList(processedData)}
            </div>
        `  
    }

    connectedCallback(){
        super.connectedCallback()
        this._initializeUnitSelection()
    }


    _initializeUnitSelection = () => {
        const data = processedData as ProcessedData;
        const unit_contracts = data.unit_contracts as UnitList;
        this._unitSelection = unit_contracts[0]?.unit_id?.toString() as string;
        const initialUnitSelection = this._flattenedUnits.find((elem) => {
            let unit = elem as Unit;

            return unit?.unit_id?.toString() === this._unitSelection
        })

        this.dispatchEvent(new CustomEvent('initial-unit-selection', {
            detail: {
                unit: initialUnitSelection,
                unit_id: this._unitSelection
            },
            bubbles: true,
            composed: true
        }))
    }

    _toggleMasterContract = (e: MouseEvent) => {
        const selectedTarget = e.target as HTMLElement;
        const selectedMaster = selectedTarget.closest('.master-contract') as HTMLDivElement;
        selectedMaster.classList.toggle('show')
    }

    _selectUnit = (e: MouseEvent) => {
        e.stopPropagation();
        const target = e.target as HTMLElement;
        this._unitSelection = target.getAttribute('unit_id') as string;

        const unitList = this.shadowRoot?.querySelectorAll('unit-element');

        unitList?.forEach((unit) => {
            unit.unit_id.toString() === this._unitSelection ? unit.classList.add('selected') : unit.classList.remove('selected');
        })

        const selectedUnit = this._flattenedUnits.find((elem) => {
            let unit = elem as Unit;

            return unit?.unit_id?.toString() === this._unitSelection
        });


        this.dispatchEvent(new CustomEvent('update-unit-selection', {
            detail: {
                unit: selectedUnit,
                unit_id: this._unitSelection
            },
            bubbles: true,
            composed: true
        }))
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "unit-container": UnitContainer;
    }
}