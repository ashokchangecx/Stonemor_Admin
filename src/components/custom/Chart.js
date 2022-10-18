import { Breadcrumbs, Paper, Typography } from "@material-ui/core";
import React from "react";
import ReactDOM from "react-dom";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from "victory";
import {
  getResponses,
  listQuestionnaires,
  listQuestions,
  listResponsess,
  listSurveyEntriess,
} from "../../graphql/queries";
import { graphql, compose, withApollo } from "react-apollo";
import gql from "graphql-tag";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    overflow: "hidden",
    marginLeft: 120,
    marginTop: 20,
    padding: theme.spacing(0, 3),
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  image: {
    width: 64,
  },
  button: {
    margin: theme.spacing(1),
    marginTop: 20,
  },
  // container: {
  //   maxHeight: 2000,
  // },
}));
const data = [
  { quarter: 1, earnings: 13000 },
  { quarter: 2, earnings: 16500 },
  { quarter: 3, earnings: 14250 },
  { quarter: 4, earnings: 19000 },
];

const ChartPart = (props) => {
  const classes = useStyles();

  const {
    data: { listSurveyEntriess },
  } = props.listSurveyEntriess;

  const responseDate = listSurveyEntriess?.items;
  console.log("responseDate", responseDate);
  return (
    <>
      <div className={classes.root}>
        <div className={classes.root}>
          <Breadcrumbs aria-label="breadcrumb">
            <Typography color="primary">Chart</Typography>
          </Breadcrumbs>
        </div>
        <main className={classes.root}>
          <Typography variant="h4">Chart</Typography>
          <p />
          <Paper className={classes.content}>
            <VictoryChart domainPadding={20} theme={VictoryTheme.material}>
              <VictoryAxis
                // tickValues specifies both the number of ticks and where
                // they are placed on the axis

                tickValues={[1, 2, 3, 4]}
                tickFormat={[
                  "Quarter 1",
                  "Quarter 2",
                  "Quarter 3",
                  "Quarter 4",
                ]}
              />

              <VictoryAxis
                dependentAxis
                // tickFormat specifies how ticks should be displayed
                tickFormat={(x) => `$${x / 1000}k`}
              />
              <VictoryBar
                data={data}
                // data accessor for x values
                x="quarter"
                // data accessor for y values
                y="earnings"
              />
            </VictoryChart>
          </Paper>
        </main>
      </div>
    </>
  );
};
const surveyResponses = compose(
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
  })
)(ChartPart);

export default surveyResponses;
