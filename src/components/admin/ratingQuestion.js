/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import moment from "moment";
import {
  listSurveyEntriess,
  listQuestionnaires,
  listQuestions,
} from "../../graphql/queries";
import { v4 as uuid } from "uuid";

import VisibilityIcon from "@material-ui/icons/Visibility";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import Button from "@material-ui/core/Button";
import SearchIcon from "@material-ui/icons/Search";
import { graphql, compose, withApollo } from "react-apollo";
import gql from "graphql-tag";
import { listSurveys } from "../../graphql/queries";
import { createSurvey, deleteSurvey, addGroup } from "../../graphql/mutations";
import PollIcon from "@material-ui/icons/Poll";
import AdminMenu from "./index";

import {
  Box,
  Breadcrumbs,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputBase,
  Paper,
  TablePagination,
  Typography,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { A } from "aws-amplify-react/lib-esm/AmplifyTheme";
import { useState } from "react";
import { useQuery } from "../../helpers/useQuery";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    overflow: "hidden",
    marginLeft: 120,
    marginTop: 20,
    padding: theme.spacing(0, 3),
  },
  Breadcrumbs: {
    flexGrow: 1,
    overflow: "hidden",
    marginLeft: 120,
    marginTop: 10,
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
  search: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: 400,
    marginBottom: 10,
  },
  searchInput: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
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
    "&:hover": {
      boxShadow: "3px 2px 5px 2px #888888",
    },
  },
}))(TableRow);

const ratingQuestionPort = (props) => {
  const classes = useStyles();
  const query = useQuery();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const {
    data: { listSurveyEntriess },
  } = props.listSurveyEntriess;

  const {
    data: { listQuestionnaires },
  } = props.listQuestionnaires;
  const {
    data: { listQuestions },
  } = props.listQuestions;
  console.log("listQuestions", listQuestions);

  const questionCount = listQuestions?.items
    ?.filter((m) => m?.type === "LIST")
    ?.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const [search, setSearch] = useState("");

  const requestSearch = (searched) => {
    setSearch(
      questionCount.filter((item) =>
        item?.qu

          .toString()
          .toLowerCase()
          .includes(searched.toString().toLowerCase())
      )
    );
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  // const questionCount = listans?.question?.items.sort(
  //   (a, b) => a?.order - b?.order
  // );

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className={classes.root}>
      {" "}
      {/* <AdminMenu /> */}
      <div className={classes.Breadcrumbs}>
        <Breadcrumbs aria-label="breadcrumb">
          <Typography color="primary">Rating Question</Typography>
        </Breadcrumbs>
      </div>
      <div className={classes.Breadcrumbs}>
        <Box display="flex">
          <Box flexGrow={1} p={1}>
            {" "}
            <Typography variant="h5">Rating Question </Typography>
          </Box>

          <Box p={0.5}>
            <Paper component="form" className={classes.search} elevation={5}>
              <InputBase
                className={classes.searchInput}
                placeholder="Search "
                inputProps={{ "aria-label": "search google maps" }}
                onInput={(e) => requestSearch(e.target.value)}
              />
              <IconButton className={classes.iconButton} aria-label="search">
                <SearchIcon />
              </IconButton>
            </Paper>
          </Box>
        </Box>
        {questionCount?.length > 0 && (
          <Paper className={classes.content} elevation={10}>
            <>
              <Table
                className={classes.table}
                stickyHeader
                aria-label="sticky table"
              >
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell>S.NO</StyledTableCell>
                    <StyledTableCell>Questions</StyledTableCell>

                    <StyledTableCell>Rating</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {(search?.length > 0 ? search : questionCount)
                    ?.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                    .map((user, u) => (
                      <StyledTableRow key={u}>
                        <StyledTableCell>{u + 1}</StyledTableCell>
                        <StyledTableCell>{user?.qu}</StyledTableCell>

                        <StyledTableCell>
                          <Button
                            size="small"
                            color="primary"
                            component={Link}
                            to={`/admin/ratingResponses?Rid=${user?.id}`}
                          >
                            <PollIcon />
                          </Button>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={search?.length || questionCount?.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          </Paper>
        )}
      </div>
    </div>
  );
};
const Responses = compose(
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
)(ratingQuestionPort);

export default Responses;
