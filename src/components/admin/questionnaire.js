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
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";

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
import { Breadcrumbs, TablePagination } from "@material-ui/core";
import moment from "moment";

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
const QuestionnairePart = (props) => {
  const classes = useStyles();
  const {
    data: { loading, error, listQuestionnaires, refetch },
  } = props.listQuestionnaires;

  console.log("listQuestionnaires", listQuestionnaires);
  const {
    data: { listSurveys },
  } = props.listSurveys;
  console.log("listSurveys", listSurveys);

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
  const [openUpdateQuestionnaires, setOpenUpdateQuestionnaires] =
    useState(false);

  function handleSnackBarClick() {
    setOpenSnackBar(true);
  }
  const questionnaireOrder = listSurveys?.items.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleopeningQuestionnaireUpdateDialog = (questionnaire) => {
    setQuestionnairesId(questionnaire?.id);
    setName(questionnaire?.name);
    setDescription(questionnaire?.description);

    setOpenUpdateQuestionnaires(true);
  };

  const handleClosingQuestionnaireUpdateDialog = () => {
    setName("");
    setDescription("");
    setSurvey("");
    setOpenUpdateQuestionnaires(false);
  };

  const handleUpdateQuestionnaire = (event) => {
    event.preventDefault();
    props.onUpdateQuestionnaire(
      {
        id: questionnairesId,
        name: name,
        description: description,
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
      },
      survey
    );
    setOpen(false);
  }

  function handleDelete() {
    props.onDeleteQuestionnaire({
      id: deleteQuestion,
    });
    setDeleteQuestion("");
    setIsOpen(false);
  }
  const handleOpenDeleteDialog = (que) => {
    setDeleteQuestion(que?.id);
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

  // function onTypeChange(newValue) {
  //   if (type === newValue) {
  //     setType(newValue);
  //     return;
  //   }
  //   setType(newValue);
  // }
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isCreated) {
        refetch({ limit: 300 });
        setIsCreated(false);
      }
    }, 1000);
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
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={openSnackBar}
        autoHideDuration={3000}
        onClose={handleSnackBarClose}
        ContentProps={{
          "aria-describedby": "message-id",
        }}
        message={<span id="message-id">Sorry. Not currently implemented.</span>}
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            className={classes.close}
            onClick={handleSnackBarClose}
          >
            <CloseIcon />
          </IconButton>,
        ]}
      />
      {/* <AdminMenu /> */}
      <div className={classes.root}>
        <Breadcrumbs aria-label="breadcrumb">
          <Typography color="primary">Manage Questionnaire</Typography>
        </Breadcrumbs>
      </div>
      <div>
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

              <br />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleClosingQuestionnaireUpdateDialog}
                color="default"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateQuestionnaire}
                type="submit"
                color="primary"
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
              <FormControl>
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
              {/* <FormControl>
                <InputLabel>Type</InputLabel>
                <Select
                  margin="dense"
                  fullWidth
                  value={type}
                  onChange={(event) => onTypeChange(event.target.value)}
                >
                  <MenuItem value={"PRE"}>PRE</MenuItem>
                  <MenuItem value={"MAIN"}>MAIN</MenuItem>
                  <MenuItem value={"POST"}>POST</MenuItem>
                </Select>
              </FormControl> */}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="default">
                Cancel
              </Button>
              <Button onClick={handleCreate} type="submit" color="primary">
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
              <DialogContentText>
                Are You Sure You Want to Delete this Questionnaire?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="default">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  handleDelete();
                }}
                type="submit"
                color="primary"
              >
                Delete
              </Button>
            </DialogActions>
          </FormControl>
        </Dialog>
      </div>
      <main className={classes.root}>
        <Typography variant="h4">Manage Questionnaires</Typography>
        <p />
        <Paper className={classes.content}>
          <Table className={classes.table}>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>Questionnaire</StyledTableCell>
                <StyledTableCell>Description</StyledTableCell>
                <StyledTableCell>Survey</StyledTableCell>
                <StyledTableCell>Manage</StyledTableCell>
                <StyledTableCell>View</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? questionnaireOrder?.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : questionnaireOrder
              ).map((questionnaire, q) => (
                <StyledTableRow key={q}>
                  <StyledTableCell>
                    {questionnaire?.preQuestionnaire?.name}
                  </StyledTableCell>
                  <StyledTableCell>{questionnaire.description}</StyledTableCell>
                  <StyledTableCell>{questionnaire?.name}</StyledTableCell>
                  <StyledTableCell>
                    {/* <Button
                      size="small"
                      color="primary"
                      onClick={() => handleOpenDeleteDialog(questionnaire)}
                    >
                      <DeleteIcon />
                    </Button> */}
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
                      to={`/admin/question/${questionnaire?.preQuestionnaire?.id}`}
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
            count={listSurveys?.items?.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={handleOpenDialog}
        >
          <AddCircleIcon className={classes.rightIcon} /> Add Questionnaire
        </Button>
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
          .then((data) => {
            //console.log(data)
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
