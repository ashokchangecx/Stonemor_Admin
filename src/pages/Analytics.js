import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import Analytics from "../components/analytics";
import { Loader } from "../components/common/Loader";
import { LIST_INCOMPLETED_SURVEY_ENTRIES } from "../graphql/custom/queries";
import withSuspense from "../helpers/hoc/withSuspense";
import useSurveyEntries from "../helpers/hooks/useSurveyEntries";

const AnalyticsPage = () => {
  // const { loading, surveyEntries } = useSurveyEntries({
  //   filter: { testing: { eq: true } },
  // });
  const { loading, surveyEntries } = useSurveyEntries();
  const [incompeletedSurveyEntriesData, setIncompletedSurveyEntriesData] =
    useState([]);
  let variables = {
    limit: 10000,
  };

  const { data: listIncompletedSurveyEntriesData } = useQuery(
    LIST_INCOMPLETED_SURVEY_ENTRIES,
    {
      variables,
    }
  );
  useEffect(() => {
    setIncompletedSurveyEntriesData(
      listIncompletedSurveyEntriesData?.listSurveyEntriess?.items
    );
  }, [listIncompletedSurveyEntriesData?.listSurveyEntriess?.items]);

  if (loading) {
    return <Loader />;
  }
  return (
    <Analytics
      surveyEntriesData={surveyEntries}
      incompletedSurveyEntriesData={incompeletedSurveyEntriesData}
    />
  );
};

export default withSuspense(AnalyticsPage);
