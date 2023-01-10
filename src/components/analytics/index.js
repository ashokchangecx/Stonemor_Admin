import { lazy, Suspense, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { LIST_QUESTIONNARIES_NAME } from "../../graphql/custom/queries";
import SurveyByLocations from "./chart_report/SurveyByLocations";
import ResponsiveDateRangePicker from "../reusable/DateRangePicker";
import { Loader } from "../common/Loader";
import LocationByQuestionnaire from "./chart_report/LocationByQuestionnaire";
import BreadCrumbs from "../reusable/BreadCrumbs";
import moment from "moment";

const QuestionnariesByLocation = lazy(() =>
  import("./chart_report/QuestionnariesByLocation")
);
const IncompletedSurveyByDate = lazy(() =>
  import("./chart_report/IncompletedSurveyDate")
);
const IncompletedSurveyByQuestionnarie = lazy(() =>
  import("./chart_report/IncompletedSurveyByQuestionnarie")
);
const SurveyByQrCode = lazy(() => import("./chart_report/SurveyByQrCode"));
const SurveyByQuestionnarie = lazy(() =>
  import("./chart_report/SurveyByQuestionnarie")
);
const SurveyByLink = lazy(() => import("./chart_report/SurveyByLink"));
const SurveyByDate = lazy(() => import("./chart_report/SurveyByDate"));

const IncompletedSurveyByLocations = lazy(() =>
  import("./chart_report/IncompletedSurveyByLocation")
);

const TabPanel = (props) => {
  const { value, index, children, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
};

const Analytics = ({ surveyEntriesData, incompletedSurveyEntriesData }) => {
  const {
    loading,
    data: questionariesName,
    error,
  } = useQuery(LIST_QUESTIONNARIES_NAME);
  const [surveyEntries, setSurveyEntries] = useState(surveyEntriesData);
  const [incompletedSurveyEntries, setIncompletedSurveyEntries] = useState(
    incompletedSurveyEntriesData
  );
  const [tabValue, setTabValue] = useState(0);
  const [type, setType] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedQuestionnarie, setSelectedQuestionnarie] = useState(null);
  const [surveyEntriesType, setSurveyEntriesType] = useState(surveyEntriesData);
  const [incompletedSurveyEntriesType, setIncompletedSurveyEntriesType] =
    useState(incompletedSurveyEntriesData);
  const [fromDate, setFromDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const handleChangeType = (event) => {
    setType(event.target.value);
  };

  useEffect(() => {
    let filteredEntries = [];
    let filteredIncompleteEntries = [];
    if (fromDate && endDate) {
      const SD = fromDate.getTime();
      const ED = endDate.getTime();

      // if (SD === ED) {
      //   const SDF = moment(fromDate).format(" DD MM YYYY");

      //   filteredEntries = surveyEntriesData?.filter((entry) => {
      //     const CD = moment(entry.createdAt).format(" DD MM YYYY") === SDF;
      //     return CD;
      //   });
      //   // filteredIncompleteEntries = incompletedSurveyEntriesData?.filter(
      //   //   (entry) => {
      //   //     const CD = moment(entry.createdAt).format(" DD MM YYYY") === SDF;
      //   //     return CD;
      //   //   }
      //   // );
      // } else {
      filteredEntries = surveyEntriesData?.filter((entry) => {
        const CD = new Date(entry.createdAt).getTime();
        return SD <= CD && CD <= ED;
      });
      filteredIncompleteEntries = incompletedSurveyEntriesData?.filter(
        (entry) => {
          const CD = new Date(entry.createdAt).getTime();
          return SD <= CD && CD <= ED;
        }
      );
      // }
    } else if (fromDate) {
      const SD = fromDate.getTime();
      filteredEntries = surveyEntriesData?.filter((entry) => {
        const CD = new Date(entry.createdAt).getTime();
        return SD <= CD;
      });
      filteredIncompleteEntries = incompletedSurveyEntriesData?.filter(
        (entry) => {
          const CD = new Date(entry.createdAt).getTime();
          return SD <= CD;
        }
      );
    } else if (endDate) {
      const ED = endDate.getTime();
      filteredEntries = surveyEntriesData?.filter((entry) => {
        const CD = new Date(entry.createdAt).getTime();
        return CD <= ED;
      });
      filteredIncompleteEntries = incompletedSurveyEntriesData?.filter(
        (entry) => {
          const CD = new Date(entry.createdAt).getTime();
          return CD <= ED;
        }
      );
    } else {
      filteredEntries = surveyEntriesData;
      filteredIncompleteEntries = incompletedSurveyEntriesData;
    }
    setSurveyEntries(filteredEntries);
    setIncompletedSurveyEntries(filteredIncompleteEntries);
  }, [fromDate, endDate]);

  useEffect(() => {
    let typeFilteredEntries = [];
    if (type === "Link") {
      typeFilteredEntries = surveyEntries?.filter((data) => data?.by?.name);
    } else if (type === "QrCode") {
      typeFilteredEntries = surveyEntries?.filter(
        (data) => data?.location?.location
      );
    } else if (type === "All") {
      typeFilteredEntries = surveyEntries;
    } else {
      typeFilteredEntries = surveyEntries;
    }
    setSurveyEntriesType(typeFilteredEntries);
  }, [type, surveyEntries]);

  useEffect(() => {
    let incompletedTypeFilteredEntries = [];
    if (type === "Link") {
      incompletedTypeFilteredEntries = incompletedSurveyEntries?.filter(
        (data) => data?.by?.name
      );
    } else if (type === "QrCode") {
      incompletedTypeFilteredEntries = incompletedSurveyEntries?.filter(
        (data) => data?.location?.location
      );
    } else if (type === "All") {
      incompletedTypeFilteredEntries = incompletedSurveyEntries;
    } else {
      incompletedTypeFilteredEntries = incompletedSurveyEntries;
    }
    setIncompletedSurveyEntriesType(incompletedTypeFilteredEntries);
  }, [type, surveyEntries]);

  return (
    <div>
      <Grid container spacing={2} sx={{ py: "0.5rem" }}>
        <Grid item xs={6}>
          <BreadCrumbs active="Analytics" />
        </Grid>
        <Grid item xs={6}></Grid>
      </Grid>
      <Box
        sx={{
          width: "100%",
          bgcolor: "background.paper",
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleChange}
          textColor="primary"
          indicatorColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs "
          sx={{
            maxWidth: "100%",
            backgroundColor: "secondary.light",
            px: 3,
            borderRadius: 2,
            mb: 2,
          }}
        >
          <Tab label="Locations" />
          <Tab label="Survey type" />
          <Tab label="Date" />
          <Tab label="Incompleted Survey Entries" />
        </Tabs>
        <Grid container spacing={3} mb={2} alignItems="flex-start">
          <Grid item xs={4} sm={2} md={1}>
            <Typography variant="button" color="primary">
              Filters
            </Typography>
          </Grid>
          <Grid item xs={10} sm={8} md={6}>
            <ResponsiveDateRangePicker
              fromDate={fromDate}
              setFromDate={setFromDate}
              endDate={endDate}
              setEndDate={setEndDate}
            />
          </Grid>
          {tabValue > 1 && (
            <Grid item xs={4} sm={4}>
              <Box sx={{ minWidth: 120 }}>
                <FormControl variant="standard">
                  <InputLabel id="demo-simple-select-label" color="secondary">
                    Type Filter
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={type}
                    name="type"
                    label="Type Filter"
                    onChange={handleChangeType}
                    color="secondary"
                  >
                    <MenuItem value="All"> All Survey Entries</MenuItem>
                    <MenuItem value="Link"> Link Survey Entries</MenuItem>
                    <MenuItem value="QrCode">Qrcode Survey Entries</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={2} alignItems="stretch">
          <Grid item xs={12} md={6}>
            <SurveyByLocations
              data={surveyEntries}
              setSelectedLocation={setSelectedLocation}
              fromDate={fromDate}
              endDate={endDate}
            />
          </Grid>
          {selectedLocation && (
            <Grid item xs={12} md={6}>
              <Suspense fallback={<Loader />}>
                <QuestionnariesByLocation
                  data={surveyEntries}
                  questionariesName={questionariesName}
                  loading={loading}
                  error={error}
                  selectedLocation={selectedLocation}
                />
              </Suspense>
            </Grid>
          )}
          <Grid item xs={12} md={6}>
            <SurveyByQuestionnarie
              data={surveyEntries}
              questionariesName={questionariesName}
              loading={loading}
              error={error}
              fromDate={fromDate}
              endDate={endDate}
            />
          </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={2} alignItems="stretch">
          <Grid item xs={12} md={6}>
            <SurveyByQrCode
              data={surveyEntries}
              questionariesName={questionariesName}
              setSelectedQuestionnarie={setSelectedQuestionnarie}
              fromDate={fromDate}
              endDate={endDate}
            />
          </Grid>
          {selectedQuestionnarie && (
            <Grid item xs={12} md={6}>
              <Suspense fallback={<Loader />}>
                <LocationByQuestionnaire
                  data={surveyEntries}
                  questionariesName={questionariesName}
                  loading={loading}
                  error={error}
                  selectedQuestionnarie={selectedQuestionnarie}
                />
              </Suspense>
            </Grid>
          )}
          <Grid item xs={12} md={6}>
            <SurveyByLink
              data={surveyEntries}
              questionariesName={questionariesName}
              fromDate={fromDate}
              endDate={endDate}
            />
          </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <Grid item xs={12} md={6}>
          <SurveyByDate
            data={surveyEntriesType}
            loading={loading}
            error={error}
            fromDate={fromDate}
            endDate={endDate}
            type={type}
          />
        </Grid>
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={2} alignItems="stretch">
          <Grid item xs={12} md={12}>
            <IncompletedSurveyByDate
              data={incompletedSurveyEntriesType}
              loading={loading}
              error={error}
              fromDate={fromDate}
              endDate={endDate}
              type={type}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <IncompletedSurveyByQuestionnarie
              data={incompletedSurveyEntriesType}
              questionariesName={questionariesName}
              loading={loading}
              error={error}
              fromDate={fromDate}
              endDate={endDate}
              type={type}
            />
          </Grid>
          {type !== "Link" && (
            <Grid item xs={12} md={6}>
              <IncompletedSurveyByLocations
                data={incompletedSurveyEntriesType}
                // setSelectedLocation={setSelectedLocation}
                fromDate={fromDate}
                endDate={endDate}
                type={type}
              />
            </Grid>
          )}
        </Grid>
      </TabPanel>
    </div>
  );
};

export default Analytics;
