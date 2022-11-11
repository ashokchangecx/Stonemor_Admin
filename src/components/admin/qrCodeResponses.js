/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import moment from "moment";
import {
  listSurveyEntriess,
  listResponsess,
  listSurveyUsers,
  listQuestionnaires,
} from "../../graphql/queries";
import { v4 as uuid } from "uuid";

import VisibilityIcon from "@material-ui/icons/Visibility";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import Button from "@material-ui/core/Button";

import { graphql, compose } from "react-apollo";
import gql from "graphql-tag";

import {
  Breadcrumbs,
  Paper,
  TablePagination,
  Typography,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { A } from "aws-amplify-react/lib-esm/AmplifyTheme";
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

const qrCodeResponsesPort = (props) => {
  const classes = useStyles();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const {
    data: { listResponsess },
  } = props.listResponsess;

  const {
    data: { listSurveyEntriess },
  } = props.listSurveyEntriess;
  console.log("listSurveyEntriess", listSurveyEntriess);

  const {
    data: { listSurveyUsers },
  } = props.listSurveyUsers;
  const {
    data: { listQuestionnaires },
  } = props.listQuestionnaires;
  // console.log("listQuestionnaires", listQuestionnaires);

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
  const questionCount = listSurveyEntriess?.items
    ?.filter((user) => user?.location?.location)
    ?.sort(
      (a, b) =>
        new Date(b.finishTime).getTime() - new Date(a.finishTime).getTime()
    );
  console.log("questionCount", questionCount);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className={classes.root}>
      {" "}
      {/* <AdminMenu /> */}
      <div className={classes.root}>
        <Breadcrumbs aria-label="breadcrumb">
          <Typography color="primary">QR Code Response</Typography>
        </Breadcrumbs>
      </div>
      <div className={classes.root}>
        <Typography variant="h4">QR Code Response </Typography> <p />
        {questionCount.length > 0 && (
          <Paper className={classes.content} elevation={10}>
            <Table
              className={classes.table}
              stickyHeader
              aria-label="sticky table"
            >
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>S.NO</StyledTableCell>

                  <StyledTableCell>Location</StyledTableCell>
                  <StyledTableCell>Email</StyledTableCell>
                  <StyledTableCell>Questionnaire</StyledTableCell>
                  <StyledTableCell>Start Time</StyledTableCell>
                  <StyledTableCell>Finish Time</StyledTableCell>
                  <StyledTableCell>Manage</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? questionCount?.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : questionCount
                ).map((user, u) => (
                  <StyledTableRow key={u}>
                    <StyledTableCell>{u + 1}</StyledTableCell>

                    <StyledTableCell>
                      {user?.location?.location}
                    </StyledTableCell>
                    <StyledTableCell>
                      {user?.location?.inchargeEmail}
                    </StyledTableCell>
                    <StyledTableCell>
                      {" "}
                      {onGettingQuestionnaireById(user?.questionnaireId)}
                    </StyledTableCell>

                    <StyledTableCell>
                      {moment(user?.startTime).format("DD-MM-YYYY hh:mm A")}
                    </StyledTableCell>
                    <StyledTableCell>
                      {moment(user?.finishTime).format("DD-MM-YYYY hh:mm A")}
                    </StyledTableCell>
                    <StyledTableCell>
                      <Button
                        size="small"
                        color="primary"
                        component={Link}
                        // to={`/surveyResponses/${user?.questionnaireId}?uid=${user?.by?.id}`}
                        to={`/surveyResponses/${user?.id}`}
                        // onClick={handleOpenDialog}
                      >
                        <VisibilityIcon />
                      </Button>
                    </StyledTableCell>
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
        )}
      </div>
    </div>
  );
};
const QrResponses = compose(
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
)(qrCodeResponsesPort);

export default QrResponses;
