import {
  Alert,
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Typography,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useQuery } from "@apollo/client";
import withSuspense from "../../helpers/hoc/withSuspense";
import { useState } from "react";
import ForwardToInboxOutlinedIcon from "@mui/icons-material/ForwardToInboxOutlined";
import {
  LIST_QUESTIONNARIES_NAME,
  LIST_SURVEY_USERS,
} from "../../graphql/custom/queries";
import copy from "copy-to-clipboard";
import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined";
import axios from "axios";
import { useEffect } from "react";

const TestLinkShare = ({ toggle, surveyId }) => {
  const baseUrl = "https://main.d3d8mcg1fsym22.amplifyapp.com";
  const [usersId, setUsersId] = useState("");
  const [userSurveyLink, setUserSurveyLink] = useState("");
  const [alertSuccess, setAlertSuccess] = useState(false);
  const [alertCopySuccess, setAlertCopySuccess] = useState("");
  const { loading, error, data } = useQuery(LIST_SURVEY_USERS);
  const { data: questionariesName } = useQuery(LIST_QUESTIONNARIES_NAME);
  const [alertEmailSuccess, setAlertEmailSuccess] = useState(false);

  const [alertContentSuccess, setAlertContentSuccess] = useState("");
  const [alertContentFail, setAlertContentFail] = useState("");
  const [alertEmailFail, setAlertEmailFail] = useState(false);

  const emailUrl =
    "https://stonemor.netlify.app/.netlify/functions/server/linksend";

  const handleSurveyUserChange = (e) => {
    setUsersId(e.target.value);
  };
  const surveyUrl = `${baseUrl}/surveyquestionstest/${surveyId}?uid=${usersId}`;

  const handleGeneratingSurveyLink = () => {
    const surveyUrl = `${baseUrl}/surveyquestionstest/${surveyId}?uid=${usersId}`;
    setUserSurveyLink(surveyUrl);
  };

  /* Get quetion by questionID */
  const onGettingQuestionById = (id) => {
    const que = questionariesName?.listQuestionnaires?.items?.find(
      (q) => q?.id === surveyId
    );

    return que?.name ?? id;
  };
  const onGettingUserNameById = (id) => {
    const que = data?.listSurveyUsers?.items?.find((q) => q?.id === usersId);

    return que?.name ?? id;
  };
  const onGettingEmailById = (id) => {
    const que = data?.listSurveyUsers?.items?.find((q) => q?.id === usersId);

    return que?.email ?? id;
  };
  //copy-clipboard//
  const copyToClipboard = () => {
    copy(surveyUrl);
    setAlertSuccess(true);
    setAlertCopySuccess("Test survey link copyed successfully");
  };
  const surveyName = onGettingQuestionById(surveyId);
  const userName = onGettingUserNameById(usersId);
  const inchargeEmail = onGettingEmailById(usersId);

  console.log("userName", userName);
  console.log("surveyName", surveyName);
  console.log("inchargeEmail", inchargeEmail);
  const linkData = {
    mail: inchargeEmail,
    surveyLink: userSurveyLink,
    survey: surveyName,
    userName: userName,
  };
  console.log(userSurveyLink);
  const handleSendEmail = async () => {
    axios
      .post(`${emailUrl}`, linkData)
      .then((res) => {
        if (res.data.mailSent === true) {
          setAlertContentSuccess(
            `Test Survey link send to  ${inchargeEmail}  successfully`
          );
          setAlertEmailSuccess(true);
        } else {
          setAlertContentFail("Invalid Email ID");
          setAlertEmailFail(true);
        }
      })
      .catch((err) => {
        alert(err);
      });
  };
  useEffect(() => {
    setUserSurveyLink();
    setAlertContentFail();
    setAlertContentSuccess();
    setAlertCopySuccess();
    setAlertEmailFail(false);
    setAlertEmailSuccess(false);
    setAlertSuccess(false);
  }, [usersId]);
  return (
    <Box my={2}>
      {" "}
      <Box my={2}>
        {alertSuccess ? (
          <Alert severity="success">{alertCopySuccess}</Alert>
        ) : (
          ""
        )}{" "}
        {alertEmailSuccess ? (
          <Alert severity="success">{alertContentSuccess}</Alert>
        ) : (
          ""
        )}
        {alertEmailFail ? (
          <Alert severity="error">{alertContentFail}</Alert>
        ) : (
          ""
        )}
      </Box>
      <FormControl fullWidth>
        <InputLabel>Select User</InputLabel>
        <Select
          margin="dense"
          fullWidth
          label="Select User"
          value={usersId}
          onChange={handleSurveyUserChange}
        >
          {data?.listSurveyUsers?.items
            ?.slice()
            ?.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            ?.map((user, s) => (
              <MenuItem key={s} value={user?.id}>
                {user.name}
                {"-"}
                {user?.email}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
      {userSurveyLink && (
        <>
          <Typography variant="body2" color="text.secondary" my={1}>
            {userSurveyLink}
          </Typography>
          <Button onClick={copyToClipboard}>
            <FileCopyOutlinedIcon />
          </Button>
        </>
      )}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 2,
        }}
        my={1}
        spacing={2}
      >
        <Button onClick={toggle} color="text" variant="contained">
          Close
        </Button>

        <Button
          onClick={handleGeneratingSurveyLink}
          type="button"
          color="primary"
          variant="contained"
        >
          Create
        </Button>
        <IconButton
          color="error"
          aria-label="mailsend"
          onClick={handleSendEmail}
          disabled={!userSurveyLink}
        >
          <ForwardToInboxOutlinedIcon fontSize="large" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default withSuspense(TestLinkShare);
