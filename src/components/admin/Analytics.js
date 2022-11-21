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
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, getElementAtEvent } from "react-chartjs-2";

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
  Title,
  Tooltip,
  Legend
);

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
  const {
    error: surveyEntriessError,
    loading: surveyEntriessLoading,
    listSurveyEntriess,
  } = props?.listSurveyEntriess?.data;

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
  // console.log("surveyByLocations : ", surveyByLocations);

  return (
    <div className={classes?.root}>
      <div className={classes?.chartCon}>
        {surveyByLocations?.length < 0 ? (
          <div>surveyLoading...</div>
        ) : (
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
                      backgroundColor: "rgba(94, 138, 191, 0.9)",
                    },
                  ],
                }}
                onClick={onClick}
              />
            </div>
            <div></div>
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
