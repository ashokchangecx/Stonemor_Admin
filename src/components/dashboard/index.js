import { Alert, Box, Grid } from "@mui/material";
import useSmLocationData from "../../helpers/hooks/useSmLocationData";
import SurveyByDate from "../analytics/chart_report/SurveyByDate";
import SurveyByLocations from "../analytics/chart_report/SurveyByLocations";
import SurveyByQuestionnarie from "../analytics/chart_report/SurveyByQuestionnarie";
import { Loader } from "../common/Loader";
import Overview from "./Overview";
import WelcomeAdmin from "./WelcomeAdmin";

const Dashboard = ({
  surveyEntries,
  overviewReady,
  surveyCount,
  surveyLocationsCount,
  surveyUsersCount,
  questionariesName,
  locationData,
}) => {
  const surveyByDateData = surveyEntries
    ?.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    ?.slice(0, 100);
  const surveyEntriesCountData = surveyEntries.filter(
    (data) => data?.complete === 100
  );

  return (
    <>
    
    {locationData.length === 0 && <p  style={{display:"flex",justifyContent:"center",color:"red"}}>  <Alert severity="error">CRM Api Down</Alert></p>}
      <Grid
        container
        // rowGap={2}
        columns={12}
        spacing={{ xs: 2, md: 2, lg: 2 }}
        justifyItems="center"
        // py={1}
      >
        <Grid item xs={12} lg={6}>
          <WelcomeAdmin
            surveyEntries={surveyEntriesCountData}
            questionariesName={questionariesName?.listQuestionnaires?.items}
            surveyCount={surveyCount}
            surveyLocationsCount={surveyLocationsCount}
            surveyEntriesCount={surveyEntriesCountData?.length || 0}
            surveyUsersCount={surveyUsersCount}
            locationData={locationData}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          {!overviewReady && (
            <>
              <Overview
                surveyCount={surveyCount}
                surveyLocationsCount={surveyLocationsCount}
                surveyEntriesCount={surveyEntriesCountData?.length || 0}
                surveyUsersCount={surveyUsersCount}
              />
            </>
          )}
        </Grid>
        <Grid item xs={12} lg={6}>
          <SurveyByLocations
            data={surveyEntries}
            setSelectedLocation={() => null}
            locationData={locationData}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <SurveyByDate
            data={surveyByDateData}
            setSelectedLocation={() => null}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <SurveyByQuestionnarie
            data={surveyEntries}
            questionariesName={questionariesName}
          />
        </Grid>
      </Grid>{" "}
    </>
  );
};

export default Dashboard;
