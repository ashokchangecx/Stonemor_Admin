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
import { SurveyEntriesToExcel } from "../../utils/Excel";

const CHART_ID1 = "survey_by_locations";
const CHART_ID2 = "SurveyEntries_by_date";
const CHART_ID3 = "survey_by_questionnaire";

const charts = [
  { id: CHART_ID1, name: "Survey by Locations" },
  { id: CHART_ID2, name: "Survey by Date" },
  { id: CHART_ID3, name: "Survey by Questionnaire" },
];
const WelcomeAdmin = ({ surveyEntries, questionariesName = [] }) => {
  const handleDownloadingReport = () => {
    const modifiedSurveyEntries = SurveyEntriesToExcel(
      surveyEntries,
      questionariesName
    );
    const ws = utils.json_to_sheet(modifiedSurveyEntries);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "SurveyEntries");
    writeFileXLSX(wb, "SurveyReports.xlsx");
  };
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
        <Typography variant="h5" gutterBottom zIndex={9} position="relative">
          Hey Admin,
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
