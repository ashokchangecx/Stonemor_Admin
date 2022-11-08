import React from "react";
import { Link } from "react-router-dom";

import { createStyles, makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";

import { graphql, compose, withApollo } from "react-apollo";
import gql from "graphql-tag";
import { listSurveys } from "../../graphql/queries";
import { Height } from "@material-ui/icons";
import Pagination from "@material-ui/lab/Pagination";
import usePagination from "./Pagination";
import { useState } from "react";
import { Box } from "@material-ui/core";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      overflow: "hidden",
      marginLeft: 120,
      marginTop: 20,
      padding: theme.spacing(0, 3),
    },
    card: {
      maxWidth: 500,
      margin: 30,
    },
    media: {
      // object-fit is not supported by IE 11.
      objectFit: "scale-down",
      marginTop: 20,
    },
    table: {
      minWidth: 700,
    },
    progress: {
      margin: 2,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  })
);

const HomePart = (props) => {
  const classes = useStyles();
  let [page, setPage] = useState(1);
  const {
    data: { loading, error, listSurveys },
  } = props.listSurveys;
  console.log("listSurveys", listSurveys);
  const PER_PAGE = 4;
  const data = listSurveys?.items?.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const count = Math.ceil(data?.length / PER_PAGE);
  const _DATA = usePagination(data, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };
  if (loading) {
    return (
      <div>
        <CircularProgress className={classes.progress} />
      </div>
    );
  }
  if (error) {
    console.log(error);
    return (
      <div>
        <Paper className={classes.root}>
          <Typography variant="h5" component="h3">
            Error
          </Typography>
          <Typography component="p">
            An error occured while fetching data.
          </Typography>
          <Typography component="p">{error}</Typography>
        </Paper>
      </div>
    );
  }
  return (
    <div className={classes.root}>
      <main className={classes.root}>
        <Paper className={classes.content}>
          <Grid container gutter={0}>
            {_DATA
              ?.currentData()
              .map(
                ({
                  id,
                  name,
                  description,
                  image,
                  preQuestionnaire,
                  postQuestionnaire,
                  mainQuestionnaire,
                }) => (
                  <Grid item sm={6} xs={10} key={id}>
                    <Card className={classes.card} elevation={10}>
                      <CardActionArea>
                        <CardMedia
                          component="img"
                          alt={name}
                          className={classes.media}
                          height="100px"
                          image={image}
                          title={name}
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="h2">
                            {name}
                          </Typography>
                          <Typography component="p">{description}</Typography>
                        </CardContent>
                      </CardActionArea>
                      <CardActions>
                        {preQuestionnaire ? (
                          <Button
                            size="small"
                            color="primary"
                            component={Link}
                            to={`/surveyquestions/${preQuestionnaire.id}`}
                          >
                            Preview Survey
                          </Button>
                        ) : null}
                        {mainQuestionnaire ? (
                          <Button
                            size="small"
                            color="primary"
                            component={Link}
                            to={`/surveyquestions/${mainQuestionnaire.id}`}
                          >
                            mainQuestionnaire
                          </Button>
                        ) : null}
                        {/* <Button
                        size="small"
                        color="primary"
                        component={Link}
                        to={`/survey/${id}`}
                      >
                        Survey
                      </Button> */}
                        {postQuestionnaire ? (
                          <Button
                            size="small"
                            color="primary"
                            component={Link}
                            to={`/surveyquestions/${postQuestionnaire.id}`}
                          >
                            Post-Questionnaire
                          </Button>
                        ) : null}
                      </CardActions>
                    </Card>
                  </Grid>
                )
              )}
          </Grid>
          <Box display="flex" justifyContent="end">
            <Pagination
              count={count}
              size="large"
              page={page}
              color="primary"
              variant="outlined"
              shape="rounded"
              onChange={handleChange}
            />
          </Box>
        </Paper>
      </main>
    </div>
  );
};

const Home = compose(
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
  })
)(HomePart);

export default withApollo(Home);
