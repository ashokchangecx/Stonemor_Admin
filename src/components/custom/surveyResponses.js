/* eslint-disable no-undef */
/* eslint-disable react-hooks/rules-of-hooks */
import {
  Breadcrumbs,
  Button,
  Link,
  makeStyles,
  withStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import AdminMenu from "../admin/index";
import { graphql, compose, withApollo } from "react-apollo";
import gql from "graphql-tag";
import {
  getResponses,
  listQuestionnaires,
  listQuestions,
  listResponsess,
  listSurveyEntriess,
} from "../../graphql/queries";
import { v4 as uuid } from "uuid";
import { NavLink } from "react-router-dom";

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
const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontSize: 14,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);
const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(even)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);
const surveyResponsesPart = (props) => {
  const classes = useStyles();

  const {
    data: { listResponsess },
  } = props.listResponsess;

  const qid = props.match.params.responseID;

  const {
    data: { listSurveyEntriess },
  } = props.listSurveyEntriess;

  const {
    data: { listQuestions },
  } = props.listQuestions;
  const {
    data: { listQuestionnaires },
  } = props.listQuestionnaires;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const listUserRes = listSurveyEntriess?.items?.filter((r) => r?.id === qid);
  const listans = listUserRes?.[0]?.responses;

  const questionnairename = listUserRes?.[0]?.questionnaireId;

  const onGettingQuestionnaireById = (id) => {
    const que = listQuestionnaires?.items?.find((q) => q?.id === id);

    return que?.name ?? id;
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  // const questionCount = listans?.question?.items.sort(
  //   (a, b) => a?.order - b?.order
  // );
  const questionCount = listans?.items?.sort(
    (a, b) => a?.qu?.order - b?.qu?.order
  );

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  return (
    <div className={classes.root}>
      <AdminMenu />
      <div className={classes.root}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/admin/responses">
            Responses
          </Link>
          <Link underline="hover" color="inherit" href="#">
            {onGettingQuestionnaireById(questionnairename)}
          </Link>
        </Breadcrumbs>
      </div>

      <main className={classes.root}>
        <Typography variant="h5">
          {" "}
          {onGettingQuestionnaireById(questionnairename)}
        </Typography>
        <p />
        <Paper className={classes.content}>
          <Table
            className={classes.table}
            stickyHeader
            aria-label="sticky table"
          >
            <TableHead>
              <StyledTableRow>
                <StyledTableCell> Q.No </StyledTableCell>
                <StyledTableCell>Question</StyledTableCell>
                <StyledTableCell>Answer</StyledTableCell>
                {/* <StyledTableCell>Manage</StyledTableCell> */}
              </StyledTableRow>
            </TableHead>

            <TableBody>
              {/* {listans?.items?.map((res, r) => ( */}
              {(rowsPerPage > 0
                ? questionCount?.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : questionCount
              )?.map((res, r) => (
                <StyledTableRow key={r}>
                  <StyledTableCell>{res?.qu?.order}</StyledTableCell>
                  <StyledTableCell>{res?.qu?.qu}</StyledTableCell>
                  <StyledTableCell>{res?.res}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={questionCount?.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </main>
    </div>
  );
};

const surveyResponses = compose(
  graphql(gql(getResponses), {
    options: (props) => ({
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
      // variables: { id: props.match.params.responseID },
    }),
    props: (props) => {
      return {
        getResponses: props ? props : [],
      };
    },
  }),
  graphql(gql(listResponsess), {
    options: (props) => ({
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
      variables: { id: props.match.params.responseID },
    }),
    props: (props) => {
      return {
        listResponsess: props ? props : [],
      };
    },
  }),
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
)(surveyResponsesPart);

export default withApollo(surveyResponses);
