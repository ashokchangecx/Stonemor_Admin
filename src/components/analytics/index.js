import { lazy, Suspense, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import {
  Autocomplete,
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { LIST_QUESTIONNARIES_NAME } from "../../graphql/custom/queries";
import SurveyByLocations from "./chart_report/SurveyByLocations";
import ResponsiveDateRangePicker from "../reusable/DateRangePicker";
import { Loader } from "../common/Loader";
import LocationByQuestionnaire from "./chart_report/LocationByQuestionnaire";
import BreadCrumbs from "../reusable/BreadCrumbs";
import moment from "moment-timezone";
import QuestionsByAnswer from "./QuestionsByAnswer";

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

const Analytics = ({
  surveyEntriesData,
  incompletedSurveyEntriesData,
  locationData,

  loadingLocations,
}) => {
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

  const [surveyLocation, setSuveyLocation] = useState(null);

  const [fromDate, setFromDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  let zone = "America/New_York";
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const handleChangeType = (event) => {
    setType(event.target.value);
  };

  const filterdSurveyLocations = locationData.filter((item1) => {
    const item2 = surveyEntriesData.find(
      (item) => item.LocationId === item1.locationID
    );
    return item2 !== undefined;
  });

  // const surveyEntryData = surveyEntries?.filter(
  //   (data) => data?.LocationId === surveyLocation?.locationID
  // );

  useEffect(() => {
    let filteredEntries = [];
    let filteredIncompleteEntries = [];
    if (fromDate && endDate && surveyLocation) {
      const SD = moment(fromDate).format("DD-MM-YYYY");
      const ED = endDate.getTime();

      if (SD === ED && surveyLocation) {
        const SDF = moment(fromDate).format("DD-MM-YYYY");

        filteredEntries = surveyEntriesData
          ?.filter((data) => data?.LocationId === surveyLocation?.locationID)
          ?.filter((entry) => {
            const CD = moment(entry.createdAt).format("DD-MM-YYYY") === SDF;
            return CD;
          });
        filteredIncompleteEntries = incompletedSurveyEntriesData
          // ?.filter((data) => data?.LocationId === surveyLocation?.locationID)
          ?.filter((entry) => {
            const CD = moment.tz(entry.createdAt).format("DD-MM-YYYY") === SDF;
            return CD;
          });
      } else if (SD !== ED && surveyLocation) {
        filteredEntries = surveyEntriesData
          ?.filter((data) => data?.LocationId === surveyLocation?.locationID)
          ?.filter((entry) => {
            const CD = new Date(entry.createdAt).getTime();
            return SD <= CD && CD <= ED;
          });
        filteredIncompleteEntries = incompletedSurveyEntriesData
          // ?.filter((data) => data?.LocationId === surveyLocation?.locationID)
          ?.filter((entry) => {
            const CD = new Date(entry.createdAt).getTime();
            return SD <= CD && CD <= ED;
          });
      }
    } else if (fromDate && endDate) {
      const SD = fromDate.getTime();
      const ED = endDate.getTime();

      if (SD === ED) {
        const SDF = moment(fromDate).format("DD-MM-YYYY");

        filteredEntries = surveyEntriesData?.filter((entry) => {
          const CD = moment(entry.createdAt).format("DD-MM-YYYY") === SDF;
          return CD;
        });
        filteredIncompleteEntries = incompletedSurveyEntriesData?.filter(
          (entry) => {
            const CD = moment(entry.createdAt).format("DD-MM-YYYY") === SDF;
            return CD;
          }
        );
      } else {
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
      }
    } else if (fromDate && surveyLocation) {
      const SD = fromDate.getTime();
      filteredEntries = surveyEntriesData
        ?.filter((data) => data?.LocationId === surveyLocation?.locationID)
        ?.filter((entry) => {
          const CD = new Date(entry.createdAt).getTime();
          return SD <= CD;
        });
      filteredIncompleteEntries = incompletedSurveyEntriesData
        // ?.filter((data) => data?.LocationId === surveyLocation?.locationID)
        ?.filter((entry) => {
          const CD = new Date(entry.createdAt).getTime();
          return SD <= CD;
        });
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
    } else if (endDate && surveyLocation) {
      const ED = endDate.getTime();
      filteredEntries = surveyEntriesData
        ?.filter((data) => data?.LocationId === surveyLocation?.locationID)
        ?.filter((entry) => {
          const CD = new Date(entry.createdAt).getTime();
          return CD <= ED;
        });
      filteredIncompleteEntries = incompletedSurveyEntriesData
        // ?.filter((data) => data?.LocationId === surveyLocation?.locationID)
        ?.filter((entry) => {
          const CD = new Date(entry.createdAt).getTime();
          return CD <= ED;
        });
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
    } else if (surveyLocation) {
      filteredEntries = surveyEntriesData?.filter(
        (data) => data?.LocationId === surveyLocation?.locationID
      );
      filteredIncompleteEntries = incompletedSurveyEntriesData;
      // ?.filter(
      //   (data) => data?.LocationId === surveyLocation?.locationID
      // );
    } else {
      filteredEntries = surveyEntriesData;
      filteredIncompleteEntries = incompletedSurveyEntriesData;
    }
    setSurveyEntries(filteredEntries);
    setIncompletedSurveyEntries(filteredIncompleteEntries);
  }, [fromDate, endDate, surveyLocation]);

  useEffect(() => {
    let typeFilteredEntries = [];
    if (type === "Link") {
      typeFilteredEntries = surveyEntries?.filter((data) => data?.by?.name);
    } else if (type === "QR Code") {
      typeFilteredEntries = surveyEntries?.filter((data) => data?.LocationId);
    } else if (type === "All") {
      typeFilteredEntries = surveyEntries?.filter(
        (data) => data?.by?.name || data?.LocationId
      );
    } else {
      typeFilteredEntries = surveyEntries?.filter(
        (data) => data?.by?.name || data?.LocationId
      );
    }
    setSurveyEntriesType(typeFilteredEntries);
  }, [type, surveyEntries]);

  useEffect(() => {
    let incompletedTypeFilteredEntries = [];
    if (type === "Link") {
      incompletedTypeFilteredEntries = incompletedSurveyEntries?.filter(
        (data) => data?.by?.name
      );
    } else if (type === "QR Code") {
      incompletedTypeFilteredEntries = incompletedSurveyEntries?.filter(
        (data) => data?.LocationId
      );
    } else if (type === "All") {
      incompletedTypeFilteredEntries = incompletedSurveyEntries?.filter(
        (data) => data?.by?.name || data?.LocationId
      );
    } else {
      incompletedTypeFilteredEntries = incompletedSurveyEntries?.filter(
        (data) => data?.by?.name || data?.LocationId
      );
    }
    setIncompletedSurveyEntriesType(incompletedTypeFilteredEntries);
  }, [type, surveyEntries]);

  if (loadingLocations) {
    return <Loader />;
  }

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
          <Tab label="Response" />
          <Tab label="Date" />
          <Tab label="Survey type" />
          <Tab label="Incomplete Surveys" />
        </Tabs>
        {tabValue !== 1 && (
          <Grid container spacing={2} mb={2} alignItems="flex-start">
            <Grid item xs={4} sm={2} md={1}>
              <Typography variant="button" color="primary">
                Filters
              </Typography>
            </Grid>
            <Grid item xs={10} sm={8} md={5}>
              <ResponsiveDateRangePicker
                fromDate={fromDate}
                setFromDate={setFromDate}
                endDate={endDate}
                setEndDate={setEndDate}
              />
            </Grid>
            {tabValue !== 4 && (
              <Grid item xs={10} sm={8} md={4}>
                <Autocomplete
                  id="location-select-demo"
                  sx={{ width: "100%", marginTop: "2px" }}
                  options={filterdSurveyLocations}
                  autoHighlight
                  getOptionLabel={(option) => option?.location}
                  onChange={(event, newValue) => setSuveyLocation(newValue)}
                  value={surveyLocation}
                  renderOption={(props, option) => (
                    <Box
                      component="li"
                      sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                      {...props}
                    >
                      {option?.location}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Choose a Location"
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: "new-password", // disable autocomplete and autofill
                      }}
                    />
                  )}
                />
              </Grid>
            )}
            {(tabValue === 2 || tabValue === 4) && (
              <>
                <Grid item xs={4} sm={4} md={2}>
                  <Box sx={{ minWidth: 120 }}>
                    <FormControl variant="standard">
                      <InputLabel
                        id="demo-simple-select-label"
                        color="secondary"
                      >
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
                        <MenuItem value="QR Code">
                          QR Code Survey Entries
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>
              </>
            )}
          </Grid>
        )}
      </Box>
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={2} alignItems="stretch">
          <Grid item xs={12} md={6}>
            <SurveyByLocations
              data={surveyEntries
                ?.slice()
                ?.sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )}
              setSelectedLocation={setSelectedLocation}
              fromDate={fromDate}
              endDate={endDate}
              locationData={locationData}
              loadingLocations={loadingLocations}
            />
          </Grid>
          {selectedLocation && (
            <Grid item xs={12} md={6}>
              <Suspense fallback={<Loader />}>
                <QuestionnariesByLocation
                  data={surveyEntries
                    ?.slice()
                    ?.sort(
                      (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                    )}
                  questionariesName={questionariesName}
                  loading={loading}
                  error={error}
                  selectedLocation={selectedLocation}
                  locationData={locationData}
                />
              </Suspense>
            </Grid>
          )}
        </Grid>
      </TabPanel>
      <TabPanel index={1} value={tabValue}>
        {loading ? (
          <Loader />
        ) : (
          <QuestionsByAnswer questionariesName={questionariesName} />
        )}
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <Grid item xs={12} md={6}>
          <SurveyByDate
            data={surveyEntriesType
              ?.slice()
              ?.sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )}
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
          <Grid item xs={12} md={6}>
            <SurveyByQrCode
              data={surveyEntries
                ?.slice()
                ?.sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )}
              questionariesName={questionariesName}
              setSelectedQuestionnarie={setSelectedQuestionnarie}
              fromDate={fromDate}
              endDate={endDate}
              locationData={locationData}
            />
          </Grid>
          {selectedQuestionnarie && (
            <Grid item xs={12} md={6}>
              <Suspense fallback={<Loader />}>
                <LocationByQuestionnaire
                  data={surveyEntries
                    ?.slice()
                    ?.sort(
                      (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                    )}
                  questionariesName={questionariesName}
                  loading={loading}
                  error={error}
                  selectedQuestionnarie={selectedQuestionnarie}
                  locationData={locationData}
                />
              </Suspense>
            </Grid>
          )}
          {!surveyLocation && (
            <Grid item xs={12} md={6}>
              <SurveyByLink
                data={surveyEntries
                  ?.slice()
                  ?.sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                  )}
                questionariesName={questionariesName}
                fromDate={fromDate}
                endDate={endDate}
              />
            </Grid>
          )}
          <Grid item xs={12} md={6}>
            <SurveyByQuestionnarie
              data={surveyEntries
                ?.slice()
                ?.sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )}
              questionariesName={questionariesName}
              loading={loading}
              error={error}
              fromDate={fromDate}
              endDate={endDate}
            />
          </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value={tabValue} index={4}>
        <Grid container spacing={2} alignItems="stretch">
          <Grid item xs={12} md={12}>
            <IncompletedSurveyByDate
              data={incompletedSurveyEntriesType
                ?.slice()
                ?.sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )}
              loading={loading}
              error={error}
              fromDate={fromDate}
              endDate={endDate}
              type={type}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <IncompletedSurveyByQuestionnarie
              data={incompletedSurveyEntriesType
                ?.slice()
                ?.sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )}
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
                data={incompletedSurveyEntriesType
                  ?.slice()
                  ?.sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                  )}
                // setSelectedLocation={setSelectedLocation}
                fromDate={fromDate}
                endDate={endDate}
                type={type}
                locationData={locationData}
              />
            </Grid>
          )}
        </Grid>
      </TabPanel>
    </div>
  );
};

export default Analytics;
