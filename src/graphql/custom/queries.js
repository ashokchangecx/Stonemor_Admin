import { gql } from "@apollo/client";

export const LIST_SURVEYS = /* GraphQL */ gql(`
  query ListSurveys(
    $filter: ModelSurveyFilterInput ={
      deleted:{ne:true}
      archived:{ne:true}
    }
    $limit: Int = 1000
    $nextToken: String
  ) {
    listSurveys(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        image
        locations
        archived
        deleted
        createdAt
        updatedAt
        preQuestionnaire {
          id
          name
        }
      }
      nextToken
    }
  }
`);

export const LIST_SURVEY_ENTRIES = /* GraphQL */ gql(`
query ListSurveyEntriess(
  $filter: ModelSurveyEntriesFilterInput = {

    testing:{ne:true},
    archived:{ne:true},
    complete:{eq:100},
    deleted:{ne:true}
  }
  $limit: Int =  100000
  $nextToken: String
) {
  listSurveyEntriess(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      startTime
      finishTime
      questionnaireId
      LocationId
      deleted
      archived
      testing
      complete
      createdAt
      updatedAt
      responses {
        items {
          id
          res
        }
        nextToken
      }
      by {
        id
        name
        email
      }
      location {
        id
        location
        inchargeEmail
       
      }
    }
    nextToken
  }
}
`);

export const LIST_QUESTIONNARIES_NAME = /* GraphQL */ gql(`
  query ListQuestionnaires(
    $filter: ModelQuestionnaireFilterInput={
      deleted:{ne:true}
      archived:{ne:true}
    }
    $limit: Int
    $nextToken: String
  ) {
    listQuestionnaires(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
      }
    }
  }
`);

export const LIST_SURVEY_USERS = /* GraphQL */ gql(`
  query ListSurveyUsers(
    $filter: ModelSurveyUserFilterInput={
      deleted:{ne:true}
      
    }
    $limit: Int
    $nextToken: String
  ) {
    listSurveyUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        email
        deleted
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`);

export const LIST_SURVEY_LOCATIONS = /* GraphQL */ gql(`
  query ListSurveyLocations(
    $filter: ModelSurveyLocationFilterInput={ 
      deleted:{ne:true}
      archived:{ne:true}}
    $limit: Int
    $nextToken: String
  ) {
    listSurveyLocations(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        location
        inchargeEmail
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`);

export const LIST_QUESTIONNARIES = /* GraphQL */ gql(`
  query ListQuestionnaires(
    $filter: ModelQuestionnaireFilterInput ={
      deleted:{ne:true}
      archived:{ne:true}
    }
    $limit: Int
    $nextToken: String
  ) {
    listQuestionnaires(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        introMsg
        deleted
        archived
        endMsg
        createdAt
        updatedAt
        survey {
          id
          name
        }
      }
      nextToken
    }
    
  }
`);

export const COUNT_SURVEYS = /* GraphQL */ gql(`
query ListSurveys(
    $filter: ModelSurveyFilterInput ={
      deleted:{ne:true}
      archived:{ne:true}
    }
    $limit: Int = 1000
    $nextToken: String
  ) {
    listSurveys(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
      }
    }
  }
`);

export const COUNT_SURVEY_LOCATIONS = /* GraphQL */ gql(`
  query ListSurveyLocations(
    $filter: ModelSurveyLocationFilterInput ={
      deleted:{ne:true}

    }
    $limit: Int =1000
    $nextToken: String
  ) {
    listSurveyLocations(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
      }
      nextToken
    }
  }
`);
export const COUNT_SURVEY_USERS = /* GraphQL */ gql(`
  query ListSurveyUsers(
    $filter: ModelSurveyUserFilterInput={
      deleted:{ne:true}
    }
    $limit: Int =1000
    $nextToken: String
  ) {
    listSurveyUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
      }
      nextToken
    }
  }
`);
export const LIST_QUESTIONS = /* GraphQL */ gql(`
  query ListQuestions(
    $filter: ModelQuestionFilterInput={
      deleted:{ne:true}
      archived:{ne:true}
   
    }
    $limit: Int = 30000
    $nextToken: String
  ) {
    listQuestions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        qu
        type
        isSelf
        isDependent
        listOptions {
          listValue
          nextQuestion
          isText
          isMultiple
        }
        deleted
        archived
        order
        responses {
          items {
            id
            res
            deleted
            archived
            createdAt
            updatedAt
           
          }
          nextToken
        }
        dependent {
          id
        }
        createdAt
        updatedAt
        questionnaire {
          id
          name
          description
          image
          type
          introMsg
          deleted
          archived
          endMsg
          createdAt
          updatedAt
        }
      }
      nextToken
    }
   

  }
`);
export const LIST_RESPONSESS = /* GraphQL */ gql(`
  query ListResponsess(
    $filter: ModelResponsesFilterInput={
      deleted:{ne:true}
      archived:{ne:true}
    }
    $limit: Int =10000000
    $nextToken: String
  ) {
    listResponsess(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        res
        deleted
        archived
        createdAt
        updatedAt
        qu {
          id
          qu
          type
          isSelf
          isDependent
          listOptions {
        listValue
        nextQuestion
        isText
        isMultiple
      }
          deleted
          archived
          order
          createdAt
          updatedAt
        }
        group {
          id
          startTime
          finishTime
          questionnaireId
          deleted
          archived
          testing
          complete
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`);

export const GET_QUESTIONNAIRES = /* GraphQL */ gql(`
  query GetQuestionnaire($id: ID!) {
    getQuestionnaire(id: $id) {
      id
      name
      description
      image
      type
      introMsg
      deleted
      archived
      endMsg
      createdAt
      updatedAt
      survey {
        id
        name
        description
        image
        archived
        deleted
        groups
        createdAt
        updatedAt
        preQuestionnaire {
          id
          name
          description
          image
          type
          introMsg
          deleted
          archived
          endMsg
          createdAt
          updatedAt
        }
        mainQuestionnaire {
          id
          name
          description
          image
          type
          introMsg
          deleted
          archived
          endMsg
          createdAt
          updatedAt
        }
        postQuestionnaire {
          id
          name
          description
          image
          type
          introMsg
          deleted
          archived
          endMsg
          createdAt
          updatedAt
        }
        questionnaire {
          nextToken
        }
      }
      question(limit: 200, filter: { deleted: { ne: true } }) {
        items {
          id
          qu
          type
          isSelf
          isDependent
          deleted
          listOptions {
            listValue
            nextQuestion
            isText
            isMultiple
          }
          dependent {
            id
            options {
              dependentValue
              nextQuestion
            }
          }
          order
          createdAt
          updatedAt
        }
        nextToken
      }
    
    }
  }
`);

export const GET_SURVEY = /* GraphQL */ gql(`
  query GetSurvey($id: ID!) {
    getSurvey(id: $id) {
      id
      name
      description
      image
      locations
      archived
      deleted
      groups
      createdAt
      updatedAt
      preQuestionnaire {
        id
        name
      }

      nextToken
    }
  }
`);

export const GET_SURVEYENTRIES = /* GraphQL */ gql(`
query GetSurveyEntries($id: ID!) {
  getSurveyEntries(id: $id) {
    id
    startTime
    finishTime
    questionnaireId
    LocationId
    deleted
    archived
  
    responses {
      items {
        id
        res
        deleted
        archived
        createdAt
        updatedAt
        qu {
          id
          qu
          type
          isSelf
          isDependent
          order
          createdAt
          updatedAt
        }
      }
      nextToken
    }
   
  }
}
`);

export const LIST_INCOMPLETED_SURVEY_ENTRIES = /* GraphQL */ gql(`
query ListSurveyEntriess(
  $filter: ModelSurveyEntriesFilterInput = {
    testing:{ne:true}
    complete:{lt:100}
    archived:{ne:true}
  }
  $limit: Int =  1000
  $nextToken: String
) {
  listSurveyEntriess(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      startTime
      finishTime
      questionnaireId
      LocationId
      deleted
      archived
      testing
      complete
      createdAt
      updatedAt
      responses {
        items {
          id
        }
        nextToken
      }
      by {
        id
        name
        email
      }
      location {
        id
        location
        inchargeEmail
       
      }
    }
    nextToken
  }
}
`);
export const GET_QUESTION = /* GraphQL */ gql(`
  query GetQuestion($id: ID!) {
    getQuestion(id: $id) {
      id
      qu
      type
      isSelf
      isDependent
      listOptions {
        listValue
        nextQuestion
        isText
        isMultiple
      }
      deleted
      archived
      order
      responses {
        items {
          id
          res
          deleted
          archived
          createdAt
          updatedAt
        }
        nextToken
      }

      dependent {
        id
        options {
          dependentValue
          nextQuestion
        }
      }
  
      createdAt
      updatedAt
     
    }
    

  }
`);

export const TEST_SURVEY_ENTRIES = /* GraphQL */ gql(`
query ListSurveyEntriess(
  $filter: ModelSurveyEntriesFilterInput = {

    testing:{eq:true},
    archived:{ne:true}
  }
  $limit: Int =  1000
  $nextToken: String
) {
  listSurveyEntriess(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      startTime
      finishTime
      questionnaireId
      LocationId
      deleted
      archived
      testing
      complete
      createdAt
      updatedAt
      responses {
        items {
          id
        }
        nextToken
      }
      by {
        id
        name
        email
      }
      location {
        id
        location
        inchargeEmail
       
      }
    }
    nextToken
  }
}
`);
