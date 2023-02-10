import React from "react";
import Archived from "../components/archived";
import { LIST_RESPONSESS } from "../graphql/custom/queries";
import withSuspense from "../helpers/hoc/withSuspense";
import { useQuery } from "@apollo/client";
import useSurveyResponses from "../helpers/hooks/useSurveyResponses";
const ArchivedPage = () => {
  const {surveyResponses}=useSurveyResponses()



  const { data: questionnaries } = useQuery(LIST_RESPONSESS, {
    variables: {
      limit: 10000,
    },
  });
  console.log("questionnaries", questionnaries);


  console.log("kk",surveyResponses)
  return <Archived />;
};

export default withSuspense(ArchivedPage);
