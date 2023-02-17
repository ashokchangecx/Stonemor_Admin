import { useQuery } from "@apollo/client";
import useSurveyEntries from "../helpers/hooks/useSurveyEntries";
import { Loader } from "../components/common/Loader";
import Dashboard from "../components/dashboard";
import withSuspense from "../helpers/hoc/withSuspense";
import {
  COUNT_SURVEYS,
  COUNT_SURVEY_LOCATIONS,
  COUNT_SURVEY_USERS,
  LIST_QUESTIONNARIES_NAME,
} from "../graphql/custom/queries";
import useSmLocationData from "../helpers/hooks/useSmLocationData";

const DashboardPage = () => {
  const { loading, surveyEntries } = useSurveyEntries();
  const { data: questionariesName } = useQuery(LIST_QUESTIONNARIES_NAME);
  const { loadingLocation, smLocations } = useSmLocationData();

  const {
    loading: surveyCountLoading,
    error: surveyCountError,
    data: surveyCountData,
  } = useQuery(COUNT_SURVEYS);
  const {
    loading: surveyLocationCountLoading,
    error: surveyLocationCountError,
    data: surveyLocationCountData,
  } = useQuery(COUNT_SURVEY_LOCATIONS);
  const {
    loading: surveyUsersCountLoading,
    error: surveyUsersCountError,
    data: surveyUsersCountData,
  } = useQuery(COUNT_SURVEY_USERS);

  const overviewReady =
    Boolean(surveyCountLoading) ||
    Boolean(surveyCountError) ||
    Boolean(surveyLocationCountLoading) ||
    Boolean(surveyLocationCountError);
  Boolean(surveyUsersCountLoading) || Boolean(surveyUsersCountError);
  if (loading || loadingLocation) {
    return <Loader />;
  }
  return (
    <Dashboard
      surveyEntries={surveyEntries}
      overviewReady={overviewReady}
      questionariesName={questionariesName}
      surveyCount={surveyCountData?.listSurveys?.items?.length || 0}
      surveyLocationsCount={smLocations?.length || 0}
      surveyUsersCount={
        surveyUsersCountData?.listSurveyUsers?.items?.length || 0
      }
      locationData={smLocations}
    />
  );
};

export default withSuspense(DashboardPage);
