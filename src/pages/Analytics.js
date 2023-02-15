import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import Analytics from "../components/analytics";
import { Loader } from "../components/common/Loader";
import { LIST_INCOMPLETED_SURVEY_ENTRIES } from "../graphql/custom/queries";
import withSuspense from "../helpers/hoc/withSuspense";
import useIncompletedSurveyEntries from "../helpers/hooks/userIncompletedSurveyEntries";
import useSurveyEntries from "../helpers/hooks/useSurveyEntries";
import useSmLocationData from "../helpers/hooks/useSmLocationData";

const AnalyticsPage = () => {
  // const { loading, surveyEntries } = useSurveyEntries({
  //   filter: { testing: { eq: true } },
  // });
  const { loading, surveyEntries } = useSurveyEntries();
  const { incompletedLoading, surveyIncompletedEntries } =
    useIncompletedSurveyEntries();
  const { loadingLocations, smLocations } = useSmLocationData();

  if (loading || incompletedLoading || loadingLocations) {
    return <Loader />;
  }

  return (
    <Analytics
      surveyEntriesData={surveyEntries}
      incompletedSurveyEntriesData={surveyIncompletedEntries}
      locationData={smLocations}
      loadingLocations={loadingLocations}
    />
  );
};

export default withSuspense(AnalyticsPage);
