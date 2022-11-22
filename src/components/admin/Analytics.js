import React, { useEffect, useRef, useState } from "react";
import gql from "graphql-tag";
import { compose, graphql } from "react-apollo";
import { makeStyles } from "@material-ui/core";
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
} from "chart.js";
import { Bar, getElementAtEvent, Doughnut, Line } from "react-chartjs-2";
import moment from "moment";
import {
  listQuestionnaires,
  listSurveyEntriess,
  listSurveyUsers,
} from "../../graphql/queries";

/* ChartJS registeration*/
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);
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
  colors1.push("#" + ("123123" + color1.toString(16)).slice(-6));
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
  colors3.push("#" + ("123123" + color3.toString(16)).slice(-6));
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
      text: "StoneMor Survey by survey",
    },
  },
  // scales: {
  //   y: {
  //     min: 0, // minimum value
  //     max: 20, // maximum value
  //   },
  // },
  // parsing: {
  //   xAxisKey: "surveyName",
  //   yAxisKey: "count",
  // },
};

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

const AnalyticsPort = (props) => {
  const chartRef = useRef();
  const classes = useStyles();
  const [surveyByLocations, setSurveyByLocations] = useState([]);
  const [surveyByLink, setSurveyByLink] = useState([]);
  const [surveyByQr, setSurveyByQr] = useState([]);
  const [surveyByDate, setSurveyByDate] = useState([]);
  const [surveyBySurveyData, setSurveyBySurveyData] = useState([]);

  const {
    error: surveyEntriessError,
    loading: surveyEntriessLoading,
    listSurveyEntriess,
  } = props?.listSurveyEntriess?.data;
  const { listQuestionnaires } = props?.listQuestionnaires?.data;

  const onGettingQuestionnaireById = (id) => {
    const que = listQuestionnaires?.items?.find((q) => q?.id === id);

    return que?.name ?? id;
  };
  const onClick = (event) => {
    console.log(getElementAtEvent(chartRef.current, event));
  };

  useEffect(() => {
    if (!surveyEntriessLoading) {
      const counts = listSurveyEntriess?.items?.reduce(
        (counts, { location }) => {
          const locationId = location?.id || "no-loc";

          const locationName = location?.location || "No Location";
          const count = (counts[locationId]?.count || 0) + 1;
          const loc = {
            locationId,
            locationName,
            count,
          };
          counts[locationId] = loc;
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
      const counts = listSurveyEntriess?.items.reduce((counts, data) => {
        const date1 =
          onGettingQuestionnaireById(data?.questionnaireId) || "no-Survey";
        const surveyName =
          onGettingQuestionnaireById(data?.questionnaireId) || "No Survey";
        const count = (counts[date1]?.count || 0) + 1;

        const loc = {
          date1,
          surveyName,
          count,
        };
        counts[date1] = loc;
        return counts;
      }, {});

      setSurveyByDate(
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
          const date1 =
            onGettingQuestionnaireById(data?.questionnaireId) || "no-Survey";
          const surveyName =
            onGettingQuestionnaireById(data?.questionnaireId) || "No Survey";
          const count = (counts[date1]?.count || 0) + 1;

          const loc = {
            date1,
            surveyName,
            count,
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
        ?.filter((data) => data?.by?.name)
        .reduce((counts, data) => {
          const date1 =
            onGettingQuestionnaireById(data?.questionnaireId) || "no-Survey";
          const surveyName =
            onGettingQuestionnaireById(data?.questionnaireId) || "No Survey";
          const count = (counts[date1]?.count || 0) + 1;

          const loc = {
            date1,
            surveyName,
            count,
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

  console.log("surveyByDate : ", surveyByDate);

  const data = {
    labels: surveyByDate?.map((d) => d?.date1),
    datasets: [
      {
        label: "#  Survey Count ",
        data: surveyByDate?.map((d) => d?.count),
        backgroundColor: colors,
        borderColor: colors1,
        borderWidth: 1,
      },
    ],
  };
  const data1 = {
    labels: surveyByLink?.map((d) => d?.date1),
    datasets: [
      {
        label: "# Survey Count",
        data: surveyByLink?.map((d) => d?.count),
        backgroundColor: colors2,
        borderColor: colors,
        borderWidth: 1,
      },
    ],
  };
  const data2 = {
    labels: surveyByQr?.map((d) => d?.date1),
    datasets: [
      {
        label: "# Survey Count",
        data: surveyByQr?.map((d) => d?.count),
        backgroundColor: colors3,
        borderColor: colors1,
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
        backgroundColor: colors2,
        borderColor: colors3,
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className={classes?.root}>
      <div className={classes?.chartCon}>
        {surveyByLocations?.length < 0 ? (
          <div>surveyLoading...</div>
        ) : (
          <>
            <>
              <>
                <div style={{ minHeight: "250px" }}>
                  <Bar
                    ref={chartRef}
                    options={options}
                    data={{
                      //   labels: surveyByLocations?.map(
                      //     (loc) => loc?.locationName + " (" + loc?.count + " )"
                      //   ),
                      datasets: [
                        {
                          label: "Survey Count",
                          //   data: surveyByLocations?.map((loc) => loc?.count),
                          data: surveyByLocations,
                          backgroundColor: colors1,
                          borderColor: colors,
                          borderWidth: 1,
                        },
                      ],
                    }}
                    onClick={onClick}
                  />
                </div>
                <div style={{ minHeight: "400px" }}>
                  <Doughnut options={options3} data={data} />{" "}
                </div>
              </>
              <div style={{ minHeight: "400px", marginTop: "50px" }}>
                <Bar options={options1} ref={chartRef} data={data1} />
              </div>
              <div style={{ minHeight: "400px", marginTop: "50px" }}>
                <Bar options={options2} ref={chartRef} data={data2} />
              </div>
            </>
            <div style={{ minHeight: "400px", marginTop: "50px" }}>
              <Line options={options4} data={data3} />{" "}
            </div>
          </>
        )}
      </div>
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
  })
)(AnalyticsPort);

export default Analytics;
