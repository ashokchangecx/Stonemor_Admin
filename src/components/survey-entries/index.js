import { Box, Grid, Tab, Tabs } from "@mui/material";
import React, { useState, useEffect } from "react";
import moment from "moment-timezone";
import { useQuery } from "@apollo/client";
import {
  LIST_QUESTIONNARIES_NAME,
  LIST_SURVEY_ENTRIES,
  TEST_SURVEY_ENTRIES,
} from "../../graphql/custom/queries";

import withSuspense from "../../helpers/hoc/withSuspense";
import LinkSurveyEntries from "./LinkSurveyEntries";
import QrSurveyEntries from "./QrSurveyEntries";
import { Loader } from "../common/Loader";

import SearchBar from "../reusable/SearchBar";
import { lazy } from "react";
import BreadCrumbs from "../reusable/BreadCrumbs";
import useSmLocationData from "../../helpers/hooks/useSmLocationData";
import ResponsiveDateRangePicker from "../reusable/DateRangePicker";
import useSurveyEntries from "../../helpers/hooks/useSurveyEntries";

const IncompletedLinkSurveyEntries = lazy(() =>
  import("./IncompletedLinkSurveyEntries")
);
const IncompletedQrSurveyEntries = lazy(() =>
  import("./IncompletedQrSurevyEntries")
);
const TestLinkSurveyEntries = lazy(() => import("./TestLinkSurveyEntries"));
const TestQrSurveyEntries = lazy(() => import("./TestQrSurveyEntries"));

const TabPanel = (props) => {
  const { value, index, items, children, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <>
          {children}
          <Grid container spacing={2} alignItems="stretch">
            {items?.length > 0 &&
              items?.map((Item, i) => (
                <Grid item xs={12} sm={6} key={i}>
                  {Item}
                </Grid>
              ))}
          </Grid>
        </>
      )}
    </div>
  );
};
const SurveyEntries = () => {
  const [tabValue, setTabValue] = useState(0);

  const [TestSurveyEntries, setTestSurveyEntries] = useState([]);
  const [surveySearched, setSurveySearched] = useState("");
  const { loadingLocation, smLocations } = useSmLocationData();
  const { loading, surveyEntries: surveyEntriesData } = useSurveyEntries();
  const [fromDate, setFromDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  // const [surveyEntriesData, setSurveyEntriesData] = useState([]);
  const [surveyEntries, setSurveyEntries] = useState(surveyEntriesData);

  let variables = { limit: 10000 };

  const {
    loading: TestSurveyEntriesLoading,
    error: TestSurveyEntriesError,
    data: TestSurveyEntriesData,
  } = useQuery(TEST_SURVEY_ENTRIES, {
    variables,
  });
  const { data: questionariesName } = useQuery(LIST_QUESTIONNARIES_NAME);

  const handleSetTestResponses = (TestSurveyEntriesData) => {
    const {
      listSurveyEntriess: { items },
    } = TestSurveyEntriesData;
    if (items?.length > 0) setTestSurveyEntries(items);
  };

  const surveyEntriesList = surveyEntries?.filter(
    (user) => user?.responses?.items?.length !== 0
  );
  const TestSurveyEntriesList = TestSurveyEntries?.filter(
    (user) => user?.responses?.items?.length !== 0
  );

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    if (!TestSurveyEntriesLoading && !TestSurveyEntriesError)
      handleSetTestResponses(TestSurveyEntriesData);
  }, [TestSurveyEntriesLoading]);

  useEffect(() => {
    let filteredEntries = [];

    if (fromDate && endDate) {
      const SD = fromDate.getTime();
      const ED = endDate.getTime();

      if (SD === ED) {
        const SDF = moment(fromDate).format("DD-MM-YYYY");

        filteredEntries = surveyEntriesData?.filter((entry) => {
          const CD = moment(entry.createdAt).format("DD-MM-YYYY") === SDF;
          return CD;
        });
      } else {
        filteredEntries = surveyEntriesData?.filter((entry) => {
          const CD = new Date(entry.createdAt).getTime();
          return SD <= CD && CD <= ED;
        });
      }
    } else if (fromDate) {
      const SD = fromDate.getTime();
      filteredEntries = surveyEntriesData?.filter((entry) => {
        const CD = new Date(entry.createdAt).getTime();
        return SD <= CD;
      });
    } else if (endDate) {
      const ED = endDate.getTime();
      filteredEntries = surveyEntriesData?.filter((entry) => {
        const CD = new Date(entry.createdAt).getTime();
        return CD <= ED;
      });
    } else {
      filteredEntries = surveyEntriesData;
    }
    setSurveyEntries(filteredEntries);
  }, [fromDate, endDate, surveyEntriesData]);

  if (TestSurveyEntriesLoading || loadingLocation) {
    return <Loader />;
  }

  return (
    <div>
      <div sx={{ mt: 2 }}>
        <Grid container spacing={2} sx={{ p: "0.5rem" }}>
          <Grid item xs={6} md={3}>
            <BreadCrumbs active=" Survey Entries" />
          </Grid>
          <Grid item xs={10} sm={8} md={6}>
            <ResponsiveDateRangePicker
              fromDate={fromDate}
              setFromDate={setFromDate}
              endDate={endDate}
              setEndDate={setEndDate}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <SearchBar searchInput={(e) => setSurveySearched(e.target.value)} />
          </Grid>
        </Grid>
      </div>
      <Box
        sx={{
          width: "100%",
          bgcolor: "background.paper",
          mt: 2,
          // display: "flex",
          // justifyContent: "flex-start",
          // alignItems: "center",
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
          <Tab label=" Link  " />
          <Tab label=" Qr Code " />
          <Tab label=" Incompleted Link " />
          <Tab label=" Incompleted Qr code  " />
          <Tab label=" Test link  " />
          <Tab label=" Test Qr code  " />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        <LinkSurveyEntries
          surveyEntries={surveyEntriesList
            ?.filter((user) => user?.by?.name)
            ?.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )}
          questionnaries={questionariesName}
          linkSurvey={surveySearched}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <QrSurveyEntries
          surveyEntries={surveyEntriesList
            ?.filter((user) => user?.LocationId)
            ?.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )}
          questionnaries={questionariesName}
          qrSurvey={surveySearched}
          locationData={smLocations}
        />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <IncompletedLinkSurveyEntries
          questionnaries={questionariesName}
          incompleteLinkSurvey={surveySearched}
        />
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        <IncompletedQrSurveyEntries
          questionnaries={questionariesName}
          incompleteQrSurvey={surveySearched}
          locationData={smLocations}
        />
      </TabPanel>
      <TabPanel value={tabValue} index={4}>
        <TestLinkSurveyEntries
          surveyEntries={TestSurveyEntriesList?.filter(
            (user) => user?.by?.name
          )?.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )}
          questionnaries={questionariesName}
          testlinkSurvey={surveySearched}
        />
      </TabPanel>
      <TabPanel value={tabValue} index={5}>
        <TestQrSurveyEntries
          surveyEntries={TestSurveyEntriesList?.filter(
            (user) => user?.LocationId
          )?.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )}
          questionnaries={questionariesName}
          testQrSurvey={surveySearched}
          locationData={smLocations}
        />
      </TabPanel>
    </div>
  );
};

export default withSuspense(SurveyEntries);
