import React, { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
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
import SubjectIcon from "@material-ui/icons/Subject";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import CircularProgress from "@material-ui/core/CircularProgress";
import CloseIcon from "@material-ui/icons/Close";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import { graphql, compose, withApollo } from "react-apollo";
import gql from "graphql-tag";
import moment from "moment";
import { listSurveys } from "../../graphql/queries";
import {
  createSurvey,
  deleteSurvey,
  addGroup,
  updateSurvey,
} from "../../graphql/mutations";

import AdminMenu from "./index";
import { Breadcrumbs, Link, TablePagination } from "@material-ui/core";
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
const SurveyPart = (props) => {
  const classes = useStyles();
  const {
    data: { loading, error, listSurveys, refetch },
  } = props.listSurveys;
  console.log("listSurveys", listSurveys);
  const [open, setOpen] = React.useState(false);
  const [initialLoading, setinitialLoading] = useState(true);
  const [isCreated, setIsCreated] = useState(false);
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [groupName] = React.useState("StoneMor");
  const [isopen, setIsOpen] = React.useState(false);
  const [deleteSurvey, setDeleteSurvey] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [image, setImage] = React.useState(
    "https://dynamix-cdn.s3.amazonaws.com/stonemorcom/stonemorcom_616045937.svg"
  );
  const [surveyId, setSurveyId] = useState("");

  const [openUpdateSurvey, setOpenUpdateSurvey] = useState(false);

  function handleSnackBarClick() {
    setOpenSnackBar(true);
  }

  const surveyOrder = listSurveys?.items?.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  function handleSnackBarClose(event, reason) {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  }
  function handleOpenDialog() {
    setOpen(true);
  }
  function handleCreate(event) {
    event.preventDefault();
    props.onCreateSurvey({
      name: title,
      description: description,
      image: image,
      groups: groupName,
    });
    setIsCreated(true);
    setOpen(false);
    props.onAddGroup(groupName, props.location.state.userPoolId);
  }

  const handleClosingSurveyUpdateDialog = () => {
    setImage("");
    setTitle("");
    setDescription("");
    setOpenUpdateSurvey(false);
  };
  const handleUpdateSurvey = (event) => {
    event.preventDefault();
    props.onUpdateSurvey({
      id: surveyId,
      name: title,
      description: description,
      image: image,
    });
    handleClosingSurveyUpdateDialog();
  };
  const handleopeningUpdatesurveyDialog = (survey) => {
    setSurveyId(survey?.id);
    setTitle(survey?.name);
    setDescription(survey?.description);
    setImage(survey?.image);
    setOpenUpdateSurvey(true);
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

  function handleBulkImport(event) {
    event.preventDefault();
    props.onBulkImport();
  }

  function handleDelete() {
    props.onDeleteSurvey({
      id: deleteSurvey,
    });
    setDeleteSurvey("");
    setIsCreated(true);
    setIsOpen(false);
  }
  const handleOpenDeleteDialog = (que) => {
    setDeleteSurvey(que?.id);
    setIsOpen(true);
  };
  function handleCloseDialog() {
    setIsOpen(false);
  }
  function handleClose() {
    setOpen(false);
  }
  function onTitleChange(newValue) {
    if (title === newValue) {
      setTitle(newValue);
      return;
    }
    setTitle(newValue);
  }
  // function onGroupNameChange(newValue) {
  //   if (groupName === newValue) {
  //     setGroupName(newValue);
  //     return;
  //   }
  //   setGroupName(newValue);
  // }
  function onDescriptionChange(newValue) {
    if (title === newValue) {
      setDescription(newValue);
      return;
    }
    setDescription(newValue);
  }
  function onImageChange(newValue) {
    if (title === newValue) {
      setImage(newValue);
      return;
    }
    setImage(newValue);
  }
  useEffect(() => {
    if (!loading) setinitialLoading(false);
  }, [loading]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
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
      {/* <div className={classes.root}>
        <Breadcrumbs aria-label="breadcrumb">
          <Typography color="primary">Manage Survey</Typography>
        </Breadcrumbs>
      </div> */}
      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <FormControl>
            <DialogTitle id="form-dialog-title">Create Survey</DialogTitle>
            <DialogContent>
              <DialogContentText>
                To create a new Survey, please complete the following details.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="title"
                label="Title"
                value={title}
                onChange={(event) => onTitleChange(event.target.value)}
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
                id="image"
                label="Image URL"
                value={image}
                onChange={(event) => onImageChange(event.target.value)}
                fullWidth
              />
              {/* <TextField
                margin="dense"
                id="groupname"
                label="Security Group Name"
                value={groupName}
                onChange={(event) => onGroupNameChange(event.target.value)}
                fullWidth
              /> */}
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
            <DialogTitle id="form-dialog-title">Delete this Survey</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are You Sure You Want to Delete this Survey?
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

        {/* edit survey   */}

        <Dialog
          open={openUpdateSurvey}
          onClose={handleClosingSurveyUpdateDialog}
          aria-labelledby="form-dialog-title"
          fullWidth
        >
          <FormControl fullWidth>
            <DialogTitle id="form-dialog-title">Edit Survey</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                id="title"
                label="Title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                fullWidth
              />
              <TextField
                autoFocus
                margin="dense"
                id="description"
                label="Description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                fullWidth
              />
              <TextField
                margin="dense"
                id="image"
                label="Image URL (enter your own or use the random generated image)"
                value={image}
                onChange={(event) => setImage(event.target.value)}
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClosingSurveyUpdateDialog} color="default">
                Cancel
              </Button>
              <Button
                onClick={handleUpdateSurvey}
                type="submit"
                color="primary"
              >
                Update
              </Button>
            </DialogActions>
          </FormControl>
        </Dialog>
      </div>
      <main className={classes.root}>
        <Typography variant="h4">Manage Surveys</Typography>
        <p />
        <Paper className={classes.content}>
          <Table className={classes.table}>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell>Survey</StyledTableCell>
                <StyledTableCell>Description</StyledTableCell>
                <StyledTableCell>Questionnaire</StyledTableCell>
                <StyledTableCell>Manage</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? surveyOrder?.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : surveyOrder
              ).map((survey) => (
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
                      onClick={() => handleopeningUpdatesurveyDialog(survey)}
                      size="small"
                      color="primary"
                    >
                      <EditIcon />
                    </Button>
                    <Button
                      onClick={() => handleOpenDeleteDialog(survey)}
                      size="small"
                      color="primary"
                    >
                      <DeleteIcon />
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
          <AddCircleIcon className={classes.rightIcon} /> Add Survey
        </Button>
        {/* <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={handleBulkImport}
        >
          <SubjectIcon className={classes.rightIcon} /> Import Sample Survey
        </Button> */}
      </main>
    </div>
  );
};
const Survey = compose(
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
  graphql(gql(createSurvey), {
    options: (props) => ({
      errorPolicy: "all",
    }),
    props: (props) => ({
      onCreateSurvey: (survey) => {
        props.mutate({
          variables: {
            input: survey,
          },
          update: (store, { data: { createSurvey } }) => {
            const query = gql(listSurveys);
            const data = store.readQuery({
              query,
            });
            data.listSurveys.items = [
              ...data.listSurveys.items.filter(
                (item) => item.id !== createSurvey.id
              ),
              createSurvey,
            ];
            store.writeQuery({
              query,
              data,
              variables: { filter: null, limit: null, nextToken: null },
            });
          },
        });
      },
    }),
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
              ...data.listSurveyLocations.items.filter(
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
  graphql(gql(deleteSurvey), {
    options: (props) => ({
      errorPolicy: "all",
    }),
    props: (props) => ({
      onDeleteSurvey: (survey) => {
        props.mutate({
          variables: {
            input: survey,
          },
        });
      },
    }),
  }),
  graphql(gql(addGroup), {
    options: (props) => ({
      errorPolicy: "all",
    }),
    props: (props) => ({
      onAddGroup: (GroupName, userPoolId) => {
        props.mutate({
          variables: {
            UserPoolId: userPoolId,
            GroupName: GroupName,
          },
        });
      },
    }),
  })
)(SurveyPart);
export default withApollo(Survey);
