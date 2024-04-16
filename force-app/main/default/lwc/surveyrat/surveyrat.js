//Without @track
import { LightningElement, wire, api } from 'lwc';
import getSurveyQuestions from '@salesforce/apex/SurveyController.getSurveyQuestions';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// import createSurveyResponses from '@salesforce/apex/ResponseController.createSurveyResponses';
import createSurveyQuestionResponses from '@salesforce/apex/ResponseController.createSurveyQuestionResponses';

export default class Survey extends LightningElement {
    surveyValue = 'No';
    isModalOpen = false;
    showConfirmationModal = false; // New property to track confirmation modal
    surveyQuestions = [];
    selectedAnswers = {};

    @wire(getSurveyQuestions, { surveyName: 'Product Design' })
    wiredSurveyQuestions({ error, data }) {
        if (data) {
            this.surveyQuestions = data;
            this.processOptions();
        } else if (error) {
            console.error('Error retrieving survey questions:', error);
        }
    }

    processOptions() {
        this.processedOptions = this.surveyQuestions.map(question => {
            return {
                id: question.Id,
                question: question,
                options: question.Survey_Answer_Options__r ? this.getOptions(question.Survey_Answer_Options__r) : []
            };
        });
    }

    // Define options property to display Yes/No radio options
    get options() {
        return [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
        ];
    }

    // Method to handle the survey button click
    handleSurveyButton(event) {
        this.surveyValue = event.detail.value;
        // Open the modal if the survey value is 'Yes'
        this.isModalOpen = this.surveyValue === 'Yes';
    }

    // Method to handle the modal close
    closeModal() {
        this.isModalOpen = false;
    }

    // Method to handle radio button change
    handleRadioChange(event) {
        const questionId = event.target.name;
        console.log(questionId);
        console.log(questionId + "-->" + event.detail.value);
        this.selectedAnswers = { ...this.selectedAnswers, [questionId]: event.detail.value };
    }

    // Getter method to get options for radio group
    getOptions(options) {
        return options.map(option => ({
            label: option.Option_Text__c,
            value: option.Id
        }));
    }

    get isSubmitDisabled() {
        return !this.allQuestionsAnswered();
    }

    handleSurveySubmit() {
        const surveyQuestionResponsesData = Object.entries(this.selectedAnswers).map(([questionId, chosenResponse1Id]) => {
            return {
                QuestionId: questionId,
                ChosenResponse1Id: chosenResponse1Id
            };
        });
        const surveyId = 'a00IS000003NQY1YAO';

        createSurveyQuestionResponses({ surveyQuestionResponsesData, surveyId })
            .then(() => {
                const event = new ShowToastEvent({
                    title: 'Success',
                    message: 'Survey responses submitted successfully.',
                    variant: 'success'
                });
                this.showConfirmationModal = true;
                this.isModalOpen = false;
                this.dispatchEvent(event);
            })
            .catch(error => {
                const event = new ShowToastEvent({
                    title: 'Error',
                    message: 'Error creating survey responses: ' + error.body.message,
                    variant: 'error'
                });
                this.dispatchEvent(event);
            });
    }

    allQuestionsAnswered() {
        return Object.keys(this.selectedAnswers).length === this.surveyQuestions.length;
    }

    handleYes() {
        this.selectedAnswers = [];
        this.isModalOpen = true;
        this.showConfirmationModal = false;
    }

    handleNo() {
        this.showConfirmationModal = false;
    }
}

















//WORKING with @track
// import { LightningElement, track, wire } from 'lwc';
// import getSurveyQuestions from '@salesforce/apex/SurveyController.getSurveyQuestions';
// import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// // import createSurveyResponses from '@salesforce/apex/ResponseController.createSurveyResponses';
// import createSurveyQuestionResponses from '@salesforce/apex/ResponseController.createSurveyQuestionResponses'


// export default class Survey extends LightningElement {
//     @track surveyValue = 'No';
//     @track isModalOpen = false;
//     @track showConfirmationModal = false; // New property to track confirmation modal
//     @track surveyQuestions = [];
//     @track selectedAnswers = {};

//     @wire(getSurveyQuestions, { surveyName: 'Product Design' })
//     wiredSurveyQuestions({ error, data }) {
//         if (data) {
//             this.surveyQuestions = data;
//             this.processOptions();
//         } else if (error) {
//             console.error('Error retrieving survey questions:', error);
//         }
//     }

//     processOptions() {
//         this.processedOptions = this.surveyQuestions.map(question => {
//             return {
//                 id: question.Id,
//                 question: question,
//                 options: question.Survey_Answer_Options__r ? this.getOptions(question.Survey_Answer_Options__r) : []
//             };
//         });
//     }

//     // Define options property to display Yes/No radio options
//     get options() {
//         return [
//             { label: 'Yes', value: 'Yes' },
//             { label: 'No', value: 'No' },
//         ];
//     }

//     // Method to handle the survey button click
//     handleSurveyButton(event) {
//         this.surveyValue = event.detail.value;
//         // Open the modal if the survey value is 'Yes'
//         this.isModalOpen = this.surveyValue === 'Yes';
//     }

//     // Method to handle the modal close
//     closeModal() {
//         this.isModalOpen = false;
//     }

//     // Method to handle radio button change
//     handleRadioChange(event) {
//         const questionId = event.target.name;
//         console.log(questionId);
//         console.log(questionId+"-->"+event.detail.value);
//         this.selectedAnswers = { ...this.selectedAnswers, [questionId]: event.detail.value };

//     }

//     // Getter method to get options for radio group
//     getOptions(options) {
//         return options.map(option => ({
//             label: option.Option_Text__c,
//             value: option.Id
//         }));
//     }

//     get isSubmitDisabled() {
//         return !this.allQuestionsAnswered();
//     }

//     handleSurveySubmit() {

//         const surveyQuestionResponsesData = Object.entries(this.selectedAnswers).map(([questionId, chosenResponse1Id]) => {
//             return {
//                 QuestionId: questionId,
//                 ChosenResponse1Id: chosenResponse1Id
//             };
//         });
//         const responderId = '005IS000000FyVGYA0';
//         const surveyId = 'a00IS000003NQY1YAO';
        
//         createSurveyQuestionResponses({ surveyQuestionResponsesData, responderId, surveyId })
//             .then(() => {
//                 const event = new ShowToastEvent({
//                     title: 'Success',
//                     message: 'Survey responses submitted successfully.',
//                     variant: 'success'
//                 });
//                 this.showConfirmationModal = true;
//                 this.isModalOpen = false;
//                 this.dispatchEvent(event);
                
//             })
//             .catch(error => {
//                 const event = new ShowToastEvent({
//                     title: 'Error',
//                     message: 'Error creating survey responses: ' + error.body.message,
//                     variant: 'error'
//                 });
//                 this.dispatchEvent(event);
//             });
//     }

//     allQuestionsAnswered() {
//         return Object.keys(this.selectedAnswers).length === this.surveyQuestions.length;
//     }
//     handleYes(){
//         this.selectedAnswers=[];
//         this.isModalOpen = true;
//         this.showConfirmationModal = false;
//     }
//     handleNo (){
//         this.showConfirmationModal = false;
//     }

// }












// import { LightningElement, track, wire } from 'lwc';
// import getSurveyQuestions from '@salesforce/apex/SurveyController.getSurveyQuestions';
// import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// import createSurveyResponses from '@salesforce/apex/ResponseController.createSurveyResponses';


// export default class Survey extends LightningElement {
//     @track surveyValue = 'No';
//     @track isModalOpen = false;
//     @track surveyQuestions = [];
//     @track selectedAnswers = {};

//     // Define wire method to fetch survey questions
//     @wire(getSurveyQuestions, { surveyName: 'Product Design' })
//     wiredSurveyQuestions({ error, data }) {
//         if (data) {
//             this.surveyQuestions = data;
//             this.processOptions();
//         } else if (error) {
//             console.error('Error retrieving survey questions:', error);
//         }
//     }

//     // Method to process survey questions and options
//     processOptions() {
//         this.processedOptions = this.surveyQuestions.map(question => {
//             return {
//                 id: question.Id,
//                 question: question,
//                 options: question.Survey_Answer_Options__r ? this.getOptions(question.Survey_Answer_Options__r) : []
//             };
//         });
//     }

//     // Define options property to display Yes/No radio options
//     get options() {
//         return [
//             { label: 'Yes', value: 'Yes' },
//             { label: 'No', value: 'No' },
//         ];
//     }

//     // Method to handle the survey button click
//     handleSurveyButton(event) {
//         this.surveyValue = event.detail.value;
//         // Open the modal if the survey value is 'Yes'
//         this.isModalOpen = this.surveyValue === 'Yes';
//     }

//     // Method to handle the modal close
//     closeModal() {
//         this.isModalOpen = false;
//     }

//     // Method to handle radio button change
//     handleRadioChange(event) {
//         const questionId = event.target.name;
//         // const optionId = event.target.data.Id;
//         console.log(optionId);
//         this.selectedAnswers = { ...this.selectedAnswers, [questionId]: event.detail.value };
//     }

//     // Getter method to get options for radio group
//     getOptions(options) {
//         return options.map(option => ({
//             label: option.Option_Text__c,
//             value: option.Id
//         }));
//     }

//     // Method to check if all questions are answered
//     get isSubmitDisabled() {
//         return !this.allQuestionsAnswered();
//     }

//     // Method to handle survey submit button click
//         handleSurveySubmit() {
//             // Convert selectedAnswers to a regular JavaScript object
//             const selectedAnswersObject = JSON.parse(JSON.stringify(this.selectedAnswers));
            
//             // Log the selected options IDs
//             console.log('Selected options IDs:', selectedAnswersObject);
            
//             // Prepare survey response data
//             const surveyResponseData = {
//                 ResponderId: '005IS000000FyVLYA0', // Replace with actual responder ID
//                 ResponseDate: new Date(),
//                 SurveyId: 'a00IS000003NQY1YAO', // Replace with actual survey ID
//                 QuestionResponses: Object.entries(selectedAnswersObject).map(([questionId, chosenResponse1Id]) => {
//                     return {
//                         QuestionId: questionId,
//                         ChosenResponse1Id: chosenResponse1Id
//                     };
//                 })
//             };
        
//             // Call the Apex method to create survey responses
//             createSurveyResponses({ surveyResponseData })
//                 .then(() => {
//                     // Show success message
//                     const event = new ShowToastEvent({
//                         title: 'Success',
//                         message: 'Survey responses submitted successfully.',
//                         variant: 'success'
//                     });
//                     this.dispatchEvent(event);
        
//                     // Close the modal
//                     this.isModalOpen = false;
//                 })
//                 .catch(error => {
//                     // Show error message
//                     const event = new ShowToastEvent({
//                         title: 'Error',
//                         message: 'Error creating survey responses: ' + error.body.message,
//                         variant: 'error'
//                     });
//                     this.dispatchEvent(event);
//                 });
        
//     }

//     // Method to validate if all questions are answered
//     allQuestionsAnswered() {
//         return this.processedOptions.every(option => {
//             return this.selectedAnswers.hasOwnProperty(option.id);
//         });
//     }
// }