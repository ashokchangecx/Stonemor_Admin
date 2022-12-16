import React, { useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import VisibilityIcon from "@material-ui/icons/Visibility";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import CloseIcon from "@material-ui/icons/Close";
import ArchiveIcon from "@material-ui/icons/Archive";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import { graphql, compose, withApollo } from "react-apollo";
import gql from "graphql-tag";
import { listQuestionnaires, listSurveys } from "../../graphql/queries";
import {
  createQuestionnaire,
  updateSurvey,
  deleteQuestionnaire,
  updateQuestionnaire,
} from "../../graphql/mutations";

import AdminMenu from "./index";
import { Link } from "react-router-dom";
import {
  Box,
  Breadcrumbs,
  InputBase,
  TablePagination,
} from "@material-ui/core";
import moment from "moment";

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
const QuestionnairePart = (props) => {
  const classes = useStyles();
  const {
    data: { loading, error, listQuestionnaires, refetch },
  } = props.listQuestionnaires;

  const {
    data: { listSurveys },
  } = props.listSurveys;
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [survey, setSurvey] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [type] = React.useState("PRE");
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [isopen, setIsOpen] = React.useState(false);
  const [deleteQuestion, setDeleteQuestion] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [isCreated, setIsCreated] = useState(false);
  const [initialLoading, setinitialLoading] = useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [questionnairesId, setQuestionnairesId] = useState("");
  //archived//
  const [archivedQueModelOpen, setArchivedQueModelOpen] = useState(false);
  const [archivedQuestionnaire, setArchivedQuestionnaire] = useState("");

  const [introMsg, setInstroMsg] = useState(
    "Welcome to StoneMor Suvey. Click continue to attend survey."
  );
  const [endMsg, setEndMsg] = useState(
    "Thank you for completing our survey. If you have requested a follow up,someone will be in touch with you soon."
  );

  const questionnaireOrder = listQuestionnaires?.items
    ?.filter((user) => user?.archived !== true)
    ?.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const [search, setSearch] = useState("");
  const [openUpdateQuestionnaires, setOpenUpdateQuestionnaires] =
    useState(false);

  //search//

  const requestSearch = (searched) => {
    setSearch(
      questionnaireOrder.filter((item) =>
        item?.name

          .toString()
          .toLowerCase()
          .includes(searched.toString().toLowerCase())
      )
    );
  };

  //archived questionarie//

  const handleOpenArchivedQuestionnaireDialog = (questionnaire) => {
    setArchivedQuestionnaire(questionnaire?.id);
    setArchivedQueModelOpen(true);
  };
  function handleCloseArchiveQuesDialog() {
    setArchivedQueModelOpen(false);
  }

  const handleArchiveQuestionnaire = (event) => {
    event.preventDefault();
    props.onUpdateQuestionnaire({
      id: archivedQuestionnaire,
      archived: true,
    });
    setIsCreated(true);

    handleCloseArchiveQuesDialog();
  };

  const handleopeningQuestionnaireUpdateDialog = (questionnaire) => {
    setQuestionnairesId(questionnaire?.id);
    setName(questionnaire?.name);
    setDescription(questionnaire?.description);
    setInstroMsg(questionnaire?.introMsg);
    setEndMsg(questionnaire?.endMsg);
    setOpenUpdateQuestionnaires(true);
  };

  const handleClosingQuestionnaireUpdateDialog = () => {
    setName("");
    setDescription("");

    setInstroMsg("");
    setEndMsg("");
    setOpenUpdateQuestionnaires(false);
  };

  const handleUpdateQuestionnaire = (event) => {
    event.preventDefault();
    props.onUpdateQuestionnaire(
      {
        id: questionnairesId,
        name: name,
        description: description,
        introMsg: introMsg,
        endMsg: endMsg,
      },
      survey
    );
    handleClosingQuestionnaireUpdateDialog();

    setIsCreated(true);
  };

  function handleSnackBarClose(event, reason) {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  }
  function handleOpenDialog() {
    setOpen(true);
  }
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  function handleCreate(event) {
    event.preventDefault();
    props.onCreateQuestionnaire(
      {
        name: name,
        description: description,
        type: type,
        introMsg: introMsg,
        endMsg: endMsg,
        archived: false,
      },
      survey
    );
    setOpen(false);
    setIsCreated(true);
  }
  function handleDelete() {
    props.onDeleteQuestionnaire({
      id: deleteQuestion,
    });
    setDeleteQuestion("");
    setIsOpen(false);
    setIsCreated(true);
  }
  const handleOpenDeleteDialog = (questionnaire) => {
    setDeleteQuestion(questionnaire?.id);
    setIsCreated(true);
    setIsOpen(true);
  };
  function handleClose() {
    setOpen(false);
  }
  function handleCloseDialog() {
    setIsOpen(false);
  }
  function onNameChange(newValue) {
    if (name === newValue) {
      setName(newValue);
      return;
    }
    setName(newValue);
  }
  function onDescriptionChange(newValue) {
    if (description === newValue) {
      setDescription(newValue);
      return;
    }
    setDescription(newValue);
  }
  function onSurveyChange(newValue) {
    if (survey === newValue) {
      setSurvey(newValue);
      return;
    }
    setSurvey(newValue);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isCreated) {
        refetch({ limit: 300 });
        setIsCreated(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [isCreated]);

  useEffect(() => {
    if (!loading) setinitialLoading(false);
  }, [loading]);
  if (loading && initialLoading) {
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
      {/* <AdminMenu /> */}
      <div className={classes.Breadcrumbs}>
        <Breadcrumbs aria-label="breadcrumb">
          <Typography color="primary">Manage Questionnaire</Typography>
        </Breadcrumbs>
      </div>
      <div>
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
                Are you want to archive this questionnaire?
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
                onClick={handleArchiveQuestionnaire}
                type="submit"
                color="primary"
                variant="contained"
              >
                Archive
              </Button>
            </DialogActions>
          </FormControl>
        </Dialog>
        <Dialog
          open={openUpdateQuestionnaires}
          onClose={handleClosingQuestionnaireUpdateDialog}
          aria-labelledby="form-dialog-title"
        >
          <FormControl>
            <DialogTitle id="form-dialog-title">Edit Questionnaire</DialogTitle>
            <DialogContent>
              <TextField
                // autoFocus
                margin="dense"
                id="name"
                label="Name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                fullWidth
              />
              <TextField
                margin="dense"
                id="description"
                label="Description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                fullWidth
              />
              <TextField
                margin="dense"
                id="introMsg"
                label="Intro Message"
                value={introMsg}
                onChange={(event) => setInstroMsg(event.target.value)}
                fullWidth
              />
              <TextField
                margin="dense"
                id="endMsg"
                label="Thank You Message"
                value={endMsg}
                onChange={(event) => setEndMsg(event.target.value)}
                fullWidth
              />
              <br />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleClosingQuestionnaireUpdateDialog}
                color="secondary"
                variant="contained"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateQuestionnaire}
                type="submit"
                color="primary"
                variant="contained"
              >
                Update
              </Button>
            </DialogActions>
          </FormControl>
        </Dialog>

        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <FormControl>
            <DialogTitle id="form-dialog-title">
              Create Questionnaire
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                To create a new Questionnaire, please complete the following
                details.
              </DialogContentText>
              <TextField
                // autoFocus
                margin="dense"
                id="name"
                label="Name"
                value={name}
                onChange={(event) => onNameChange(event.target.value)}
                fullWidth
              />
              <TextField
                margin="dense"
                id="description"
                label="Description"
                value={description}
                onChange={(event) => onDescriptionChange(event.target.value)}
                fullWidth
              />
              <TextField
                margin="dense"
                id="introMsg"
                label="Intro Message"
                value={introMsg}
                onChange={(event) => setInstroMsg(event.target.value)}
                fullWidth
              />
              <TextField
                margin="dense"
                id="endMsg"
                label="Thank You Message"
                value={endMsg}
                onChange={(event) => setEndMsg(event.target.value)}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Survey</InputLabel>
                <Select
                  margin="dense"
                  fullWidth
                  value={survey}
                  onChange={(event) => onSurveyChange(event.target.value)}
                >
                  {listSurveys
                    ? listSurveys.items.map((survey, s) => (
                        <MenuItem key={s} value={survey.id}>
                          {survey.name}
                        </MenuItem>
                      ))
                    : null}
                </Select>
              </FormControl>
              <br />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleClose}
                color="secondary"
                variant="contained"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                type="submit"
                color="primary"
                variant="contained"
                disabled={!survey}
              >
                Create
              </Button>
            </DialogActions>
          </FormControl>
        </Dialog>
        <Dialog
          open={isopen}
          onClose={handleCloseDialog}
          aria-labelledby="form-dialog-title"
        >
          <FormControl>
            <DialogTitle id="form-dialog-title">
              Delete this Questionnaire
            </DialogTitle>
            <DialogContent>
              <DialogContentText color="secondary">
                Are You Sure You Want to Delete this Questionnaire?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleCloseDialog}
                color="secondary"
                variant="contained"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  handleDelete();
                }}
                type="submit"
                color="primary"
                variant="contained"
              >
                Delete
              </Button>
            </DialogActions>
          </FormControl>
        </Dialog>
      </div>
      <main className={classes.Breadcrumbs}>
        <Box display="flex">
          <Box flexGrow={1} p={1}>
            {" "}
            <Typography variant="h5">Manage Questionnaires</Typography>
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
        <Paper className={classes.content} elevation={10}>
          <Table className={classes.table}>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>Questionaire</StyledTableCell>
                <StyledTableCell>Description</StyledTableCell>
                {/* <StyledTableCell>Type</StyledTableCell> */}
                <StyledTableCell>Edit Questionaire</StyledTableCell>
                <StyledTableCell>Manage Questions</StyledTableCell>
                <StyledTableCell>Archive</StyledTableCell>
                <StyledTableCell>Delete</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {(search?.length > 0 ? search : questionnaireOrder).map(
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
                        onClick={() =>
                          handleopeningQuestionnaireUpdateDialog(questionnaire)
                        }
                      >
                        <EditIcon />
                      </Button>
                    </StyledTableCell>
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
                          handleOpenArchivedQuestionnaireDialog(questionnaire)
                        }
                        size="small"
                        color="primary"
                      >
                        <ArchiveIcon />
                      </Button>
                    </StyledTableCell>
                    <StyledTableCell>
                      {" "}
                      <Button
                        size="small"
                        color="secondary"
                        onClick={() => handleOpenDeleteDialog(questionnaire)}
                      >
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
            count={questionnaireOrder?.length || search?.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={handleOpenDialog}
          >
            <AddCircleIcon className={classes.rightIcon} /> Add Questionnaire
          </Button>
        </Paper>
      </main>
    </div>
  );
};
const Question = compose(
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
  graphql(gql(deleteQuestionnaire), {
    options: (props) => ({
      errorPolicy: "all",
    }),
    props: (props) => ({
      onDeleteQuestionnaire: (questionnaire) => {
        props.mutate({
          variables: {
            input: questionnaire,
          },
        });
      },
    }),
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
    props: (props) => ({
      onUpdateSurvey: (response) => {
        props
          .mutate({
            variables: {
              input: response,
            },
          })
          .then((data) => {});
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
  }),
  graphql(gql(createQuestionnaire), {
    props: (props) => ({
      onCreateQuestionnaire: (response, survey) => {
        props
          .mutate({
            variables: {
              input: response,
            },
            update: (store, { data: { createQuestionnaire } }) => {
              const query = gql(listQuestionnaires);
              const data = store.readQuery({ query });
              if (data?.listQuestionnaires?.items?.length > 0) {
                data.listQuestionnaires.items = [
                  ...data.listQuestionnaires.items.filter(
                    (item) => item.id !== createQuestionnaire.id
                  ),
                  createQuestionnaire,
                ];
              }
              store.writeQuery({
                query,
                data,
                variables: { filter: null, limit: null, nextToken: null },
              });
            },
          })
          .then((data) => {
            var surveyData = {};
            switch (data.data.createQuestionnaire.type) {
              case "PRE":
                surveyData = {
                  id: survey,
                  surveyPreQuestionnaireId: data.data.createQuestionnaire.id,
                };
                break;
              case "MAIN":
                surveyData = {
                  id: survey,
                  surveyMainQuestionnaireId: data.data.createQuestionnaire.id,
                };
                break;
              case "POST":
                surveyData = {
                  id: survey,
                  surveyPostQuestionnaireId: data.data.createQuestionnaire.id,
                };
                break;
              default:
                break;
            }
            props.ownProps.onUpdateSurvey(surveyData);
          });
      },
    }),
  })
)(QuestionnairePart);
export default withApollo(Question);
