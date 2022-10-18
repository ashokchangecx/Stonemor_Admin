import {
  Breadcrumbs,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  withStyles,
} from "@material-ui/core";
import gql from "graphql-tag";
import React, { useEffect, useState } from "react";
import { compose, graphql } from "react-apollo";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import EditIcon from "@material-ui/icons/Edit";
import { listSurveyLocations } from "../../graphql/queries";
import {
  createSurveyLocation,
  updateSurveyLocation,
} from "../../graphql/mutations";
const useStyles = makeStyles((theme) => ({
  root: {
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
const SurveyLocationPart = (props) => {
  const classes = useStyles();
  const { error, loading, listSurveyLocations, refetch } =
    props?.listSurveyLocations?.data;
  const [initialLoading, setinitialLoading] = useState(true);
  const [isCreated, setIsCreated] = useState(false);
  const [openCreateSurveyLocation, setOpenCreateSurveyLocation] =
    useState(false);
  const [openUpdateSurveyLocation, setOpenUpdateSurveyLocation] =
    useState(false);
  const [surveyLocation, setSurveyLocation] = useState("");
  const [inchargeEmail, setInchargeEmail] = useState("");

  const [surveyLocationId, setSurveyLocationId] = useState("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleClosingSurveyLocationDialog = () => {
    setSurveyLocation("");
    setInchargeEmail("");
    setOpenCreateSurveyLocation(false);
  };

  const handleClosingSurveyLocationUpdateDialog = () => {
    setSurveyLocation("");
    setInchargeEmail("");
    setOpenUpdateSurveyLocation(false);
  };

  const handleopeningUpdatesurveyLocationDialog = (surveyLocation) => {
    setSurveyLocationId(surveyLocation?.id);
    setSurveyLocation(surveyLocation?.location);
    setInchargeEmail(surveyLocation?.inchargeEmail);
    setOpenUpdateSurveyLocation(true);
  };

  const handleCreateSurveyLocation = (event) => {
    event.preventDefault();
    props.onCreateSurveyLocation({
      location: surveyLocation,
      inchargeEmail: inchargeEmail,
    });
    handleClosingSurveyLocationDialog();
    setIsCreated(true);
  };

  const handleUpdateSurveyLocation = (event) => {
    event.preventDefault();
    props.onUpdateSurveyLocation({
      id: surveyLocationId,
      location: surveyLocation,
      inchargeEmail: inchargeEmail,
    });
    handleClosingSurveyLocationUpdateDialog();
    setIsCreated(true);
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isCreated) {
        refetch({ limit: 300 });
        setIsCreated(false);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [isCreated]);
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
      {/* <AdminMenu /> */}

      <div className={classes.root}>
        <Breadcrumbs aria-label="breadcrumb">
          <Typography color="primary">SurveyLocation </Typography>
        </Breadcrumbs>
        <p />
        <Typography variant="h4">SurveyLocation </Typography> <p />
        <div>
          <Dialog
            open={openCreateSurveyLocation}
            onClose={handleClosingSurveyLocationDialog}
            aria-labelledby="form-dialog-title"
            fullWidth
          >
            <FormControl fullWidth>
              <DialogTitle id="form-dialog-title">
                Create SurveyLocation
              </DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  id="surveyLocation"
                  label="Location"
                  value={surveyLocation}
                  onChange={(event) => setSurveyLocation(event.target.value)}
                  fullWidth
                />
                <TextField
                  margin="dense"
                  id="InchargeEmail"
                  label="Email"
                  value={inchargeEmail}
                  onChange={(event) => setInchargeEmail(event.target.value)}
                  fullWidth
                />
                <br />
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleClosingSurveyLocationDialog}
                  color="default"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateSurveyLocation}
                  type="submit"
                  color="primary"
                >
                  Create
                </Button>
              </DialogActions>
            </FormControl>
          </Dialog>
          <Dialog
            open={openUpdateSurveyLocation}
            onClose={handleClosingSurveyLocationUpdateDialog}
            aria-labelledby="form-dialog-title"
            fullWidth
          >
            <FormControl fullWidth>
              <DialogTitle id="form-dialog-title">
                Edit SurveyLocation - {surveyLocationId}
              </DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  id="surveyLocation"
                  label="Location"
                  value={surveyLocation}
                  onChange={(event) => setSurveyLocation(event.target.value)}
                  fullWidth
                />
                <TextField
                  margin="dense"
                  id="InchargeEmail"
                  label="Email"
                  value={inchargeEmail}
                  onChange={(event) => setInchargeEmail(event.target.value)}
                  fullWidth
                />
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleClosingSurveyLocationUpdateDialog}
                  color="default"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateSurveyLocation}
                  type="submit"
                  color="primary"
                >
                  Update
                </Button>
              </DialogActions>
            </FormControl>
          </Dialog>
        </div>
      </div>
      <main className={classes.root}>
        <Paper className={classes.content}>
          {listSurveyLocations?.items?.length > 0 && (
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

                  <StyledTableCell>Manage</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? listSurveyLocations?.items?.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : listSurveyLocations
                ).map((surveyLocation, u) => (
                  <StyledTableRow key={u}>
                    <StyledTableCell>{u + 1}</StyledTableCell>
                    <StyledTableCell>
                      {surveyLocation?.location}
                    </StyledTableCell>
                    <StyledTableCell>
                      {surveyLocation?.inchargeEmail}
                    </StyledTableCell>

                    <StyledTableCell>
                      <Button
                        size="small"
                        color="primary"
                        onClick={() =>
                          handleopeningUpdatesurveyLocationDialog(
                            surveyLocation
                          )
                        }
                      >
                        <EditIcon />
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          )}
          <TablePagination
            component="div"
            count={listSurveyLocations?.items?.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => setOpenCreateSurveyLocation(true)}
          >
            <AddCircleIcon className={classes.rightIcon} /> Add SurveyLocation
          </Button>
        </Paper>
      </main>
    </div>
  );
};
const SurveyLocation = compose(
  graphql(gql(listSurveyLocations), {
    options: (props) => ({
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
    }),
    props: (props) => {
      return {
        listSurveyLocations: props ? props : [],
      };
    },
  }),
  graphql(gql(createSurveyLocation), {
    options: (props) => ({
      errorPolicy: "all",
    }),
    props: (props) => ({
      onCreateSurveyLocation: (SurveyLocation) => {
        props.mutate({
          variables: {
            input: SurveyLocation,
          },
          update: (store, { data: { createSurveyLocation } }) => {
            const query = gql(listSurveyLocations);
            const data = store.readQuery({
              query,
            });
            data.listSurveyLocations.items = [
              ...data.listSurveyLocations.items.filter(
                (item) => item.id !== createSurveyLocation.id
              ),
              createSurveyLocation,
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
  graphql(gql(updateSurveyLocation), {
    options: (props) => ({
      errorPolicy: "all",
    }),
    props: (props) => ({
      onUpdateSurveyLocation: (surveyLocation) => {
        props.mutate({
          variables: {
            input: surveyLocation,
          },
          update: (store, { data: { updateSurveyLocation } }) => {
            const query = gql(listSurveyLocations);
            const data = store.readQuery({
              query,
            });
            data.listSurveyLocations.items = [
              ...data.listSurveyLocations.items.filter(
                (item) => item.id !== updateSurveyLocation.id
              ),
              updateSurveyLocation,
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
)(SurveyLocationPart);

export default SurveyLocation;
