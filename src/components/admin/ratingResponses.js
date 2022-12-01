/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import gql from "graphql-tag";
import { compose, graphql } from "react-apollo";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Box, makeStyles, Typography } from "@material-ui/core";
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
} from "../../graphql/queries";
import BarChart from "../analytics/BarChart";
import { useQuery } from "../../helpers/useQuery";

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

const Loader = () => (
  <div>
    <CircularProgress />
  </div>
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

const ratingResponsesPort = (props) => {
  const query = useQuery();
  const classes = useStyles();

  const [surveyRatings, setSurveyRatings] = useState([]);
  console.log("surveyRatings", surveyRatings);

  const { listResponsess, loading: listResponsessLoading } =
    props?.listResponsess?.data;
  const RatingID = query.get("Rid");

  //   console.log(ratingName.find((q) => q?.id === 2));

  const onGettingQuestionnaireById = (id) => {
    const que = ratingName?.find((q) => q?.id === id);

    return ratingName[id]?.name;
  };
  useEffect(() => {
    if (!listResponsessLoading) {
      const counts = listResponsess?.items
        ?.filter((m) => m?.qu?.id === RatingID)
        ?.reduce((counts, { qu, res }) => {
          const rating = onGettingQuestionnaireById(res - 1);
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
  }, [listResponsessLoading]);

  // console.log(
  //   "RPS : ",
  //   listResponsess?.items?.filter((m) => m?.qu?.type === "LIST")
  // );
  return (
    <div className={classes?.root}>
      <div className={classes?.chartCon}>
        {surveyRatings?.length < 0 ? (
          <Loader />
        ) : (
          <div>
            <BarChart
              data={surveyRatings}
              title={surveyRatings[0]?.question}
              xAxisKey="rating"
              yAxisKey="count"
            />
          </div>
        )}
      </div>
    </div>
  );
};

const RatingAnalytics = compose(
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
  }),
  graphql(gql(listResponsess), {
    options: (props) => ({
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
      variables: {
        filter: null,
        limit: 30000,
        nextToken: null,
      },
    }),
    props: (props) => {
      return {
        listResponsess: props ? props : [],
      };
    },
  })
)(ratingResponsesPort);

export default RatingAnalytics;
