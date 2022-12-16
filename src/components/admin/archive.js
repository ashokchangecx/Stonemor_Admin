/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useRef, useState } from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import ArchiveIcon from "@material-ui/icons/Archive";
import CircularProgress from "@material-ui/core/CircularProgress";
import UnarchiveIcon from "@material-ui/icons/Unarchive";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputBase,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  withStyles,
} from "@material-ui/core";
import { Link } from "react-router-dom";

import SearchIcon from "@material-ui/icons/Search";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  listQuestionnaires,
  listSurveyEntriess,
  listSurveys,
  listSurveyUsers,
} from "../../graphql/queries";
import { graphql, compose, withApollo } from "react-apollo";
import gql from "graphql-tag";

import { useQuery } from "../../helpers/useQuery";
import moment from "moment";
import { updateQuestionnaire, updateSurvey } from "../../graphql/mutations";

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
const archivePort = (props) => {
  const classes = useStyles();
  const query = useQuery();
  const [value, setValue] = useState(0);
  const [isCreated, setIsCreated] = useState(false);
  const [archivedModelOpen, setArchivedModelOpen] = useState(false);
  const [archivedSurvey, setArchivedSurvey] = useState("");
  const [search, setSearch] = useState("");
  const [searchQue, setSearchQue] = useState("");
  //archived questionarie//
  const [archivedQueModelOpen, setArchivedQueModelOpen] = useState(false);
  const [archivedQuestionnaire, setArchivedQuestionnaire] = useState("");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const {
    data: { listQuestionnaires },
  } = props.listQuestionnaires;
  const {
    data: { listSurveys, refetch },
  } = props.listSurveys;

  //unarchive//

  const handleOpenArchivedDialog = (que) => {
    setArchivedSurvey(que?.id);
    setArchivedModelOpen(true);
  };
  function handleCloseArchiveDialog() {
    setArchivedModelOpen(false);
  }

  const handleUnarchiveSurvey = (event) => {
    event.preventDefault();
    props.onUpdateSurvey({
      id: archivedSurvey,
      archived: false,
    });
    setIsCreated(true);

    handleCloseArchiveDialog();
  };

  //unarchived questionarie//

  const handleOpenArchivedQuestionnaireDialog = (questionnaire) => {
    setArchivedQuestionnaire(questionnaire?.id);
    setArchivedQueModelOpen(true);
  };
  function handleCloseArchiveQuesDialog() {
    setArchivedQueModelOpen(false);
  }

  const handleUnarchiveQuestionnaire = (event) => {
    event.preventDefault();
    props.onUpdateQuestionnaire({
      id: archivedQuestionnaire,
      archived: false,
    });
    setIsCreated(true);

    handleCloseArchiveQuesDialog();
  };

  const survey = listSurveys?.items
    ?.filter((survey) => survey?.archived === true)
    ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const questionnaire = listQuestionnaires?.items
    ?.filter((survey) => survey?.archived === true)
    ?.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  console.log("surveyOrder", survey);

  const requestSearchSurvey = (searched) => {
    setSearch(
      survey?.filter(
        (item) =>
          item?.name

            .toString()
            .toLowerCase()
            .includes(searched.toString().toLowerCase()) ||
          item?.preQuestionnaire?.name

            .toString()
            .toLowerCase()
            .includes(searched.toString().toLowerCase())
      )
    );
  };

  //search questionarie//

  const requestSearchQue = (searched) => {
    setSearchQue(
      questionnaire.filter((item) =>
        item?.name

          .toString()
          .toLowerCase()
          .includes(searched.toString().toLowerCase())
      )
    );
  };

  // qr code responses//

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

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isCreated) {
        refetch({ limit: 300 });
        setIsCreated(false);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [isCreated]);

  return (
    <div className={classes?.root}>
      <Dialog
        open={archivedModelOpen}
        onClose={handleCloseArchiveDialog}
        aria-labelledby="form-dialog-title"
      >
        <FormControl>
          <DialogTitle id="form-dialog-title">
            Unarchive this survey
          </DialogTitle>
          <DialogContent>
            <DialogContentText color="primary">
              Are you want to Unarchive this survey?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseArchiveDialog}
              color="secondary"
              variant="contained"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUnarchiveSurvey}
              type="submit"
              color="primary"
              variant="contained"
            >
              Unarchive
            </Button>
          </DialogActions>
        </FormControl>
      </Dialog>

      <Dialog
        open={archivedQueModelOpen}
        onClose={handleCloseArchiveQuesDialog}
        aria-labelledby="form-dialog-title"
      >
        <FormControl>
          <DialogTitle id="form-dialog-title">
            Archive this questionnaire
          </DialogTitle>
          <DialogContent>
            <DialogContentText color="primary">
              Are you want to Unarchive this questionnaire?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseArchiveQuesDialog}
              color="secondary"
              variant="contained"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUnarchiveQuestionnaire}
              type="submit"
              color="primary"
              variant="contained"
            >
              Unarchive
            </Button>
          </DialogActions>
        </FormControl>
      </Dialog>

      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
      >
        <Tab label="Survey" {...a11yProps(0)} />
        <Tab label="Questionnaire" {...a11yProps(1)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        {survey?.length > 0 && (
          <>
            <Box display="flex">
              <Box flexGrow={1} p={1}>
                {" "}
                {/* <Typography variant="h5">Test Survey Response </Typography> */}
              </Box>

              <Box p={0.5}>
                <Paper
                  component="form"
                  className={classes.search}
                  elevation={5}
                >
                  <InputBase
                    className={classes.searchInput}
                    placeholder="Search "
                    inputProps={{ "aria-label": "search google maps" }}
                    onInput={(e) => requestSearchSurvey(e.target.value)}
                  />
                  <IconButton
                    className={classes.iconButton}
                    aria-label="search"
                  >
                    <SearchIcon />
                  </IconButton>
                </Paper>
              </Box>
            </Box>
            <Paper className={classes.content} elevation={10} p={1}>
              <Table className={classes.table}>
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell></StyledTableCell>
                    <StyledTableCell>Survey</StyledTableCell>
                    <StyledTableCell>Description</StyledTableCell>
                    <StyledTableCell>Questionnaire</StyledTableCell>

                    <StyledTableCell>Unarchive</StyledTableCell>
                    <StyledTableCell>Delete</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {(search?.length > 0 ? search : survey).map((survey) => (
                    <StyledTableRow key={survey?.name}>
                      <StyledTableCell>
                        <img
                          src={survey?.image}
                          alt={survey.image}
                          className={classes.image}
                        />
                      </StyledTableCell>
                      <StyledTableCell>{survey?.name}</StyledTableCell>
                      <StyledTableCell>{survey?.description}</StyledTableCell>
                      <StyledTableCell>
                        {survey?.preQuestionnaire?.name}
                      </StyledTableCell>

                      <StyledTableCell>
                        <Button
                          onClick={() => handleOpenArchivedDialog(survey)}
                          size="small"
                          color="primary"
                        >
                          <UnarchiveIcon />
                        </Button>
                      </StyledTableCell>
                      {/* <StyledTableCell>
                        <Button
                          // onClick={() => handleOpenDeleteDialog(survey)}
                          size="small"
                          color="secondary"
                        >
                          <DeleteIcon />
                        </Button>
                      </StyledTableCell> */}
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={search?.length || survey?.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </>
        )}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {questionnaire?.length > 0 && (
          <>
            <Box display="flex">
              <Box flexGrow={1} p={1}>
                {" "}
                {/* <Typography variant="h5">Test Survey Response </Typography> */}
              </Box>

              <Box p={0.5}>
                <Paper
                  component="form"
                  className={classes.search}
                  elevation={5}
                >
                  <InputBase
                    className={classes.searchInput}
                    placeholder="Search "
                    inputProps={{ "aria-label": "search google maps" }}
                    onInput={(e) => requestSearchQue(e.target.value)}
                  />
                  <IconButton
                    className={classes.iconButton}
                    aria-label="search"
                  >
                    <SearchIcon />
                  </IconButton>
                </Paper>
              </Box>
            </Box>
            <Paper className={classes.content} elevation={10}>
              <Table className={classes.table}>
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell>Questionaire</StyledTableCell>
                    <StyledTableCell>Description</StyledTableCell>
                    {/* <StyledTableCell>Type</StyledTableCell> */}

                    <StyledTableCell>Manage Questions</StyledTableCell>
                    <StyledTableCell>Archive</StyledTableCell>
                    <StyledTableCell>Delete</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {(searchQue?.length > 0 ? searchQue : questionnaire).map(
                    (questionnaire, q) => (
                      <StyledTableRow key={q}>
                        <StyledTableCell>{questionnaire.name}</StyledTableCell>
                        <StyledTableCell>
                          {questionnaire.description}
                        </StyledTableCell>
                        {/* <StyledTableCell>{questionnaire.type}</StyledTableCell> */}

                        <StyledTableCell>
                          <Button
                            size="small"
                            color="primary"
                            component={Link}
                            to={`/admin/question/${questionnaire.id}`}
                          >
                            <VisibilityIcon />
                          </Button>
                        </StyledTableCell>
                        <StyledTableCell>
                          <Button
                            onClick={() =>
                              handleOpenArchivedQuestionnaireDialog(
                                questionnaire
                              )
                            }
                            size="small"
                            color="primary"
                          >
                            <ArchiveIcon />
                          </Button>
                        </StyledTableCell>
                        <StyledTableCell>
                          {" "}
                          <Button size="small" color="secondary">
                            <DeleteIcon />
                          </Button>
                        </StyledTableCell>
                      </StyledTableRow>
                    )
                  )}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={questionnaire?.length || searchQue?.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </>
        )}
      </TabPanel>
    </div>
  );
};
const Responses = compose(
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
  graphql(gql(updateSurvey), {
    options: (props) => ({
      errorPolicy: "all",
    }),
    props: (props) => ({
      onUpdateSurvey: (survey) => {
        props.mutate({
          variables: {
            input: survey,
          },
          update: (store, { data: { updateSurvey } }) => {
            const query = gql(listSurveys);
            const data = store.readQuery({
              query,
            });
            data.listSurveys.items = [
              ...data.listSurveys.items.filter(
                (item) => item.id !== updateSurvey.id
              ),
              updateSurvey,
            ];
            store.writeQuery({
              query,
              data,
            });
          },
        });
      },
    }),
  }),
  graphql(gql(updateQuestionnaire), {
    options: (props) => ({
      errorPolicy: "all",
    }),
    props: (props) => ({
      onUpdateQuestionnaire: (questionnaire) => {
        props.mutate({
          variables: {
            input: questionnaire,
          },
          update: (store, { data: { updateQuestionnaire } }) => {
            const query = gql(listQuestionnaires);
            const data = store.readQuery({
              query,
            });
            data.listQuestionnaires.items = [
              ...data.listQuestionnaires.items.filter(
                (item) => item.id !== updateQuestionnaire.id
              ),
              updateQuestionnaire,
            ];
            store.writeQuery({
              query,
              data,
            });
          },
        });
      },
    }),
  })
)(archivePort);
export default Responses;
