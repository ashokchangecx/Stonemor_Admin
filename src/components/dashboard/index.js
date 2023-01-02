import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { utils, writeFileXLSX } from "xlsx";
import { SurveyEntriesToExcel } from "../../utils/Excel";
import SurveyByDate from "../analytics/chart_report/SurveyByDate";
import SurveyByLocations from "../analytics/chart_report/SurveyByLocations";
import Overview from "./Overview";
import WelcomeAdmin from "./WelcomeAdmin";

const Dashboard = ({
  surveyEntries,
  overviewReady,
  surveyCount,
  surveyLocationsCount,
  surveyUsersCount,
}) => {
  const surveyByDateData = surveyEntries
    ?.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    ?.slice(0, 100);
  const handleDownloadingReport = () => {
    const modifiedSurveyEntries = SurveyEntriesToExcel(surveyByDateData);
    const ws = utils.json_to_sheet(modifiedSurveyEntries);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "SurveyEntries");
    writeFileXLSX(wb, "SurveyReports.xlsx");
  };

  // var fromDate = new Date();

  // var endDate = new Date(fromDate.getTime() + 10 * 24 * 60 * 60 * 1000);

  return (
    <Grid container rowGap={2} columns={12} justifyItems="center" py={1}>
      <Grid item xs={12} lg={6} paddingX={1}>
        <WelcomeAdmin onDownload={handleDownloadingReport} />
      </Grid>
      <Grid item xs={12} lg={6} paddingX={1}>
        {!overviewReady && (
          <Overview
            surveyCount={surveyCount}
            surveyLocationsCount={surveyLocationsCount}
            surveyEntriesCount={surveyEntries?.length || 0}
            surveyUsersCount={surveyUsersCount}
          />
        )}
      </Grid>
      <Grid item xs={12} lg={6} paddingX={1}>
        <SurveyByLocations
          data={surveyEntries}
          setSelectedLocation={() => null}
        />
      </Grid>
      <Grid item xs={12} lg={6} paddingX={1}>
        <SurveyByDate
          data={surveyByDateData}
          setSelectedLocation={() => null}
        />
      </Grid>
    </Grid>
  );
};

export default Dashboard;