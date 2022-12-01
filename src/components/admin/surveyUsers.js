import React, { useEffect, useState } from "react";
import {
  Box,
  Breadcrumbs,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputBase,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import EditIcon from "@material-ui/icons/Edit";
import SearchIcon from "@material-ui/icons/Search";
import { graphql, compose, withApollo } from "react-apollo";
import { withStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import gql from "graphql-tag";
import AdminMenu from "./index";
import { listSurveyUsers } from "../../graphql/queries";
import {
  createSurveyUser,
  deleteSurveyUser,
  updateSurveyUser,
} from "../../graphql/mutations";
import { Link } from "react-router-dom";
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
    "&:hover": {
      boxShadow: "3px 2px 5px 2px #888888",
    },
  },
}))(TableRow);
const SurveyUsersPart = (props) => {
  const classes = useStyles();
  const { error, loading, listSurveyUsers, refetch } =
    props?.listSurveyUsers?.data;
  const [initialLoading, setinitialLoading] = useState(true);
  const [isCreated, setIsCreated] = useState(false);
  const [openCreateSurveyUser, setOpenCreateSurveyUser] = useState(false);
  const [openUpdateSurveyUser, setOpenUpdateSurveyUser] = useState(false);
  const [userName, setUserName] = useState("");
  const [userMail, setUserMail] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const [isopen, setIsOpen] = React.useState(false);
  const [deleteSurveyUser, setDeleteSurveyUser] = useState("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const surveyUserOrder = listSurveyUsers?.items
    ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  const [search, setSearch] = useState("");

  const requestSearch = (searched) => {
    setSearch(
      surveyUserOrder.filter(
        (item) =>
          item?.name

            .toString()
            .toLowerCase()
            .includes(searched.toString().toLowerCase()) ||
          item?.email

            .toString()
            .toLowerCase()
            .includes(searched.toString().toLowerCase())
      )
    );
  };

  const handleClosingSurveyUsersDialog = () => {
    setUserName("");
    setUserMail("");
    setOpenCreateSurveyUser(false);
  };

  const handleClosingSurveyUsersUpdateDialog = () => {
    setUserName("");
    setUserMail("");
    setOpenUpdateSurveyUser(false);
  };

  function handleDelete() {
    props.onDeleteSurveyUser({
      id: deleteSurveyUser,
    });
    setDeleteSurveyUser("");
    setIsCreated(true);
    setIsOpen(false);
  }
  const handleOpenDeleteDialog = (user) => {
    setDeleteSurveyUser(user?.id);
    setIsOpen(true);
  };
  function handleCloseDialog() {
    setIsOpen(false);
  }
  const handleopeninguypdatesurveyUserDialog = (user) => {
    setCurrentUserId(user?.id);
    setUserName(user?.name);
    setUserMail(user?.email);
    setOpenUpdateSurveyUser(true);
  };

  const handleCreateSurveyUser = (event) => {
    event.preventDefault();
    props.onCreateSurveyUser({
      name: userName,
      email: userMail,
    });
    handleClosingSurveyUsersDialog();
    setIsCreated(true);
  };

  const handleUpdateSurveyUser = (event) => {
    event.preventDefault();
    props.onUpdateSurveyUser({
      id: currentUserId,
      email: userMail,
      name: userName,
    });
    handleClosingSurveyUsersUpdateDialog();
    setIsCreated(true);
  };
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
      <div className={classes.Breadcrumbs}>
        <Breadcrumbs aria-label="breadcrumb">
          <Typography color="primary">Survey Users</Typography>
        </Breadcrumbs>
      </div>
      <main className={classes.Breadcrumbs}>
        <Box display="flex">
          <Box flexGrow={1} p={1}>
            {" "}
            <Typography variant="h5">Manage Surveys</Typography>
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

        <div>
          <Dialog
            open={isopen}
            onClose={handleCloseDialog}
            aria-labelledby="form-dialog-title"
          >
            <FormControl>
              <DialogTitle id="form-dialog-title">
                Delete this SurveyUser
              </DialogTitle>
              <DialogContent>
                <DialogContentText color="secondary">
                  Are You Sure You Want to Delete this SurveyUser?
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
          <Dialog
            open={openCreateSurveyUser}
            onClose={handleClosingSurveyUsersDialog}
            aria-labelledby="form-dialog-title"
            fullWidth
          >
            <FormControl fullWidth>
              <DialogTitle id="form-dialog-title">
                Create SurveyUser
              </DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  label="User name"
                  value={userName}
                  onChange={(event) => setUserName(event.target.value)}
                  fullWidth
                />
                <br />
                <TextField
                  margin="dense"
                  id="email"
                  label="Email"
                  value={userMail}
                  onChange={(event) => setUserMail(event.target.value)}
                  fullWidth
                />
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleClosingSurveyUsersDialog}
                  color="secondary"
                  variant="contained"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateSurveyUser}
                  type="submit"
                  color="primary"
                  variant="contained"
                  disabled={!userMail}
                >
                  Create
                </Button>
              </DialogActions>
            </FormControl>
          </Dialog>
          <Dialog
            open={openUpdateSurveyUser}
            onClose={handleClosingSurveyUsersUpdateDialog}
            aria-labelledby="form-dialog-title"
            fullWidth
          >
            <FormControl fullWidth>
              <DialogTitle id="form-dialog-title">Edit SurveyUser</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  label="User name"
                  value={userName}
                  onChange={(event) => setUserName(event.target.value)}
                  fullWidth
                />
                <br />
                <TextField
                  autoFocus
                  margin="dense"
                  id="email"
                  label="Email"
                  value={userMail}
                  onChange={(event) => setUserMail(event.target.value)}
                  fullWidth
                />
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleClosingSurveyUsersUpdateDialog}
                  color="secondary"
                  variant="contained"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateSurveyUser}
                  type="submit"
                  color="primary"
                  variant="contained"
                  disabled={!userMail}
                >
                  Update
                </Button>
              </DialogActions>
            </FormControl>
          </Dialog>
        </div>
        <Paper className={classes.content} elevation={10}>
          {listSurveyUsers?.items?.length > 0 && (
            <Table
              className={classes.table}
              stickyHeader
              aria-label="sticky table"
            >
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>S.NO</StyledTableCell>
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell>Email</StyledTableCell>
                  <StyledTableCell>Manage </StyledTableCell>
                  <StyledTableCell>Delete </StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {(search?.length > 0 ? search : surveyUserOrder).map(
                  (user, u) => (
                    <StyledTableRow key={u}>
                      <StyledTableCell>{u + 1}</StyledTableCell>
                      <StyledTableCell>{user?.name}</StyledTableCell>
                      <StyledTableCell>{user?.email}</StyledTableCell>
                      <StyledTableCell>
                        <Button
                          size="small"
                          color="primary"
                          onClick={() =>
                            handleopeninguypdatesurveyUserDialog(user)
                          }
                        >
                          <EditIcon />
                        </Button>
                      </StyledTableCell>
                      <StyledTableCell>
                        {" "}
                        <Button
                          onClick={() => handleOpenDeleteDialog(user)}
                          size="small"
                          color="secondary"
                        >
                          <DeleteIcon />
                        </Button>
                      </StyledTableCell>
                    </StyledTableRow>
                  )
                )}
              </TableBody>
            </Table>
          )}
          <TablePagination
            component="div"
            count={search?.length || surveyUserOrder?.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => setOpenCreateSurveyUser(true)}
          >
            <AddCircleIcon className={classes.rightIcon} /> Add SurveyUser
          </Button>
        </Paper>
      </main>
    </div>
  );
};
const SurveyUsers = compose(
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
  graphql(gql(createSurveyUser), {
    options: (props) => ({
      errorPolicy: "all",
    }),
    props: (props) => ({
      onCreateSurveyUser: (surveyUser) => {
        props.mutate({
          variables: {
            input: surveyUser,
          },
          update: (store, { data: { createSurveyUser } }) => {
            const query = gql(listSurveyUsers);
            const data = store.readQuery({
              query,
            });
            data.listSurveyUsers.items = [
              ...data.listSurveyUsers.items.filter(
                (item) => item.id !== createSurveyUser.id
              ),
              createSurveyUser,
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
  graphql(gql(deleteSurveyUser), {
    options: (props) => ({
      errorPolicy: "all",
    }),
    props: (props) => ({
      onDeleteSurveyUser: (surveyUser) => {
        props.mutate({
          variables: {
            input: surveyUser,
          },
        });
      },
    }),
  }),
  graphql(gql(updateSurveyUser), {
    options: (props) => ({
      errorPolicy: "all",
    }),
    props: (props) => ({
      onUpdateSurveyUser: (surveyUser) => {
        props.mutate({
          variables: {
            input: surveyUser,
          },
          update: (store, { data: { updateSurveyUser } }) => {
            const query = gql(listSurveyUsers);
            const data = store.readQuery({
              query,
            });
            data.listSurveyUsers.items = [
              ...data.listSurveyUsers.items.filter(
                (item) => item.id !== updateSurveyUser.id
              ),
              updateSurveyUser,
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
)(SurveyUsersPart);

export default SurveyUsers;
