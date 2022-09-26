import React, { useEffect, useState } from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import EditIcon from "@material-ui/icons/Edit";
import { graphql, compose, withApollo } from "react-apollo";
import gql from "graphql-tag";
import AdminMenu from "./index";
import { listSurveyUsers } from "../../graphql/queries";
import { createSurveyUser, updateSurveyUser } from "../../graphql/mutations";
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
    }, 1500);
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
      <AdminMenu />
      <div className={classes.root}>
        <Typography color="primary" variant="h6">
          Survey Users
        </Typography>
        <Divider />
        <div>
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
                  onClick={handleClosingSurveyUsersDialog}
                  color="default"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateSurveyUser}
                  type="submit"
                  color="primary"
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
              <DialogTitle id="form-dialog-title">
                Edit SurveyUser - {currentUserId}
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
                  color="default"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateSurveyUser}
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
      <div className={classes.root}>
        {listSurveyUsers?.items?.length > 0 && (
          <Table
            className={classes.table}
            stickyHeader
            aria-label="sticky table"
          >
            <TableHead>
              <TableRow>
                <TableCell>S.NO</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Manage</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listSurveyUsers?.items?.map((user, u) => (
                <TableRow key={u}>
                  <TableCell>{u + 1}</TableCell>
                  <TableCell>{user?.name}</TableCell>
                  <TableCell>{user?.email}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => handleopeninguypdatesurveyUserDialog(user)}
                    >
                      <EditIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={() => setOpenCreateSurveyUser(true)}
        >
          <AddCircleIcon className={classes.rightIcon} /> Add SurveyUser
        </Button>
      </div>
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
