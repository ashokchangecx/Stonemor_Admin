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
} from "../../utils/Excel";
import moment from "moment";
import { Auth } from "aws-amplify";
import { useEffect, useState } from "react";

const CHART_ID1 = "survey_by_locations";
const CHART_ID2 = "Survey Entries_by_date";
const CHART_ID3 = "survey_by_questionnaire";

const charts = [
  { id: CHART_ID1, name: "Survey by Locations" },
  { id: CHART_ID2, name: "Survey by Date" },
  { id: CHART_ID3, name: "Survey by Questionnaire" },
];
const WelcomeAdmin = ({ surveyEntries, questionariesName = [] }) => {
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

    ws["!cols"] = [];
    ws["!cols"] = [
      { width: 5 }, // width for col A
      { width: 30 }, // width for col B
      { width: 30 }, // width for col c
      { width: 30 }, // width for col d
      { width: 30 }, // width for col e
      { width: 10 }, // width for col f

      { hidden: true },
    ]; // hidding col g
    ws2["!cols"] = [];
    ws2["!cols"] = [
      { width: 5 }, // width for col A
      { width: 30 }, // width for col B
      { width: 30 }, // width for col c
      { width: 30 }, // width for col d
      { width: 30 }, // width for col e
      { width: 10 }, // width for col f

      { hidden: true },
    ]; // hidding col g
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Qr Code Survey Entries");
    utils.book_append_sheet(wb, ws2, "Link Survey Entries");
    writeFileXLSX(wb, `SurveyReports_${moment().format("DD-MM-YYYY")}.xlsx`);
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
            lg: 30,
            md: 25,
            sm: 20,
            xs: 10,
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
                charts
                // SurveyEntriesToExcel(surveyEntries, questionariesName)
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
