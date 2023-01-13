import {
  CardContent,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import { utils, writeFileXLSX } from "xlsx";
import { adminDownloadChartsAsPDF } from "../../utils/PDF";
import {
  LinkSurveyEntriesToExcel,
  QrCodeSurveyEntriesToExcel,
  SurveyEntriesBydateToExcel,
  SurveyEntriesByLocationToExcel,
  SurveyEntriesByQuestionnariesToExcel,
} from "../../utils/Excel";
import moment from "moment";
import { useEffect, useState } from "react";
import { Auth } from "aws-amplify";

const CHART_ID1 = "survey_by_locations";
const CHART_ID2 = "Survey_Entries_by_date";
const CHART_ID3 = "survey_by_questionnaire";
const charts = [
  { id: CHART_ID1, name: "Survey by Locations" },
  { id: CHART_ID2, name: "Survey by Date" },
  { id: CHART_ID3, name: "Number of Completed by Available Surveys" },
];
const WelcomeAdmin = ({
  surveyEntries,
  questionariesName = [],
  surveyCount,
  surveyEntriesCount,
  surveyUsersCount,
  surveyLocationsCount,
}) => {
  const TotalCountsData = [
    { title: "Total Surveys", count: surveyCount },
    { title: "Total Users", count: surveyUsersCount },
    { title: "Total Survey Entries", count: surveyEntriesCount },

    { title: "Total Locations", count: surveyLocationsCount },
  ];

  const handleDownloadingReport = () => {
    const modifiedSurveyEntries = QrCodeSurveyEntriesToExcel(
      surveyEntries,
      questionariesName
    );
    const ws = utils.json_to_sheet(modifiedSurveyEntries);
    const modifiedLinkSurveyEntries = LinkSurveyEntriesToExcel(
      surveyEntries,
      questionariesName
    );

    const ws2 = utils.json_to_sheet(modifiedLinkSurveyEntries);

    const modifiedSurveyEntriesByQuestionnaries =
      SurveyEntriesByQuestionnariesToExcel(surveyEntries, questionariesName);

    const ws3 = utils.json_to_sheet(modifiedSurveyEntriesByQuestionnaries);

    const modifiedSurveyEntriesByLocation =
      SurveyEntriesByLocationToExcel(surveyEntries);

    const ws4 = utils.json_to_sheet(modifiedSurveyEntriesByLocation);

    const modifiedSurveyEntriesByDate =
      SurveyEntriesBydateToExcel(surveyEntries);

    const ws5 = utils.json_to_sheet(modifiedSurveyEntriesByDate);

    ws["!cols"] = [];
    ws["!cols"] = [
      { width: 5 }, // width for col A
      { width: 30 }, // width for col B
      { width: 30 }, // width for col c
      { width: 30 }, // width for col d
      { width: 15 }, // width for col e
      { width: 15 }, // width for col e
      { width: 10 }, // width for col f

      { hidden: true },
    ]; // hidding col g

    ws2["!cols"] = [];
    ws2["!cols"] = [
      { width: 5 }, // width for col A
      { width: 30 }, // width for col B
      { width: 30 }, // width for col c
      { width: 30 }, // width for col d
      { width: 15 }, // width for col e
      { width: 15 }, // width for col e
      { width: 10 }, // width for col f

      { hidden: true },
    ]; // hidding col g

    ws3["!cols"] = [];
    ws3["!cols"] = [
      { width: 5 }, // width for col A
      { width: 30 }, // width for col B
      { width: 10 }, // width for col c

      { hidden: true },
    ]; // hidding col d
    ws4["!cols"] = [];
    ws4["!cols"] = [
      { width: 5 }, // width for col A
      { width: 30 }, // width for col B
      { width: 10 }, // width for col c

      { hidden: true },
    ]; // hidding col d

    ws5["!cols"] = [];
    ws5["!cols"] = [
      { width: 5 }, // width for col A
      { width: 20 }, // width for col B
      { width: 10 }, // width for col c

      { hidden: true },
    ]; // hidding col d

    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Qr Code Survey Entries");
    utils.book_append_sheet(wb, ws2, "Link Survey Entries");
    utils.book_append_sheet(wb, ws3, " Survey By Questionnaries");
    utils.book_append_sheet(wb, ws4, " Survey By Locations");
    utils.book_append_sheet(wb, ws5, " Survey By Date");
    writeFileXLSX(wb, `SurveyReports_${moment().format("MM-DD-YYYY")}.xlsx`);
  };

  const [profile, setProfile] = useState({});
  useEffect(() => {
    Auth.currentUserInfo()
      .then((res) => {
        setProfile(res);
        return res;
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
  return (
    <Paper
      variant="elevation"
      elevation={3}
      sx={{
        overflow: "hidden",
        position: "relative",
        borderRadius: "20px",
        borderWidth: "0px",
        ":before": {
          content: `""`,
          position: "absolute",
          width: "100%",
          height: "100%",
          transform: "unset",
          backgroundRepeat: "no-repeat",
          backgroundImage: `url(/image/USER_BG.svg)`,
          backgroundPosition: "80% 1%",
          backgroundSize: "30%",
        },
      }}
    >
      <CardContent>
        <Typography
          variant="h5"
          gutterBottom
          zIndex={9}
          position="relative"
          fontSize={{
            lg: 25,
            md: 25,
            sm: 20,
            xs: 16,
          }}
        >
          Hello, {profile?.username}
          <br />
          Download Latest Report
        </Typography>
        <Tooltip title="Download as Excel">
          <IconButton
            variant="contained"
            sx={{ my: 2, mx: 1 }}
            size="medium"
            color="secondary"
            onClick={handleDownloadingReport}
          >
            <TextSnippetIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Download as PDF">
          <IconButton
            variant="contained"
            sx={{ my: 2, mx: 1 }}
            size="medium"
            color="secondary"
            onClick={() =>
              adminDownloadChartsAsPDF(
                charts,

                TotalCountsData
              )
            }
          >
            <PictureAsPdfIcon />
          </IconButton>
        </Tooltip>
      </CardContent>
    </Paper>
  );
};
export default WelcomeAdmin;
