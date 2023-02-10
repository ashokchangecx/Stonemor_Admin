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
  // const [incompeletedSurveyEntriesData, setIncompletedSurveyEntriesData] =
  //   useState([]);

  // let variables = {
  //   limit: 100000,
  // };

  // const {
  //   loading: listIncompletedSurveyEntriesLoading,
  //   error: listIncompletedSurveyEntriesError,
  //   data: listIncompletedSurveyEntriesData,
  // } = useQuery(LIST_INCOMPLETED_SURVEY_ENTRIES, {
  //   variables,
  // });
  // useEffect(() => {
  //   if (
  //     !listIncompletedSurveyEntriesLoading &&
  //     !listIncompletedSurveyEntriesError
  //   )
  //     setIncompletedSurveyEntriesData(
  //       listIncompletedSurveyEntriesData?.listSurveyEntriess?.items
  //     );
  // }, [
  //   listIncompletedSurveyEntriesLoading,
  //   listIncompletedSurveyEntriesData?.listSurveyEntriess?.items,
  // ]);

  if (loading) {
    return <Loader />;
  }
  if (incompletedLoading) {
    return <Loader />;
  }
  if (loadingLocations) {
    return <Loader />;
  }
  // if (listIncompletedSurveyEntriesLoading) {
  //   return <Loader />;
  // }
  // if (listIncompletedSurveyEntriesError) {
  //   return <>error</>;
  // }
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
