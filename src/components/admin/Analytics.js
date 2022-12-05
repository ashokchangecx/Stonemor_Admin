import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import gql from "graphql-tag";
import { compose, graphql } from "react-apollo";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {
  Box,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  RadialLinearScale,
} from "chart.js";
import {
  Bar,
  getElementAtEvent,
  Doughnut,
  Line,
  PolarArea,
} from "react-chartjs-2";
import moment from "moment";
import {
  listQuestionnaires,
  listResponsess,
  listSurveyEntriess,
  listSurveyUsers,
  listQuestions,
  listSurveys,
} from "../../graphql/queries";
import BarChart from "../analytics/BarChart";

/* ChartJS registeration*/
ChartJS.register(
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  BarElement,
  ArcElement,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

/* MUI style */
const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.up("sm")]: {
      marginLeft: 240,
    },
    flexGrow: 1,
    overflow: "hidden",
    marginTop: 20,
    padding: theme.spacing(0, 3),
  },
  chartCon: {
    [theme.breakpoints.up("md")]: {
      gridTemplateColumns: "repeat(2,1fr)",
    },
    display: "grid",
    gridTemplateColumns: "1fr",
    gridGap: theme.spacing(3, 5),
  },
}));

const COLORS = [
  "#ff6600",
  "#009900",

  "#ac000b",
  "#cc00cc",
  "#002d98",
  "#a46a50",
  "#004c00",
  "#ffcdc1",
  "#ff0000",
  "#3333cc",
];

var colors = [];
while (colors.length < 100) {
  do {
    var color = Math.floor(Math.random() * 1000000 + 1);
  } while (colors.indexOf(color) >= 0);
  colors.push("#" + ("800000" + color.toString(16)).slice(-6));
}

var colors1 = [];
while (colors1.length < 100) {
  do {
    var color1 = Math.floor(Math.random() * 1000000 + 1);
  } while (colors1.indexOf(color1) >= 0);
  colors1.push("#" + ("000000" + color1.toString(16)).slice(-6));
}
var colors2 = [];
while (colors2.length < 100) {
  do {
    var color2 = Math.floor(Math.random() * 1000000 + 1);
  } while (colors2.indexOf(color2) >= 0);
  colors2.push("#" + ("123123" + color2.toString(16)).slice(-6));
}
var colors3 = [];
while (colors3.length < 100) {
  do {
    var color3 = Math.floor(Math.random() * 1000000 + 1);
  } while (colors3.indexOf(color3) >= 0);
  colors3.push("#" + ("242442" + color3.toString(16)).slice(-6));
}

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: "StoneMor Survey by Location",
    },
  },
  scales: {
    y: {
      min: 0, // minimum value
      max: 20, // maximum value
    },
  },
  parsing: {
    xAxisKey: "locationName",
    yAxisKey: "count",
  },
};
export const options1 = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: "StoneMor Survey by link Responses",
    },
  },
  scales: {
    y: {
      min: 0, // minimum value
      max: 20, // maximum value
    },
  },
  parsing: {
    xAxisKey: "surveyName",
    yAxisKey: "count",
  },
};
export const options2 = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: "StoneMor Survey by Qr Code Responses",
    },
  },
  scales: {
    y: {
      min: 0, // minimum value
      max: 20, // maximum value
    },
  },
  parsing: {
    xAxisKey: "surveyName",
    yAxisKey: "count",
  },
};
export const options4 = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: "StoneMor Survey Resposes by Date",
    },
  },
  scales: {
    y: {
      min: 0, // minimum value
      max: 20, // maximum value
    },
  },
  parsing: {
    xAxisKey: "surveyName",
    yAxisKey: "count",
  },
};
export const options3 = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    // legend: {
    //   display: false,
    // },
    title: {
      display: true,
      text: "By Questionarie",
    },
  },
};

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const a11yProps = (index) => {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
};

const Loader = () => (
  <div>
    <CircularProgress />
  </div>
);

const ratingName = [
  {
    id: 1,
    name: "Very Dissatisfied",
  },
  {
    id: 2,
    name: "Dissatisfied",
  },
  {
    id: 3,
    name: "Neutral",
  },
  {
    id: 4,
    name: "Satisfied",
  },
  {
    id: 5,
    name: "Very Satisfied",
  },
];

const AnalyticsPort = (props) => {
  const histroy = useHistory();
  const chartRef = useRef();
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [surveyByLocations, setSurveyByLocations] = useState([]);
  const [surveyByLink, setSurveyByLink] = useState([]);
  const [surveyByQr, setSurveyByQr] = useState([]);
  const [surveyByDate, setSurveyByDate] = useState([]);
  const [surveyBySurveyData, setSurveyBySurveyData] = useState([]);
  const [surveyRatings, setSurveyRatings] = useState([]);
  const [ratingQuestionnaires, setRatingQuestionnaires] = useState("");
  const [ratingSurvey, setRatingSurvey] = useState("");
  const {
    data: { listQuestions },
  } = props.listQuestions;
  const {
    data: { listSurveys },
  } = props.listSurveys;

  const surveyRatingList = listQuestions?.items
    ?.filter(
      (m) =>
        m?.type === "LIST" &&
        m.questionnaire !== null &&
        m.questionnaire?.id === ratingQuestionnaires
    )
    ?.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const [ratingQuestion, setRatingQuestion] = useState("");
  const [questionarie, setQuestionarie] = useState("");

  const {
    error: surveyEntriessError,
    loading: surveyEntriessLoading,
    listSurveyEntriess,
  } = props?.listSurveyEntriess?.data;
  const { listQuestionnaires } = props?.listQuestionnaires?.data;
  const { listResponsess, loading: listResponsessLoading } =
    props?.listResponsess?.data;

  const SurveyQuestionarrire = listSurveys?.items
    ?.filter((m) => m?.id === ratingSurvey)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  const Survey = listSurveys?.items?.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  console.log("SurveyQuestionarrire", SurveyQuestionarrire);
  console.log("ratingQuestion", ratingQuestion);
  console.log("listSurveys", listSurveys);
  console.log("ratingSurvey", ratingSurvey);

  const onGettingQuestionnaireById = (id) => {
    const que = listQuestionnaires?.items?.find((q) => q?.id === id);

    return que?.name ?? id;
  };
  const onClickSurveyByLocationNav = (event) => {
    const { locationId } = event;
    histroy.push(`/admin/qrresponses?lid=${locationId}`);
  };
  const onClickSurveyByQrResponsesNav = (event) => {
    const { QrResId } = event;
    histroy.push(`/admin/qrresponses?Qrid=${QrResId}`);
  };
  const onClickSurveyByLinkResponsesNav = (event) => {
    const { LinkResId } = event;
    histroy.push(`/admin/responses?Lrid=${LinkResId}`);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  //rating//

  const onGettingQuestionById = (id) => {
    return ratingName[id]?.name;
  };

  console.log("surveyRatingList", surveyRatingList);

  useEffect(() => {
    const surveyQue = listQuestions?.items?.find(
      (loc) => loc?.id === ratingQuestion
    );

    setQuestionarie(surveyQue?.questionnaire?.name || "");
  }, [ratingQuestion]);

  useEffect(() => {
    if (ratingSurvey) {
      setRatingQuestionnaires("");
      setRatingQuestion("");
    }
  }, [ratingSurvey]);

  useEffect(() => {
    if (ratingQuestion) {
      const counts = listResponsess?.items
        ?.filter((m) => m?.qu?.id === ratingQuestion)
        ?.reduce((counts, { qu, res }) => {
          const rating = onGettingQuestionById(res - 1);
          const resId = res;
          const question = qu?.qu;

          const count = (counts[resId]?.count || 0) + 1;
          const loc = {
            resId,
            count,
            question,
            rating,
          };
          counts[resId] = loc;
          return counts;
        }, {});

      setSurveyRatings(
        Object.entries(counts)
          ?.map(([name, obj]) => obj)
          ?.sort((a, b) => b?.resId - a?.resId)
      );
    }
    return () => null;
  }, [ratingQuestion]);

  useEffect(() => {
    if (!surveyEntriessLoading) {
      const counts = listSurveyEntriess?.items?.reduce(
        (counts, { location }) => {
          if (location?.id) {
            const locationId = location?.id || "no-loc";

            const locationName = location?.location || "No Location";
            const count = (counts[locationId]?.count || 0) + 1;
            const loc = {
              locationId,
              locationName,
              count,
            };
            counts[locationId] = loc;
          }
          return counts;
        },
        {}
      );

      setSurveyByLocations(
        Object.entries(counts)
          ?.map(([name, obj]) => obj)
          ?.sort((a, b) => b?.count - a?.count)
      );
    }
    return () => null;
  }, [surveyEntriessLoading]);

  useEffect(() => {
    if (!surveyEntriessLoading) {
      const countsDate = listSurveyEntriess?.items.reduce(
        (countsDate, data) => {
          const date1 =
            onGettingQuestionnaireById(data?.questionnaireId) || "no-Survey";
          const surveyName =
            onGettingQuestionnaireById(data?.questionnaireId) || "No Survey";
          const count = (countsDate[date1]?.count || 0) + 1;

          const loc = {
            date1,
            surveyName,
            count,
          };
          countsDate[date1] = loc;
          return countsDate;
        },
        {}
      );

      setSurveyByDate(
        Object.entries(countsDate)
          ?.map(([name, obj]) => obj)
          ?.sort((a, b) => b?.count - a?.count)
      );
    }
    return () => null;
  }, [surveyEntriessLoading]);

  useEffect(() => {
    if (!surveyEntriessLoading) {
      const counts = listSurveyEntriess?.items
        ?.filter((data) => data?.by?.name)

        ?.reduce((counts, data) => {
          const LinkResId = data?.questionnaireId;
          const date1 =
            onGettingQuestionnaireById(data?.questionnaireId) || "no-Survey";
          const surveyName =
            onGettingQuestionnaireById(data?.questionnaireId) || "No Survey";
          const count = (counts[date1]?.count || 0) + 1;

          const loc = {
            date1,
            surveyName,
            count,
            LinkResId,
          };
          counts[date1] = loc;
          return counts;
        }, {});

      setSurveyByLink(
        Object.entries(counts)
          ?.map(([name, obj]) => obj)
          ?.sort((a, b) => b?.count - a?.count)
      );
    }
    return () => null;
  }, [surveyEntriessLoading]);

  useEffect(() => {
    if (!surveyEntriessLoading) {
      const counts = listSurveyEntriess?.items
        ?.filter((data) => data?.location?.location)
        .reduce((counts, data) => {
          const QrResId = data?.questionnaireId;
          const date1 =
            onGettingQuestionnaireById(data?.questionnaireId) || "no-Survey";
          const surveyName =
            onGettingQuestionnaireById(data?.questionnaireId) || "No Survey";
          const count = (counts[date1]?.count || 0) + 1;

          const loc = {
            date1,
            surveyName,
            count,
            QrResId,
          };
          counts[date1] = loc;
          return counts;
        }, {});

      setSurveyByQr(
        Object.entries(counts)
          ?.map(([name, obj]) => obj)
          ?.sort((a, b) => b?.count - a?.count)
      );
    }
    return () => null;
  }, [surveyEntriessLoading]);

  //survey by survey date//

  useEffect(() => {
    if (!surveyEntriessLoading) {
      const counts = listSurveyEntriess?.items.reduce((counts, data) => {
        const date1 =
          moment(data?.finishTime).format("YYYY-MM-DD") || "no-Survey";
        const surveyName =
          moment(data?.finishTime).format("YYYY-MM-DD") || "No Survey";

        const count = (counts[date1]?.count || 0) + 1;

        const loc = {
          date1,
          surveyName,
          count,
        };
        counts[date1] = loc;
        return counts;
      }, {});

      setSurveyBySurveyData(
        Object.entries(counts)
          ?.map(([name, obj]) => obj)
          .sort(
            (a, b) =>
              new Date(b.surveyName).getTime() -
              new Date(a.surveyName).getTime()
          )
      );
    }
    return () => null;
  }, [surveyEntriessLoading]);

  // useEffect(() => {
  //   if (!listResponsessLoading) {
  //     const counts = listResponsess?.items
  //       ?.filter((m) => m?.qu?.type === "LIST")
  //       ?.reduce((counts, { qu, res }) => {
  //         const resId = res;
  //         const count = (counts[resId]?.count || 0) + 1;
  //         const loc = {
  //           resId,
  //           count,
  //         };
  //         counts[resId] = loc;
  //         return counts;
  //       }, {});

  //     setSurveyRatings(
  //       Object.entries(counts)
  //         ?.map(([name, obj]) => obj)
  //         ?.sort((a, b) => b?.resId - a?.resId)
  //     );
  //   }
  //   return () => null;
  // }, [listResponsessLoading]);

  const data = {
    labels: surveyByDate?.map((d) => d?.date1),
    datasets: [
      {
        label: "Survey Count ",
        data: surveyByDate?.map((d) => d?.count),
        backgroundColor: COLORS,
        borderColor: COLORS,
        borderWidth: 1,
      },
    ],
  };
  const data1 = {
    labels: surveyByLink?.map((d) => d?.date1),
    datasets: [
      {
        label: "Survey Count",
        data: surveyByLink?.map((d) => d?.count),
        backgroundColor: COLORS,
        borderColor: COLORS,
        borderWidth: 1,
      },
    ],
  };
  const data2 = {
    labels: surveyByQr?.map((d) => d?.date1),
    datasets: [
      {
        label: "Survey Count",
        data: surveyByQr?.map((d) => d?.count),
        backgroundColor: COLORS,
        borderColor: COLORS,
        borderWidth: 1,
      },
    ],
  };

  const data3 = {
    labels: surveyBySurveyData?.map((d) => d?.date1),
    datasets: [
      {
        label: "# Survey Count",
        data: surveyBySurveyData?.map((d) => d?.count),
        backgroundColor: COLORS,
        borderColor: COLORS,
        borderWidth: 1,
      },
    ],
  };

  const dataForPolarArea = {
    labels: surveyRatings?.map((d) => d?.resId),
    datasets: [
      {
        // label: "# Survey Rating",
        data: surveyRatings?.map((d) => d?.count),
        backgroundColor: COLORS,
        // borderColor: COLORS,
        borderWidth: 1,
      },
    ],
  };
  // console.log(
  //   "RPS : ",
  //   listResponsess?.items?.filter((m) => m?.qu?.type === "LIST")
  // );
  return (
    <div className={classes?.root}>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
      >
        <Tab label="Locations" {...a11yProps(0)} />
        <Tab label="Survey Type" {...a11yProps(1)} />
        <Tab label="Date " {...a11yProps(2)} />
        <Tab label=" Rating" {...a11yProps(3)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <div className={classes?.chartCon}>
          {surveyByLocations?.length < 0 ? (
            <Loader />
          ) : (
            <>
              <BarChart
                data={surveyByLocations}
                title="By Locations"
                xAxisKey="locationName"
                yAxisKey="count"
                onClickingNav={onClickSurveyByLocationNav}
              />
              <div style={{ minHeight: "400px" }}>
                <Doughnut options={options3} data={data} />
              </div>
            </>
          )}
        </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <div className={classes?.chartCon}>
          {surveyByLocations?.length < 0 ? (
            <Loader />
          ) : (
            <>
              <BarChart
                data={surveyByQr}
                title="StoneMor Survey by Qr Responses"
                xAxisKey="surveyName"
                yAxisKey="count"
                onClickingNav={onClickSurveyByQrResponsesNav}
              />
              <BarChart
                data={surveyByLink}
                title="StoneMor Survey by link Responses"
                xAxisKey="surveyName"
                yAxisKey="count"
                onClickingNav={onClickSurveyByLinkResponsesNav}
              />
            </>
          )}
        </div>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <div>
          {surveyByLocations?.length < 0 ? (
            <Loader />
          ) : (
            <div style={{ minHeight: "400px", marginTop: "50px" }}>
              <Line options={options4} data={data3} />{" "}
            </div>
          )}
        </div>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <div className={classes?.chartCon}>
          {surveyByLocations?.length < 0 ? (
            <Loader />
          ) : (
            <>
              <div style={{ minHeight: "400px", marginTop: "50px" }}>
                {" "}
                <div style={{ marginBottom: "20px" }}>
                  <Typography variant="h5">Rating Question</Typography>
                </div>
                <div style={{ margin: "10px 0" }}>
                  <div style={{ margin: "20px 0" }}>
                    <InputLabel> Survey</InputLabel>
                    <Select
                      margin="dense"
                      fullWidth
                      value={ratingSurvey}
                      onChange={(event) => setRatingSurvey(event.target.value)}
                    >
                      {Survey?.map((user, u) => (
                        <MenuItem value={user?.id} key={u}>
                          {user?.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>
                  <div style={{ margin: "20px 0" }}>
                    <InputLabel> Questionnaire</InputLabel>
                    <Select
                      margin="dense"
                      fullWidth
                      value={ratingQuestionnaires}
                      onChange={(event) =>
                        setRatingQuestionnaires(event.target.value)
                      }
                    >
                      {SurveyQuestionarrire?.map((user, u) => (
                        <MenuItem value={user?.preQuestionnaire?.id} key={u}>
                          {user?.preQuestionnaire?.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>
                  <div style={{ margin: "20px 0" }}>
                    <InputLabel>Rating Question</InputLabel>
                    <Select
                      margin="dense"
                      fullWidth
                      value={ratingQuestion}
                      onChange={(event) =>
                        setRatingQuestion(event.target.value)
                      }
                    >
                      {surveyRatingList?.map((user, u) => (
                        <MenuItem value={user?.id} key={u}>
                          {user?.qu}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>
                </div>
                {/* <TextField
                    autoFocus
                    margin="dense"
                    id="title"
                    label="Questionarie"
                    value={questionarie}
                    inputProps={{ readOnly: true }}
                    onChange={(event) => setQuestionarie(event.target.value)}
                    fullWidth
                  /> */}
              </div>

              <BarChart
                data={surveyRatings}
                title={surveyRatings[0]?.question}
                xAxisKey="rating"
                yAxisKey="count"
              />
            </>
          )}
        </div>
      </TabPanel>
    </div>
  );
};

const Analytics = compose(
  graphql(gql(listSurveyEntriess), {
    options: (props) => ({
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
    }),
    props: (props) => {
      return {
        listSurveyEntriess: props ? props : [],
      };
    },
  }),
  graphql(gql(listSurveyUsers), {
    options: (props) => ({
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
    }),
    props: (props) => {
      return {
        listSurveyUsers: props ? props : [],
      };
    },
  }),
  graphql(gql(listSurveys), {
    options: (props) => ({
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
    }),
    props: (props) => {
      return {
        listSurveys: props ? props : [],
      };
    },
  }),
  graphql(gql(listQuestionnaires), {
    options: (props) => ({
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
    }),
    props: (props) => {
      return {
        listQuestionnaires: props ? props : [],
      };
    },
  }),
  graphql(gql(listResponsess), {
    options: (props) => ({
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
      variables: {
        filter: null,
        limit: 300000,
        nextToken: null,
      },
    }),
    props: (props) => {
      return {
        listResponsess: props ? props : [],
      };
    },
  }),
  graphql(gql(listQuestions), {
    options: (props) => ({
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
    }),
    props: (props) => {
      return {
        listQuestions: props ? props : [],
      };
    },
  })
)(AnalyticsPort);

export default Analytics;
