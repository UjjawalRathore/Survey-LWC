// wORKING Without @track
import { LightningElement, wire, api } from 'lwc';
import getSurveyQuestions from '@salesforce/apex/SurveyController.getSurveyQuestions';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// import createSurveyResponses from '@salesforce/apex/ResponseController.createSurveyResponses';
import createSurveyQuestionResponses from '@salesforce/apex/ResponseController.createSurveyQuestionResponses';

const MAX_OPTIONS = 5;

export default class Survey extends LightningElement {
    surveyValue = 'No';
    isModalOpen = false;
    showConfirmationModal = false; // New property to track confirmation modal
    surveyQuestions = [];
    selectedAnswers = {};

    errorMessage = '';

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
                options: question.Survey_Answer_Options__r ? this.getOptions(question.Survey_Answer_Options__r) : [],
                isMultiSelect: question.Answer_Type__c === 'Multi Select',
                isSingleSelect: question.Answer_Type__c === 'Single Select'
                // isTextResponse: question.Answer_Type__c === 'Text Response'
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

    handleCheckboxChange(event) {
        const questionId = event.target.name;
        const selectedOption = event.target.value;
        let selectedOptions = this.selectedAnswers[questionId] || [];
        
        // Check if the number of selected options exceeds the maximum allowed
        if (selectedOptions.length >= MAX_OPTIONS && !selectedOptions.includes(selectedOption)) {
            this.errorMessage = `You can select a maximum of ${MAX_OPTIONS} options`;
            return;
        }
        
        const index = selectedOptions.indexOf(selectedOption);
        if (index === -1) {
            // If the option is not already selected, add it to a new array of selected options
            selectedOptions = [...selectedOptions, selectedOption];
        } else {
            // If the option is already selected, remove it from a new array of selected options
            selectedOptions = selectedOptions.filter(option => option !== selectedOption);
        }
    
        // Update the selectedAnswers with the new selection
        this.selectedAnswers = { ...this.selectedAnswers, [questionId]: selectedOptions };
    
        // Clear the error message if the number of selected options falls within the limit
        if (selectedOptions.length <= MAX_OPTIONS) {
            this.errorMessage = '';
        }
    }

    handleRadioChange(event) {
        const questionId = event.target.name;
        this.selectedAnswers = { ...this.selectedAnswers, [questionId]: event.detail.value };
        console.log(JSON.stringify(this.selectedAnswers));
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
        const surveyQuestionResponsesData = this.processedOptions.map(option => {
            return {
                QuestionId: option.id,
                ChosenResponse1Id: Array.isArray(this.selectedAnswers[option.id]) ? this.selectedAnswers[option.id][0] : this.selectedAnswers[option.id],
                ChosenResponseIds: Array.isArray(this.selectedAnswers[option.id]) ? this.selectedAnswers[option.id] : [], // Assuming multi-select responses are stored as an array
            };
        });
        const surveyId = 'a00IS000003NQY1YAO';
    
        createSurveyQuestionResponses({ surveyQuestionResponsesData: JSON.stringify(surveyQuestionResponsesData), surveyId })
            .then(() => {
                console.log(JSON.stringify(surveyQuestionResponsesData));
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
                console.log(JSON.stringify(surveyQuestionResponsesData));
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