public with sharing class ResponseController {

    @AuraEnabled
    public static void createSurveyQuestionResponses(List<SurveyResponseDataWrapper> surveyQuestionResponsesData, String surveyId) {
        List<Survey_Question_Response__c> surveyQuestionResponsesToInsert = new List<Survey_Question_Response__c>();
        Survey_Response__c resp = new Survey_Response__c();
        resp.Responder__c = UserInfo.getUserId(); // Using UserInfo.getUserId() to get the current user's Id
        resp.Survey__c = surveyId;
        insert resp;
        ID respId = resp.Id;
        for (SurveyResponseDataWrapper data : surveyQuestionResponsesData) {
            if (data.ChosenResponse1Id != null && data.QuestionId != null) {
                Survey_Question_Response__c questionResponse = new Survey_Question_Response__c();
                questionResponse.Chosen_Response_1__c = data.ChosenResponse1Id;
                questionResponse.Question__c = data.QuestionId;
                questionResponse.Survey_Response__c = respId;
                surveyQuestionResponsesToInsert.add(questionResponse);
            }
        }

        if (!surveyQuestionResponsesToInsert.isEmpty()) {
            insert surveyQuestionResponsesToInsert;
        }
    }

    public class SurveyResponseDataWrapper {
        @AuraEnabled
        public Id QuestionId { get; set; }
        @AuraEnabled
        public Id ChosenResponse1Id { get; set; }
    }
}



//Storing Everything Using Wrapper
// public with sharing class ResponseController {

//     @AuraEnabled
//     public static void createSurveyQuestionResponses(List<SurveyResponseDataWrapper> surveyQuestionResponsesData, String responderId, String surveyId) {
//         List<Survey_Question_Response__c> surveyQuestionResponsesToInsert = new List<Survey_Question_Response__c>();
//         Survey_Response__c resp = new Survey_Response__c();
//         resp.Responder__c = responderId;
//         resp.Survey__c = surveyId;
//         insert resp;
//         ID respId = resp.Id;
//         for (SurveyResponseDataWrapper data : surveyQuestionResponsesData) {
//             if (data.ChosenResponse1Id != null && data.QuestionId != null) {
//                 Survey_Question_Response__c questionResponse = new Survey_Question_Response__c();
//                 questionResponse.Chosen_Response_1__c = data.ChosenResponse1Id;
//                 questionResponse.Question__c = data.QuestionId;
//                 questionResponse.Survey_Response__c = respId;
//                 surveyQuestionResponsesToInsert.add(questionResponse);
//             }
//         }

//         if (!surveyQuestionResponsesToInsert.isEmpty()) {
//             insert surveyQuestionResponsesToInsert;
//         }
//     }

//     public class SurveyResponseDataWrapper {
//         @AuraEnabled
//         public Id QuestionId { get; set; }
//         @AuraEnabled
//         public Id ChosenResponse1Id { get; set; }
//     }
// }







//STORING RESPONSES BUT NOT QUESTION AND ANSWERS
// public with sharing class ResponseController {
//     // Wrapper class for survey question responses data
//     public class SurveyQuestionResponseWrapper {
//         @AuraEnabled
//         public Id questionId { get; set; }
//         @AuraEnabled
//         public Id chosenResponse1Id { get; set; }
//         public SurveyQuestionResponseWrapper(Id questionId, Id chosenResponse1Id) {
//             this.questionId = questionId;
//             this.chosenResponse1Id = chosenResponse1Id;
//         }
//     }
//     @AuraEnabled
//     public static void createSurveyQuestionResponses(List<SurveyQuestionResponseWrapper> surveyQuestionResponses, String responderId, String surveyId) {
//         List<Survey_Question_Response__c> surveyQuestionResponsesToInsert = new List<Survey_Question_Response__c>();
//         Survey_Response__c surveyResponse = new Survey_Response__c(
//             Responder__c = responderId,
//             Survey__c = surveyId
//         );
//         insert surveyResponse;
//         for (SurveyQuestionResponseWrapper response : surveyQuestionResponses) {
//             Survey_Question_Response__c questionResponse = new Survey_Question_Response__c(
//                 Chosen_Response_1__c = response.chosenResponse1Id,
//                 Question__c = response.questionId,
//                 Survey_Response__c = surveyResponse.Id
//             );
//             surveyQuestionResponsesToInsert.add(questionResponse);
//         }
 
//         if (!surveyQuestionResponsesToInsert.isEmpty()) {
//             insert surveyQuestionResponsesToInsert;
//         }
//     }
// }












//WORKING
// public with sharing class ResponseController {
//     @AuraEnabled
//     public static void createSurveyQuestionResponses(List<Map<String, Object>> surveyQuestionResponsesData, String responderId, String surveyId) {
//         List<Survey_Question_Response__c> surveyQuestionResponsesToInsert = new List<Survey_Question_Response__c>();
//         Survey_Response__c resp = new Survey_Response__c();
//         resp.Responder__c = responderId;
//         resp.Survey__c = surveyId;
//         insert resp;
//         ID respId = resp.Id;
//         for (Map<String, Object> questionResponseData : surveyQuestionResponsesData) {
//             if (questionResponseData.containsKey('ChosenResponse1Id') && questionResponseData.containsKey('QuestionId')) {
//                 Survey_Question_Response__c questionResponse = new Survey_Question_Response__c();
//                 questionResponse.Chosen_Response_1__c = (Id) questionResponseData.get('ChosenResponse1Id');
//                 questionResponse.Question__c = (Id) questionResponseData.get('QuestionId');
//                 questionResponse.Survey_Response__c = respId;
//                 surveyQuestionResponsesToInsert.add(questionResponse);
//             }
//         }

//         if (!surveyQuestionResponsesToInsert.isEmpty()) {
//             insert surveyQuestionResponsesToInsert;
//         }
//     }
// }