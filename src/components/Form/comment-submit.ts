import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {FieldLabels} from '../../config/settings.json';
import '../Form/form-header'
import '../atoms/radio-prompt'
import '../atoms/button-comp'
import { debounce } from "../../utilities/debounce.js";

@customElement('comment-submit')
export class TextArea extends LitElement {
    static styles = css`
        :host{
            display: flex;
            flex-direction: column;
        }

        textarea{
            resize: none;
            width: 100%;
            height: 10em;
            border: none;
            border: 1px solid rgba(var(--black), 0.25);
            font-family: var(--font-family);
            font-size: 1em;
            background: rgb(var(--white));
            border-radius: 0.25em;
            padding: 0.25em;
        }

        textarea:focus{
            outline: transparent;
        }

        button-comp{
            margin-top: 1em;
            align-self: flex-end;
        }
    
    `

    @state()
    _comments = 'Yes'

    @property({type: String})
    comment!: string;


    protected render() {
        let {Header, QuestionComments} = FieldLabels.Comments;
        return html`
            <form-header title=${Header}></form-header>
            <radio-prompt prompt=${QuestionComments}
                          initialChecked='Yes'
                          @get-toggle-selection=${this._setToggleSelection}>
            </radio-prompt>
            ${this._comments === 'Yes' ? html`<textarea placeholder="Enter your comments here" .value=${this.comment} @input=${debounce(this._getFeedback)}></textarea>` : nothing}
            <button-comp buttonText="Save This Report" icon="material-symbols:attach-file-add-rounded" @click=${this._saveReport}></button-comp>
        `
    }

    _setToggleSelection = (e: CustomEvent) => {
        this._comments = e.detail;

        this.dispatchEvent(new CustomEvent('comment-toggle', {
            detail: this._comments,
            bubbles: true,
            composed: true
        }))
    }

    _getFeedback = () => {
        this.dispatchEvent(new CustomEvent('get-feedback', {
            detail: this.renderRoot.querySelector('textarea')?.value,
            bubbles: true,
            composed: true
        }))
    }

    _saveReport = () => {
        this.dispatchEvent(new CustomEvent('save-form', {
            bubbles: true,
            composed: true
        }))
    }


}

declare global {
    interface HTMLElementTagNameMap {
        'text-area': TextArea;
    }
}