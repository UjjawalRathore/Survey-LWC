public with sharing class SurveyController {
    @AuraEnabled(cacheable=true)
    public static List<Survey_Question__c> getSurveyQuestions(String surveyName) {
        return [SELECT Id, Name, Question_Text__c, Answer_Type__c, Question_Order__c,
                       (SELECT Id, Name, Option_Text__c FROM Survey_Answer_Options__r WHERE Active__c = true)
                FROM Survey_Question__c
                WHERE Survey__r.Name = :surveyName AND Active__c = true];
    }

}