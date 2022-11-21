import React, { useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import ControlPointDuplicateIcon from "@material-ui/icons/ControlPointDuplicate";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import CreateIcon from "@material-ui/icons/Create";
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
// import { Link } from "react-router-dom";
import copy from "copy-to-clipboard";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import Alert from "@material-ui/lab/Alert";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import TablePagination from "@material-ui/core/TablePagination";
import TableContainer from "@material-ui/core/TableContainer";
import QRCode from "qrcode.react";
import { useTheme } from "@material-ui/core/styles";
import { graphql, compose, withApollo } from "react-apollo";
import axios from "axios";
import gql from "graphql-tag";
import CloseIcon from "@material-ui/icons/Close";
import { IconButton } from "@material-ui/core";
import {
  listQuestions,
  listQuestionnaires,
  getQuestionnaire,
  getQuestion,
  listSurveyUsers,
  listSurveyLocations,
} from "../../graphql/queries";
import {
  createQuestion,
  deleteQuestion,
  updateQuestion,
} from "../../graphql/mutations";

import AdminMenu from "./index";
import { useState } from "react";
import {
  Breadcrumbs,
  FormControlLabel,
  FormLabel,
  ListItem,
  Link,
  Radio,
  RadioGroup,
  TableFooter,
} from "@material-ui/core";
import { AlarmTwoTone } from "@material-ui/icons";

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
  // createLink: {
  //   marginLeft: "55rem",
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

const baseUrl = "https://main.d3d8mcg1fsym22.amplifyapp.com";

const QuestionnarieQuestionPart = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const {
    data: { loading, error, getQuestionnaire, refetch },
  } = props.getQuestionnaire;
  const { listSurveyUsers } = props?.listSurveyUsers?.data;
  const { listSurveyLocations } = props?.listSurveyLocations?.data;
  const [open, setOpen] = useState(false);
  const [editQuestionOpen, setEditQuestionOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [editQuestion, setEditQuestion] = useState("");
  const [order, setOrder] = useState(1);
  const [currentMode, setCurrentMode] = useState("normal");
  const [type, setType] = useState("");
  const [openAddListItem, setOpenAddListItem] = useState(false);
  const [listItemOptions, setListItemOptions] = useState([]);
  const [listItem, setListItem] = useState("");
  const [nextQuestion, setNextQuestion] = useState("");
  const [nextQuestionForOther, setNextQuestionForOther] = useState("");
  const [dependentQuestion, setDependentQuestion] = useState("");
  const [dependentQuestionOptions, setDependentQuestionOptions] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [openSurveyLink, setOpenSurveyLink] = React.useState(false);
  const [openSurveyQrCode, setOpenSurveyQrCode] = React.useState(false);
  const [surveyUser, setSuveyUser] = React.useState("");
  const [surveyLocation, setSuveyLocation] = React.useState("");
  const [userSurveyLink, setUserSurveyLink] = React.useState("");
  const [initialLoading, setinitialLoading] = useState(true);
  const [isCreated, setIsCreated] = useState(false);
  const [isopen, setIsOpen] = React.useState(false);
  const [deleteQuestion, setDeleteQuestion] = React.useState("");
  const [alertSuccess, setAlertSuccess] = useState(false);
  const [alertFail, setAlertFail] = useState(false);
  const [alertContentSuccess, setAlertContentSuccess] = useState("");
  const [alertCopySuccess, setAlertCopySuccess] = useState("");
  const [alertContentFail, setAlertContentFail] = useState("");
  const [inchargeEmail, setInchargeEmail] = useState("");

  const surveyUrl = `${baseUrl}/surveyquestions/${props.match.params.questionnaire}?uid=${surveyUser}`;

  // const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth] = useState("md");
  const emailUrl =
    "https://stonemor.netlify.app/.netlify/functions/server/send";
  const surveyLoc = listSurveyLocations?.items?.find(
    (loc) => loc?.id === surveyLocation
  );
  const surveyName = getQuestionnaire?.name;
  const surveyQrcode = `${baseUrl}/surveyquestions/${props.match.params.questionnaire}?uid=${surveyLocation}`;
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const questionCount = getQuestionnaire?.question?.items.sort(
    (a, b) => a?.order - b?.order
  );
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
  /* Generating survey Link */
  const handleGeneratingSurveyLink = () => {
    const surveyUrl = `${baseUrl}/surveyquestions/${props.match.params.questionnaire}?uid=${surveyUser}`;
    setUserSurveyLink(surveyUrl);
  };
  //copy-clipboard//
  const copyToClipboard = () => {
    copy(surveyUrl);
    setAlertSuccess(true);
    setAlertCopySuccess("Survey Link copyed successfully");
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
  console.log("editQuestion", editQuestion);
  // const handleSendEmail = (user) => {
  //   setInchargeEmail(user?.id);
  // };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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

  /*Deleting question by ID*/
  function handleDelete() {
    props.onDeleteQuestion({
      id: deleteQuestion,
    });
    setDeleteQuestion("");
    setIsCreated(true);
    setIsOpen(false);
  }

  const handleOpenDeleteDialog = (que) => {
    setDeleteQuestion(que?.id);
    setIsOpen(true);
  };
  function handleCloseDialog() {
    setIsOpen(false);
  }
  /*Opening Creating new question Dialogbox*/
  const handleOpenDialog = () => {
    setOpen(true);
  };

  /*Opening Creating new surveylink Dialogbox*/
  const handleOpenCreateSurveyDialog = () => {
    setOpenSurveyLink(true);
  };
  /*Opening Creating new surveyQrCode Dialogbox*/
  const handleOpenCreateSurveyLocationDialog = () => {
    setOpenSurveyQrCode(true);
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
    setAlertFail("");
    setOpenSurveyQrCode(false);
  };

  /*Changing new question value */
  const onQuestionChange = (newValue) => {
    if (question === newValue) {
      setQuestion(newValue);
      return;
    }
    setQuestion(newValue);
  };

  /*Changing question mode */
  const onModeChange = (event, newValue) => {
    setCurrentMode(newValue);
  };

  /*Changing new question value */
  const onTypeChange = (newValue) => {
    if (type === newValue) {
      setType(newValue);
      return;
    }
    setType(newValue);
  };

  /*reSetting to initial Values */
  const onResettingInitialValues = () => {
    setQuestion("");
    setOrder(1);
    setCurrentMode("normal");
    setType("");
    setNextQuestionForOther("");
    setListItem("");
    setNextQuestion("");
    setListItemOptions([]);
    setDependentQuestion("");
    setDependentQuestionOptions([]);
  };

  /*reSetting to initial Values */
  const handleEditQuestion = (question) => {
    setEditQuestion(question?.id);
    setQuestion(question?.qu || "");
    setOrder(question?.order || 1);
    if (question?.isSelf) setCurrentMode("self");
    else if (question?.isDependent) {
      setCurrentMode("dependent");
      setDependentQuestion(question?.dependent?.id);
      setDependentQuestionOptions(question?.dependent?.options || []);
    } else setCurrentMode("normal");
    setType(question?.type || "TEXT");
    if (type === "TEXT" && currentMode === "self") {
      setNextQuestionForOther(question?.listOptions[0]?.nextQuestion);
    }

    setListItemOptions(
      question?.listOptions?.map((item) => ({
        isMultiple: item?.isMultiple,
        isText: item?.isText,
        listValue: item?.listValue,
        nextQuestion: item?.nextQuestion,
      }))
    );
    setIsCreated(true);
    setEditQuestionOpen(true);
  };

  /*Closing create question dialog */
  const handleClose = () => {
    onResettingInitialValues();
    setOpen(false);
  };

  /*Closing Edit question dialog */
  const handleEditQuestionClose = () => {
    onResettingInitialValues();
    setEditQuestion("");
    setEditQuestionOpen(false);
  };

  /*Creating new Question */
  const handleCreate = (event) => {
    event.preventDefault();
    let createQuestionQuery = {
      qu: question,
      type: type,
      order: order,
      questionQuestionnaireId: getQuestionnaire?.id,
    };
    if (currentMode === "dependent") {
      const dependentQuestionQuery = {
        id: dependentQuestion,
        options: dependentQuestionOptions,
      };
      createQuestionQuery.isDependent = true;
      createQuestionQuery.dependent = dependentQuestionQuery;
    }
    if (currentMode === "self") createQuestionQuery.isSelf = true;
    if (type && type === "TEXT") {
      if (currentMode === "self" && nextQuestionForOther) {
        createQuestionQuery.listOptions = {
          listValue: type,
          nextQuestion: nextQuestionForOther,
        };
      }
    }

    if (type && type !== "TEXT") {
      if (listItemOptions.length > 0)
        createQuestionQuery.listOptions = listItemOptions;
    }
    const response = props.onCreateQuestion(
      createQuestionQuery,
      getQuestionnaire?.id
    );
    setIsCreated(true);
    handleClose();
  };

  /*Updating Question */
  const handleUpdateQuestion = (event) => {
    event.preventDefault();
    let updateQuestionQuery = {
      id: editQuestion,
      qu: question,
      type: type,
      order: order,
      questionQuestionnaireId: getQuestionnaire?.id,
    };
    let updateQuestionQueryRating = {
      id: editQuestion,
      qu: question,
      order: order,
      questionQuestionnaireId: getQuestionnaire?.id,
    };
    if (currentMode === "dependent") {
      const dependentQuestionQuery = {
        id: dependentQuestion,
        options: dependentQuestionOptions,
      };
      updateQuestionQuery.isDependent = true;
      updateQuestionQuery.dependent = dependentQuestionQuery;
    }
    if (currentMode === "self") updateQuestionQuery.isSelf = true;
    if (type && type === "TEXT") {
      if (currentMode === "self" && nextQuestionForOther) {
        updateQuestionQuery.listOptions = {
          listValue: type,
          nextQuestion: nextQuestionForOther,
        };
      }
    }
    if (type && type !== "TEXT" && type && type !== "LIST") {
      if (listItemOptions.length > 0)
        updateQuestionQuery.listOptions = listItemOptions;
    }
    props.onUpadateQuestion(
      updateQuestionQuery || updateQuestionQueryRating,
      getQuestionnaire?.id
    );
    setIsCreated(true);
    handleEditQuestionClose();
  };

  /* Get quetion by questionID */
  const onGettingQuestionById = (id) => {
    const que = getQuestionnaire?.question?.items?.find((q) => q?.id === id);
    return que?.qu ?? id;
  };

  /* Adding List Item Options */
  const handleAddingListItemOptions = () => {
    let listQuery = {
      listValue: listItem,
    };
    if (currentMode === "self") listQuery.nextQuestion = nextQuestion;
    setListItemOptions((prevState) => [...prevState, listQuery]);
    setListItem("");
    setNextQuestion("");
  };

  /* Adding List Item Options */
  const handleSettingDependentNextQuestion = (que, optionValue) => {
    const isAlreadyExisting = dependentQuestionOptions?.find(
      (option) => option?.dependentValue === optionValue
    );
    if (isAlreadyExisting) {
      setDependentQuestionOptions(
        dependentQuestionOptions?.filter(
          (option) => option?.dependentValue !== optionValue
        )
      );
    }
    setDependentQuestionOptions((prevSate) => [
      ...prevSate,
      { dependentValue: optionValue, nextQuestion: que },
    ]);
  };

  /*Closing Add List Item Options dialog */
  const handleAddListItemClose = () => {
    setOpenAddListItem(false);
  };
  useEffect(() => {
    const surveyLoc = listSurveyLocations?.items?.find(
      (loc) => loc?.id === surveyLocation
    );
    setInchargeEmail(surveyLoc?.inchargeEmail || " ");
  }, [surveyLocation]);
  /* Side effect to open List dialog */
  useEffect(() => {
    if (type && type !== "TEXT" && type && type !== "LIST" && !editQuestion) {
      if (type === "CHECKBOX") setCurrentMode("normal");
      setOpenAddListItem(true);
    }
  }, [type]);

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
          <Link underline="hover" color="inherit" href="/admin/questionnaires">
            Manage Questionnaire
          </Link>
          <Typography color="primary"> {getQuestionnaire?.name}</Typography>
        </Breadcrumbs>
      </div>
      <div>
        <Dialog
          open={isopen}
          onClose={handleCloseDialog}
          aria-labelledby="form-dialog-title"
        >
          <FormControl>
            <DialogTitle id="form-dialog-title">
              Delete this Question
            </DialogTitle>
            <DialogContent>
              <DialogContentText color="secondary">
                Are You Sure You Want to Delete this Question?
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
                variant="contained"
                color="primary"
              >
                Delete
              </Button>
            </DialogActions>
          </FormControl>
        </Dialog>
        <Dialog
          fullWidth
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <FormControl>
            <DialogTitle id="form-dialog-title">
              Create Question - {getQuestionnaire?.name}
            </DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                id="qu"
                label="Question"
                value={question}
                onChange={(event) => onQuestionChange(event.target.value)}
                fullWidth
              />
              <TextField
                margin="dense"
                id="order"
                label="Order"
                type="number"
                value={order}
                placeholder="Similar to question number"
                onChange={(event) => setOrder(event.target.value)}
                fullWidth
              />
              <FormControl fullWidth>
                <FormLabel
                  style={{ margin: "10px 0", color: "black" }}
                  id="demo-radio-buttons-group-label"
                >
                  Mode
                </FormLabel>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  name="radio-buttons-group"
                  value={currentMode}
                  onChange={onModeChange}
                  row
                >
                  <FormControlLabel
                    value="normal"
                    control={<Radio />}
                    label="Normal"
                  />
                  <FormControlLabel
                    value="self"
                    control={<Radio />}
                    label="Self"
                  />
                  <FormControlLabel
                    value="dependent"
                    control={<Radio />}
                    label="Dependent"
                  />
                </RadioGroup>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  margin="dense"
                  fullWidth
                  value={type}
                  onChange={(event) => onTypeChange(event.target.value)}
                >
                  <MenuItem value={"TEXT"}> Text</MenuItem>
                  <MenuItem value={"RADIO"}>Single Option Select</MenuItem>
                  <MenuItem value={"CHECKBOX"}>Multiple Option Select</MenuItem>
                  <MenuItem value={"LIST"}>Rating</MenuItem>
                  {/* <MenuItem value={"RADIO_TEXT"}>Radio with Text</MenuItem> */}
                  {/* <MenuItem value={"CHECKBOXTEXT"}>Checkbox Text</MenuItem> */}
                </Select>
              </FormControl>

              {type === "TEXT" && currentMode === "self" && (
                <FormControl fullWidth>
                  <InputLabel>Next question</InputLabel>
                  <Select
                    margin="dense"
                    fullWidth
                    value={nextQuestionForOther}
                    onChange={(event) =>
                      setNextQuestionForOther(event.target.value)
                    }
                  >
                    {getQuestionnaire?.question?.items
                      .sort((a, b) => a?.order - b?.order)
                      .map((que, q) => (
                        <MenuItem value={que?.id} key={q}>
                          {que?.order + "  " + que?.qu}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              )}

              {currentMode === "dependent" && (
                <>
                  <FormControl fullWidth style={{ margin: "10px 0" }}>
                    <InputLabel>Dependent question</InputLabel>
                    <Select
                      margin="dense"
                      fullWidth
                      value={dependentQuestion}
                      onChange={(event) =>
                        setDependentQuestion(event.target.value)
                      }
                    >
                      {getQuestionnaire?.question?.items
                        .sort((a, b) => a?.order - b?.order)
                        .map((que, q) => (
                          <MenuItem value={que?.id} key={q}>
                            {que?.order + "  " + que?.qu}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                  {dependentQuestion &&
                    getQuestionnaire?.question?.items
                      .find((q) => q.id === dependentQuestion)
                      ?.listOptions?.map((options, i) => (
                        <FormControl
                          fullWidth
                          style={{ margin: "3px 0" }}
                          key={i}
                        >
                          <InputLabel>{options?.listValue}</InputLabel>
                          <Select
                            margin="dense"
                            fullWidth
                            value={
                              dependentQuestionOptions.find(
                                (o) => o?.dependentValue === options?.listValue
                              )?.nextQuestion
                            }
                            onChange={(event) =>
                              handleSettingDependentNextQuestion(
                                event.target.value,
                                options?.listValue
                              )
                            }
                          >
                            {getQuestionnaire?.question?.items
                              .sort((a, b) => a?.order - b?.order)
                              .map((que, q) => (
                                <MenuItem value={que?.id} key={q}>
                                  {que?.order + "  " + que?.qu}
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                      ))}
                </>
              )}

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
                onClick={(event) => handleCreate(event)}
                variant="contained"
                color="primary"
              >
                Create
              </Button>
            </DialogActions>
          </FormControl>
        </Dialog>
        <Dialog
          open={openAddListItem}
          // onClose={handleAddListItemClose}
          aria-labelledby="form-dialog-title"
          fullWidth
        >
          <FormControl>
            <DialogTitle id="form-dialog-title">Add listitems</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                id="qu"
                label="Listitem"
                value={listItem}
                onChange={(event) => setListItem(event.target.value)}
                fullWidth
              />
              {currentMode === "self" && (
                <FormControl fullWidth>
                  <InputLabel>Next question</InputLabel>
                  <Select
                    margin="dense"
                    fullWidth
                    value={nextQuestion}
                    onChange={(event) => setNextQuestion(event.target.value)}
                  >
                    {getQuestionnaire?.question?.items
                      .sort((a, b) => a?.order - b?.order)
                      .map((que, q) => (
                        <MenuItem value={que?.id} key={q}>
                          {que?.order + "  " + que?.qu}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              )}
              {listItemOptions?.length > 0 && (
                <div style={{ margin: "15px 0" }}>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Option</TableCell>
                        {currentMode === "self" && (
                          <TableCell>Question</TableCell>
                        )}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {listItemOptions.map((item, i) => (
                        <TableRow key={i}>
                          <TableCell>{item?.listValue}</TableCell>
                          {currentMode === "self" && (
                            <TableCell>
                              {onGettingQuestionById(item?.nextQuestion)}
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </DialogContent>
            <DialogActions>
              <IconButton
                autoFocus
                onClick={handleAddListItemClose}
                color="primary"
                className={classes.customizedButtion1}
              >
                <CloseIcon />
              </IconButton>
              <Button
                onClick={handleAddListItemClose}
                disabled={!listItemOptions?.length > 0}
                color="secondary"
                variant="contained"
              >
                Close
              </Button>
              <Button
                onClick={handleAddingListItemOptions}
                type="button"
                color="primary"
                variant="contained"
                disabled={!listItem}
              >
                Add
              </Button>
            </DialogActions>
          </FormControl>
        </Dialog>
        <Dialog
          open={editQuestionOpen}
          onClose={handleEditQuestionClose}
          aria-labelledby="form-dialog-title"
          fullWidth
          disableEnforceFocus
        >
          <FormControl>
            <DialogTitle id="form-dialog-title">Edit Question</DialogTitle>
            <DialogContent disableEnforceFocus>
              <TextField
                autoFocus
                margin="dense"
                id="qu"
                label="Question"
                value={question}
                onChange={(event) => onQuestionChange(event.target.value)}
                fullWidth
              />
              <TextField
                margin="dense"
                id="order"
                label="Order"
                type="number"
                value={order}
                placeholder="Similar to question number"
                onChange={(event) => setOrder(event.target.value)}
                fullWidth
              />
              {type !== "LIST" && (
                <FormControl fullWidth>
                  <FormLabel
                    style={{ margin: "10px 0", color: "black" }}
                    id="demo-radio-buttons-group-label"
                  >
                    Mode
                  </FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    name="radio-buttons-group"
                    value={currentMode}
                    onChange={onModeChange}
                    row
                  >
                    <FormControlLabel
                      value="normal"
                      control={<Radio />}
                      label="Normal"
                    />
                    <FormControlLabel
                      value="self"
                      control={<Radio />}
                      label="Self"
                    />
                    <FormControlLabel
                      value="dependent"
                      control={<Radio />}
                      label="Dependent"
                    />
                  </RadioGroup>
                </FormControl>
              )}
              {type === "LIST" && (
                <FormControl fullWidth>
                  <TextField
                    margin="dense"
                    fullWidth
                    label="Type"
                    inputProps={{ readOnly: true }}
                    value={"Rating"}
                    disabled
                    onChange={(event) => onTypeChange(event.target.value)}
                  />
                </FormControl>
              )}
              {type !== "LIST" && (
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    margin="dense"
                    fullWidth
                    value={type}
                    onChange={(event) => onTypeChange(event.target.value)}
                  >
                    <MenuItem value={"TEXT"}>Text</MenuItem>
                    <MenuItem value={"RADIO"}>Single Option Select</MenuItem>
                    <MenuItem value={"CHECKBOX"}>
                      Multiple Option Select
                    </MenuItem>
                    {/* <MenuItem value={"RADIO_TEXT"}>Radio with Text</MenuItem> */}
                    {/* <MenuItem value={"CHECKBOXTEXT"}>Checkbox Text</MenuItem> */}
                  </Select>
                </FormControl>
              )}

              {type === "TEXT" && currentMode === "self" && (
                <FormControl fullWidth>
                  <InputLabel>Next question</InputLabel>
                  <Select
                    margin="dense"
                    fullWidth
                    value={nextQuestionForOther}
                    onChange={(event) =>
                      setNextQuestionForOther(event.target.value)
                    }
                  >
                    {getQuestionnaire?.question?.items
                      .sort((a, b) => a?.order - b?.order)
                      .map((que, q) => (
                        <MenuItem value={que?.id} key={q}>
                          {que?.order + "  " + que?.qu}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              )}
              {currentMode === "dependent" && (
                <>
                  <FormControl fullWidth style={{ margin: "10px 0" }}>
                    <InputLabel>Dependent question</InputLabel>
                    <Select
                      margin="dense"
                      fullWidth
                      value={dependentQuestion}
                      onChange={(event) =>
                        setDependentQuestion(event.target.value)
                      }
                    >
                      {getQuestionnaire?.question?.items
                        .sort((a, b) => a?.order - b?.order)
                        .map((que, q) => (
                          <MenuItem value={que?.id} key={q}>
                            {que?.order + "  " + que?.qu}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                  {dependentQuestion &&
                    getQuestionnaire?.question?.items
                      .find((q) => q.id === dependentQuestion)
                      ?.listOptions?.map((options, i) => (
                        <FormControl
                          fullWidth
                          style={{ margin: "3px 0" }}
                          key={i}
                        >
                          <InputLabel>{options?.listValue}</InputLabel>
                          <Select
                            margin="dense"
                            fullWidth
                            value={
                              dependentQuestionOptions.find(
                                (o) => o?.dependentValue === options?.listValue
                              )?.nextQuestion
                            }
                            onChange={(event) =>
                              handleSettingDependentNextQuestion(
                                event.target.value,
                                options?.listValue
                              )
                            }
                          >
                            {getQuestionnaire?.question?.items
                              .sort((a, b) => a?.order - b?.order)
                              .map((que, q) => (
                                <MenuItem value={que?.id} key={q}>
                                  {que?.order + "  " + que?.qu}
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                      ))}
                </>
              )}
              {type !== "TEXT" && type !== "LIST" && (
                <>
                  <TextField
                    margin="dense"
                    id="qu"
                    label="Listitem"
                    value={listItem}
                    onChange={(event) => setListItem(event.target.value)}
                    fullWidth
                  />
                  {currentMode === "self" && (
                    <FormControl fullWidth>
                      <InputLabel>Next question</InputLabel>
                      <Select
                        margin="dense"
                        fullWidth
                        value={nextQuestion}
                        onChange={(event) =>
                          setNextQuestion(event.target.value)
                        }
                      >
                        {getQuestionnaire?.question?.items
                          .sort((a, b) => a?.order - b?.order)
                          .map((que, q) => (
                            <MenuItem value={que?.id} key={q}>
                              {que?.order + "  " + que?.qu}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  )}
                  <div style={{ margin: "8px 2px" }}>
                    <Button
                      onClick={handleAddingListItemOptions}
                      type="button"
                      variant="outlined"
                      color="primary"
                      disabled={!listItem}
                    >
                      Add
                    </Button>
                  </div>
                  {listItemOptions?.length > 0 && (
                    <div style={{ margin: "15px 0" }}>
                      <Table className={classes.table}>
                        <TableHead>
                          <TableRow>
                            <TableCell>Option</TableCell>
                            {currentMode === "self" && (
                              <TableCell>Question</TableCell>
                            )}
                            <TableCell>Remove</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {listItemOptions.map((item, i) => (
                            <TableRow key={i}>
                              <TableCell>{item?.listValue}</TableCell>
                              {currentMode === "self" && (
                                <TableCell>
                                  {onGettingQuestionById(item?.nextQuestion)}
                                </TableCell>
                              )}
                              <TableCell>
                                <Button
                                  size="small"
                                  color="secondary"
                                  onClick={() =>
                                    setListItemOptions(
                                      listItemOptions?.filter(
                                        (i) => i?.listValue !== item?.listValue
                                      )
                                    )
                                  }
                                >
                                  <DeleteIcon />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </>
              )}
            </DialogContent>
            <Divider />
            <DialogActions>
              <Button
                onClick={handleEditQuestionClose}
                color="secondary"
                variant="contained"
              >
                Close
              </Button>
              <Button
                onClick={(event) => handleUpdateQuestion(event)}
                variant="contained"
                type="button"
                color="primary"
              >
                Update
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
                  onChange={(event) => setInchargeEmail(event.target.value)}
                  fullWidth
                  type="email"
                />
              </FormControl>
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
      </div>
      <main className={classes.root}>
        <div>
          <Typography variant="h4">{getQuestionnaire?.name} </Typography>{" "}
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={handleOpenCreateSurveyDialog}
          >
            <CreateIcon className={classes.rightIcon} />
            Create Survey Link
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={handleOpenCreateSurveyLocationDialog}
          >
            <CreateIcon className={classes.rightIcon} />
            Create Survey QR Code
          </Button>
        </div>
        <p />
        <Paper className={classes.content} elevation={10}>
          <TableContainer className={classes.container}>
            <Table
              className={classes.table}
              stickyHeader
              aria-label="sticky table"
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell> Q.No </StyledTableCell>
                  <StyledTableCell>Question</StyledTableCell>
                  <StyledTableCell>Type</StyledTableCell>
                  <StyledTableCell>List Options</StyledTableCell>
                  <StyledTableCell>Manage</StyledTableCell>
                  <StyledTableCell>Delete</StyledTableCell>
                </TableRow>
              </TableHead>
              {(rowsPerPage > 0
                ? questionCount.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : questionCount
              ).map((question, i) => (
                <StyledTableRow key={i}>
                  <StyledTableCell component="th" scope="row">
                    {question?.order}
                  </StyledTableCell>
                  <StyledTableCell>{question.qu}</StyledTableCell>
                  {question?.type === "LIST" && (
                    <StyledTableCell>{"RATING"}</StyledTableCell>
                  )}
                  {question?.type !== "LIST" && (
                    <StyledTableCell>{question.type}</StyledTableCell>
                  )}

                  <StyledTableCell>
                    {question.listOptions
                      ? question.listOptions.map((option, l) => (
                          <li key={l}>{option?.listValue}</li>
                        ))
                      : "(Empty)"}
                  </StyledTableCell>
                  <StyledTableCell>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => handleEditQuestion(question)}
                    >
                      <EditIcon />
                    </Button>
                  </StyledTableCell>
                  <StyledTableCell>
                    {" "}
                    <Button
                      size="small"
                      color="secondary"
                      onClick={() => handleOpenDeleteDialog(question)}
                    >
                      <DeleteIcon />
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={questionCount?.length}
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
            <AddCircleIcon className={classes.rightIcon} /> Add Question
          </Button>
        </Paper>

        {/* <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={handleOpenDialog}
        >
          <ControlPointDuplicateIcon className={classes.rightIcon} /> Clone
          Questionnaire
        </Button> */}
        {/* <Button
          variant="contained"
          color="secondary"
          className={classes.button}
          onClick={handleOpenCreateSurveyDialog}
        >
          <CreateIcon className={classes.rightIcon} />
          Create Survey Link
        </Button> */}
      </main>
    </div>
  );
};

const Question = compose(
  graphql(gql(getQuestionnaire), {
    options: (props) => ({
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
      variables: { id: props.match.params.questionnaire },
    }),
    props: (props) => {
      return {
        getQuestionnaire: props ? props : [],
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
  graphql(gql(deleteQuestion), {
    props: (props) => ({
      onDeleteQuestion: (response) => {
        props.mutate({
          variables: {
            input: response,
          },
        });
      },
    }),
  }),
  graphql(gql(createQuestion), {
    props: (props) => ({
      onCreateQuestion: (response) => {
        props.mutate({
          variables: {
            input: response,
          },

          update: (store, { data: { createQuestion } }) => {
            const query = gql(listQuestions);
            const data = store.readQuery({ query });
            if (data?.listQuestions?.items?.length > 0) {
              data.listQuestions.items = [
                ...data.listQuestions.items.filter(
                  (item) => item.id !== createQuestion.id
                ),
                createQuestion,
              ];
            }
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
  graphql(gql(updateQuestion), {
    props: (props) => ({
      onUpadateQuestion: (response) => {
        props.mutate({
          variables: {
            input: response,
          },

          update: (store, { data: { updateQuestion } }) => {
            const query = gql(listQuestions);
            const data = store.readQuery({ query });
            if (data?.listQuestions?.items?.length > 0) {
              data.listQuestions.items = [
                ...data.listQuestions.items.filter(
                  (item) => item.id !== updateQuestion.id
                ),
                createQuestion,
              ];
            }
            store.writeQuery({
              query,
              data,
              variables: { filter: null, limit: null, nextToken: null },
            });
          },
        });
      },
    }),
  })
)(QuestionnarieQuestionPart);

export default withApollo(Question);
