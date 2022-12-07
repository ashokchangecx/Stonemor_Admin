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
import validator from "validator";
import FileCopyIcon from "@material-ui/icons/FileCopy";
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
import LinkIcon from "@material-ui/icons/Link";
import SelectAllIcon from "@material-ui/icons/SelectAll";
import IconButton from "@material-ui/core/IconButton";
import { graphql, compose, withApollo } from "react-apollo";
import gql from "graphql-tag";
import QRCode from "qrcode.react";
import copy from "copy-to-clipboard";
import ShareIcon from "@material-ui/icons/Share";

import SearchIcon from "@material-ui/icons/Search";
import {
  getQuestionnaire,
  listQuestionnaires,
  listSurveyLocations,
  listSurveys,
  listSurveyUsers,
} from "../../graphql/queries";
import {
  createSurvey,
  deleteSurvey,
  addGroup,
  updateSurvey,
} from "../../graphql/mutations";

import AdminMenu from "./index";
import {
  Box,
  Breadcrumbs,
  InputBase,
  InputLabel,
  Link,
  MenuItem,
  Select,
  TablePagination,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import axios from "axios";
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
  customizedButtion: {
    position: "absolute",
    left: "93%",
    top: "2%",
    backgroundColor: "#fbf9f9",
    color: "gray",
  },
  customizedButtion1: {
    position: "absolute",
    left: "90%",
    top: "6%",
    backgroundColor: "#fbf9f9",
    color: "gray",
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

const baseUrl = "https://main.d3d8mcg1fsym22.amplifyapp.com";
const baseUrlTest = "https://main.d3d8mcg1fsym22.amplifyapp.com";
const SurveyPart = (props) => {
  const classes = useStyles();
  const {
    data: { loading, error, listSurveys, refetch },
  } = props.listSurveys;

  const { listSurveyUsers } = props?.listSurveyUsers?.data;
  const { listSurveyLocations } = props?.listSurveyLocations?.data;
  const { listQuestionnaires } = props?.listQuestionnaires?.data;
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

  const [openSurveyLink, setOpenSurveyLink] = React.useState(false);
  const [openSurveyQrCode, setOpenSurveyQrCode] = React.useState(false);
  const [openSurveyQrCodeTest, setOpenSurveyQrCodeTest] = React.useState(false);
  const [surveyUser, setSuveyUser] = React.useState("");
  const [surveyLocation, setSuveyLocation] = React.useState("");
  const [userSurveyLink, setUserSurveyLink] = React.useState("");

  const [deleteQuestion, setDeleteQuestion] = React.useState("");
  const [alertSuccess, setAlertSuccess] = useState(false);
  const [alertFail, setAlertFail] = useState(false);
  const [alertContentSuccess, setAlertContentSuccess] = useState("");
  const [alertCopySuccess, setAlertCopySuccess] = useState("");
  const [alertContentFail, setAlertContentFail] = useState("");
  const [inchargeEmail, setInchargeEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailSuccess, setEmailSuccess] = useState("");
  const [alertSuccessEmail, setAlertSuccessEmail] = useState(false);
  const [alertError, setAlertError] = useState(false);

  const [image, setImage] = React.useState(
    "https://dynamix-cdn.s3.amazonaws.com/stonemorcom/stonemorcom_616045937.svg"
  );
  const surveyLoc = listSurveyLocations?.items?.find(
    (loc) => loc?.id === surveyLocation
  );
  const [surveyId, setSurveyId] = useState("");

  /* Get quetion by questionID */
  const onGettingQuestionById = (id) => {
    const que = listQuestionnaires?.items?.find((q) => q?.id === id);
    return que?.name ?? id;
  };

  const surveyName = onGettingQuestionById(surveyId);

  const surveyOrder = listSurveys?.items
    ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  const [search, setSearch] = useState("");
  const surveyUrl = `${baseUrl}/surveyquestions/${surveyId}?uid=${surveyUser}`;
  const surveyUrlTest = `${baseUrlTest}/surveyquestionstest/${surveyId}?uid=${surveyUser}`;
  const [openUpdateSurvey, setOpenUpdateSurvey] = useState(false);

  const surveyQrcode = `${baseUrl}/surveyquestions/${surveyId}?uid=${surveyLocation}`;
  const surveyQrcodeTest = `${baseUrlTest}/surveyquestionstest/${surveyId}?uid=${surveyLocation}`;
  const emailUrl =
    "https://stonemor.netlify.app/.netlify/functions/server/send";
  // const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth] = useState("md");

  //emai validation//
  const handleEmail = (e) => {
    setInchargeEmail(e.target.value);
    if (validator.isEmail(inchargeEmail)) {
      setEmailSuccess("valid email");
      setAlertSuccessEmail(true);
      setAlertError(false);
    } else {
      setEmailError("Enter valid Email!");
      setAlertError(true);
      setAlertSuccessEmail(false);
    }
  };

  /*Opening Creating new surveylink Dialogbox*/
  const handleOpenCreateSurveyDialog = (survey) => {
    setSurveyId(survey?.preQuestionnaire?.id);
    setOpenSurveyLink(true);
  };
  /* Generating survey Link */
  const handleGeneratingSurveyLink = () => {
    const surveyUrl = `${baseUrl}/surveyquestions/${surveyId}?uid=${surveyUser}`;
    setUserSurveyLink(surveyUrl);
  };
  const handleGeneratingSurveyLinkTest = () => {
    const surveyUrlTest = `${baseUrlTest}/surveyquestionsTest/${surveyId}?uid=${surveyUser}`;
    setUserSurveyLink(surveyUrlTest);
  };
  //copy-clipboard//
  const copyToClipboard = () => {
    copy(surveyUrl);
    setAlertSuccess(true);
    setAlertCopySuccess("Survey Link copyed successfully");
  };
  //copy-clipboard//
  const copyToClipboardTest = () => {
    copy(surveyUrlTest);
    setAlertSuccess(true);
    setAlertCopySuccess("Survey Link copyed successfully");
  };

  /*Opening Creating new surveyQrCode Dialogbox*/
  const handleOpenCreateSurveyLocationDialog = (survey) => {
    setSurveyId(survey?.preQuestionnaire?.id);
    setOpenSurveyQrCode(true);
  };
  /*Opening Creating new surveyQrCode Dialogbox*/
  const handleOpenCreateSurveyLocationDialogTest = (survey) => {
    setSurveyId(survey?.preQuestionnaire?.id);
    setOpenSurveyQrCodeTest(true);
  };
  /*Opening Creating new surveylink Dialogbox*/
  const handleopenSurveyLinkClose = () => {
    setSuveyUser("");
    setUserSurveyLink("");
    setAlertSuccess("");
    setAlertCopySuccess("");
    setOpenSurveyLink(false);
  };

  /*Opening Creating new surveylink Dialogbox*/
  const handleopenSurveyQrCodeClose = () => {
    setSuveyLocation("");
    setInchargeEmail("");
    setAlertSuccess("");
    setEmailError("");
    setAlertSuccessEmail("");
    setAlertError(false);
    setAlertSuccessEmail(false);
    setAlertFail("");
    setOpenSurveyQrCode(false);
    setOpenSurveyQrCodeTest(false);
  };

  //QR code //

  const downloadQRCode = () => {
    // Generate download with use canvas and stream
    const canvas = document?.getElementById("qr-gen");
    const pngUrl = canvas
      ?.toDataURL("image/png")
      ?.replace("image/png", "image/octet-stream");
    let downloadLink = document?.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${surveyName}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };
  //QR code test //

  const downloadQRCodeTest = () => {
    // Generate download with use canvas and stream
    const canvas = document?.getElementById("qr-gen");
    const pngUrl = canvas
      ?.toDataURL("image/png")
      ?.replace("image/png", "image/octet-stream");
    let downloadLink = document?.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${surveyName}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  //mailSent//
  const canvas = document?.getElementById("qr-gen");
  const pngUrl = canvas
    ?.toDataURL("image/png")
    ?.replace("image/png", "image/octet-stream");

  const data = {
    mail: inchargeEmail,
    qrCode: pngUrl,
    survey: surveyName,
    loc: surveyLoc?.location,
  };
  const handleSendEmail = async () => {
    axios
      .post(`${emailUrl}`, data)
      .then((res) => {
        if (res.data.mailSent === true) {
          setAlertContentSuccess(
            `QR code send to  ${inchargeEmail}  successfully`
          );
          setAlertSuccess(true);
        } else {
          setAlertContentFail("Invalid Email ID");
          setAlertFail(true);
        }
      })
      .catch((err) => {
        alert(err);
      });
  };

  //search//

  const requestSearch = (searched) => {
    setSearch(
      surveyOrder.filter(
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

  // console.log("search", search);

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
    setIsCreated(true);
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

  useEffect(() => {
    const surveyLoc = listSurveyLocations?.items?.find(
      (loc) => loc?.id === surveyLocation
    );
    setInchargeEmail(surveyLoc?.inchargeEmail || " ");
  }, [surveyLocation]);
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
          <Typography color="primary">Manage Survey</Typography>
        </Breadcrumbs>
      </div>
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
                variant="contained"
                color="primary"
                disabled={!title}
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
            <DialogTitle id="form-dialog-title">Delete this Survey</DialogTitle>
            <DialogContent>
              <DialogContentText color="secondary">
                Are You Sure You Want to Delete this Survey?
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

        {/* sharesurvey */}
        <Dialog
          open={openSurveyLink}
          onClose={handleopenSurveyLinkClose}
          aria-labelledby="responsive-dialog-title"
          fullWidth
        >
          {alertSuccess ? (
            <Alert severity="success">{alertCopySuccess}</Alert>
          ) : (
            ""
          )}
          <FormControl>
            <DialogTitle id="responsive-dialog-title">
              Creating survey Link
            </DialogTitle>

            <DialogContent>
              <FormControl fullWidth>
                <InputLabel>Select User</InputLabel>
                <Select
                  margin="dense"
                  fullWidth
                  value={surveyUser}
                  onChange={(event) => setSuveyUser(event.target.value)}
                >
                  {listSurveyUsers?.items?.map((user, u) => (
                    <MenuItem value={user?.id} key={u}>
                      {user?.name} - {user?.email}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {userSurveyLink && (
                <>
                  <p>{userSurveyLink}</p>
                  <Button onClick={copyToClipboard}>
                    <FileCopyIcon />
                  </Button>
                </>
              )}
            </DialogContent>

            <DialogActions>
              {/* <ListItem
                size="small"
                color="primary"
                component={Link}
                to={`/admin/users`}
              >
                Create New User
              </ListItem> */}

              <Button
                onClick={handleopenSurveyLinkClose}
                color="secondary"
                variant="contained"
              >
                Close
              </Button>
              <Button
                onClick={handleGeneratingSurveyLink}
                type="button"
                color="primary"
                variant="contained"
              >
                Create SurveyLink
              </Button>
            </DialogActions>
          </FormControl>
        </Dialog>
        <Dialog
          open={openSurveyLink}
          onClose={handleopenSurveyLinkClose}
          aria-labelledby="responsive-dialog-title"
          fullWidth
        >
          {alertSuccess ? (
            <Alert severity="success">{alertCopySuccess}</Alert>
          ) : (
            ""
          )}
          <FormControl>
            <DialogTitle id="responsive-dialog-title">
              Creating survey Link for Test
            </DialogTitle>

            <DialogContent>
              <FormControl fullWidth>
                <InputLabel>Select User</InputLabel>
                <Select
                  margin="dense"
                  fullWidth
                  value={surveyUser}
                  onChange={(event) => setSuveyUser(event.target.value)}
                >
                  {listSurveyUsers?.items?.map((user, u) => (
                    <MenuItem value={user?.id} key={u}>
                      {user?.name} - {user?.email}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {userSurveyLink && (
                <>
                  <p>{userSurveyLink}</p>
                  <Button onClick={copyToClipboardTest}>
                    <FileCopyIcon />
                  </Button>
                </>
              )}
            </DialogContent>

            <DialogActions>
              {/* <ListItem
                size="small"
                color="primary"
                component={Link}
                to={`/admin/users`}
              >
                Create New User
              </ListItem> */}

              <Button
                onClick={handleopenSurveyLinkClose}
                color="secondary"
                variant="contained"
              >
                Close
              </Button>
              <Button
                onClick={handleGeneratingSurveyLinkTest}
                type="button"
                color="primary"
                variant="contained"
              >
                Create SurveyLink
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
              <Button
                onClick={handleClosingSurveyUpdateDialog}
                color="secondary"
                size="small"
                variant="contained"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateSurvey}
                type="submit"
                color="primary"
                size="small"
                variant="contained"
              >
                Update
              </Button>
            </DialogActions>
          </FormControl>
        </Dialog>

        <Dialog
          open={openSurveyQrCode}
          onClose={handleopenSurveyQrCodeClose}
          aria-labelledby="responsive-dialog-title"
          fullWidth={fullWidth}
          maxWidth={maxWidth}
        >
          {" "}
          {alertSuccess ? (
            <Alert severity="success">{alertContentSuccess}</Alert>
          ) : (
            ""
          )}
          {alertFail ? <Alert severity="error">{alertContentFail}</Alert> : ""}
          <FormControl>
            <DialogTitle id="responsive-dialog-title">
              Creating survey QR Code
            </DialogTitle>

            <DialogContent>
              <FormControl fullWidth>
                <InputLabel>Select Location</InputLabel>
                <Select
                  margin="dense"
                  fullWidth
                  value={surveyLocation}
                  onChange={(event) => setSuveyLocation(event.target.value)}
                >
                  {listSurveyLocations?.items?.map((user, u) => (
                    <MenuItem value={user?.id} key={u}>
                      {user?.location}
                    </MenuItem>
                  ))}
                </Select>
                <TextField
                  margin="dense"
                  id="InchargeEmail"
                  label="Email"
                  value={inchargeEmail}
                  onChange={(e) => handleEmail(e)}
                  fullWidth
                  type="email"
                />
              </FormControl>
              {alertSuccessEmail ? (
                <Alert severity="success">{emailSuccess}</Alert>
              ) : (
                ""
              )}
              {alertError ? <Alert severity="error">{emailError}</Alert> : ""}
            </DialogContent>

            <DialogActions>
              <IconButton
                autoFocus
                onClick={handleopenSurveyQrCodeClose}
                color="primary"
                className={classes.customizedButtion}
              >
                <CloseIcon />
              </IconButton>
              <QRCode
                id="qr-gen"
                value={surveyQrcode}
                size={280}
                level={"H"}
                includeMargin={true}
              />

              <Button
                type="button"
                variant="contained"
                color="primary"
                onClick={handleSendEmail}
              >
                Send Mail
              </Button>
              <Button
                type="button"
                variant="contained"
                color="primary"
                onClick={downloadQRCode}
              >
                Download QR Code
              </Button>
            </DialogActions>
          </FormControl>
        </Dialog>
        <Dialog
          open={openSurveyQrCodeTest}
          onClose={handleopenSurveyQrCodeClose}
          aria-labelledby="responsive-dialog-title"
          fullWidth={fullWidth}
          maxWidth={maxWidth}
        >
          {" "}
          {alertSuccess ? (
            <Alert severity="success">{alertContentSuccess}</Alert>
          ) : (
            ""
          )}
          {alertFail ? <Alert severity="error">{alertContentFail}</Alert> : ""}
          <FormControl>
            <DialogTitle id="responsive-dialog-title">
              Creating survey QR Code for Test
            </DialogTitle>

            <DialogContent>
              <FormControl fullWidth>
                <InputLabel>Select Location</InputLabel>
                <Select
                  margin="dense"
                  fullWidth
                  value={surveyLocation}
                  onChange={(event) => setSuveyLocation(event.target.value)}
                >
                  {listSurveyLocations?.items?.map((user, u) => (
                    <MenuItem value={user?.id} key={u}>
                      {user?.location}
                    </MenuItem>
                  ))}
                </Select>
                <TextField
                  margin="dense"
                  id="InchargeEmail"
                  label="Email"
                  value={inchargeEmail}
                  onChange={(e) => handleEmail(e)}
                  fullWidth
                  type="email"
                />
              </FormControl>
              {alertSuccessEmail ? (
                <Alert severity="success">{emailSuccess}</Alert>
              ) : (
                ""
              )}
              {alertError ? <Alert severity="error">{emailError}</Alert> : ""}
            </DialogContent>

            <DialogActions>
              <IconButton
                autoFocus
                onClick={handleopenSurveyQrCodeClose}
                color="primary"
                className={classes.customizedButtion}
              >
                <CloseIcon />
              </IconButton>
              <QRCode
                id="qr-gen"
                value={surveyQrcodeTest}
                size={280}
                level={"H"}
                includeMargin={true}
              />

              <Button
                type="button"
                variant="contained"
                color="primary"
                onClick={handleSendEmail}
              >
                Send Mail
              </Button>
              <Button
                type="button"
                variant="contained"
                color="primary"
                onClick={downloadQRCodeTest}
              >
                Download QR Code
              </Button>
            </DialogActions>
          </FormControl>
        </Dialog>
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
        <Paper className={classes.content} elevation={10} p={1}>
          <Table className={classes.table}>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell>Survey</StyledTableCell>
                <StyledTableCell>Description</StyledTableCell>
                <StyledTableCell>Questionnaire</StyledTableCell>
                <StyledTableCell>Manage </StyledTableCell>
                <StyledTableCell> Share Survey</StyledTableCell>
                <StyledTableCell> Test Survey</StyledTableCell>
                <StyledTableCell>Delete</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {(search?.length > 0 ? search : surveyOrder).map((survey) => (
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
                  </StyledTableCell>
                  <StyledTableCell>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => handleOpenCreateSurveyDialog(survey)}
                    >
                      <LinkIcon />
                    </Button>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() =>
                        handleOpenCreateSurveyLocationDialog(survey)
                      }
                    >
                      {" "}
                      <SelectAllIcon />
                    </Button>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => handleOpenCreateSurveyDialog(survey)}
                    >
                      <LinkIcon />
                    </Button>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() =>
                        handleOpenCreateSurveyLocationDialogTest(survey)
                      }
                    >
                      {" "}
                      <SelectAllIcon />
                    </Button>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Button
                      onClick={() => handleOpenDeleteDialog(survey)}
                      size="small"
                      color="secondary"
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
            count={search?.length || surveyOrder?.length}
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
            <AddCircleIcon className={classes.rightIcon} /> Add Survey
          </Button>
        </Paper>

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
