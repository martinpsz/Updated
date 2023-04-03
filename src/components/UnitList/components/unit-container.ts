import { LitElement, html, css, nothing, TemplateResult} from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {processedData} from "../../../entry/utilities/preprocessing.js";
import '../components/unit-element.js'
import { ProcessedData, UnitList, Unit } from "../../../interfaces/interface.js";
 

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
                overflow-y: scroll;
                background: rgb(var(--black));
                padding: 0.25em;
                //width: 50%;
            }
        }

        @media (min-width: 1024px){
            .unit-list-container{
                height: 66vh;
                //width: 30%;
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
        
    `

    @state()
    _unitSelection!: string;

    @state()
    _flattenedUnits!: UnitList;
    
    constructor(){
        super()

        this._flattenedUnits = Object.values(processedData).flatMap(obj => Object.values(obj)).flat() as UnitList // Flattens the processedData object so we can get specific units on selection
    }

    _generateUnitList = (unitData: any) => {
        let result: string | TemplateResult = '';

        for(let group in unitData){
            const unitList = unitData[group].map((unit: any) => {
                return html`
                    <unit-element 
                        unit_id=${unit.unit_id}
                        state=${unit.state}
                        local=${unit.local}
                        council=${unit.council}
                        number_of_members=${unit.number_of_members}
                        unit_name=${unit.unit_name}
                        @click=${this._selectUnit}
                        class=${this._unitSelection === unit?.unit_id.toString() ? 'selected' : ''}>
                    </unit-element>
                `
            })

           if (group !== 'unit_contracts') {
                result = html`
                    ${result}
                    <div class="master-contract" @click=${this._toggleMasterContract}>
                        <div class="master-contract-meta">
                            <span>Master Agreement</span>
                            <span>${unitData[group].length} Units</span>
                            <h1 title=${group}>${group}</h1>
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