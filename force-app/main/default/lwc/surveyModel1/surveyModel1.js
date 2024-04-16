import { LightningElement } from 'lwc';

export default class SurveyModel1 extends LightningElement {
    handleYes() {

        this.dispatchEvent(new CustomEvent('yes'));
    }

    handleNo() {
        this.dispatchEvent(new CustomEvent('no'));
    }
}