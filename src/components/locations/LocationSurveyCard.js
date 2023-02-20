import { useQuery } from "@apollo/client";
import {
  Alert,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState, Suspense, lazy, useEffect } from "react";
import DynamicModel from "../reusable/DynamicModel";
import ShareSurvey from "../surveys/ShareSurvey";
import ViewSurvey from "../surveys/ViewSurvey";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import useToggle from "../../helpers/hooks/useToggle";
import { Loader } from "@aws-amplify/ui-react";
import QRCode from "qrcode.react";
import axios from "axios";
import validator from "validator";
import ForwardToInboxOutlinedIcon from "@mui/icons-material/ForwardToInboxOutlined";
import DownloadForOfflineOutlinedIcon from "@mui/icons-material/DownloadForOfflineOutlined";

import {
  LIST_QUESTIONNARIES_NAME,
  LIST_SURVEY_LOCATIONS,
} from "../../graphql/custom/queries";
import { Looks } from "@mui/icons-material";

const LocationSurveyCard = ({ survey, locationId, smLocations,showActions = true }) => {
  const { loading, error, data } = useQuery(LIST_SURVEY_LOCATIONS);
  const { data: questionariesName } = useQuery(LIST_QUESTIONNARIES_NAME);

  const [surveyLocation, setSuveyLocation] = useState(null);
  const [inchargeEmail, setInchargeEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailSuccess, setEmailSuccess] = useState("");
  const [alertSuccessEmail, setAlertSuccessEmail] = useState(false);
  const [alertContentSuccess, setAlertContentSuccess] = useState("");
  const [alertContentFail, setAlertContentFail] = useState("");
  const [alertError, setAlertError] = useState(false);
  const [alertSuccess, setAlertSuccess] = useState(false);
  const [alertFail, setAlertFail] = useState(false);
  const emailUrl =
    "https://stonemor.netlify.app/.netlify/functions/server/send";
  const baseUrl = "https://main.d3d8mcg1fsym22.amplifyapp.com";

  const surveyQrcodeTest = `${baseUrl}/surveyquestions/${survey?.preQuestionnaire?.id}?lid=${locationId}`;
  /* Get quetion by questionID */
  const onGettingQuestionById = (id) => {
    const que = questionariesName?.listQuestionnaires?.items?.find(
      (q) => q?.id === survey?.preQuestionnaire?.id
    );

    return que?.name ?? id;
  };
  const surveyLoc = surveyLocation;
  const surveyName = onGettingQuestionById(locationId);

  const look = smLocations?.find((loc) => loc?.locationID === locationId);


  const {
    open: viewOpen,
    toggleOpen: viewToggleOpen,
    setOpen: setViewOpen,
  } = useToggle();

  const {
    open: shareOpen,
    toggleOpen: shareToggleOpen,
    setOpen: setShareOpen,
  } = useToggle();
  const {
    open: QrShareOpen,
    toggleOpen: QrShareToggleOpen,
    setOpen: setQrShareOpen,
  } = useToggle();
  const handleQrToggleOpen = () => {
    QrShareToggleOpen();
  };

  const [currentSurvey, setCurrentSurvey] = useState({});
  const { image, name, description } = survey;

  const openShareDialog = Boolean(shareOpen) && Boolean(currentSurvey);
  const openViewDialog = Boolean(viewOpen) && Boolean(currentSurvey?.id);
  const openQrShareDialog = Boolean(QrShareOpen);

  const handleSurveyViewDialog = (survey) => {
    setCurrentSurvey(survey);
    setViewOpen(true);
  };
  const handleSurveyShareDialog = (survey) => {
    const { id, name } = survey?.preQuestionnaire;
    setCurrentSurvey({
      id,
      name,
    });
    setShareOpen(true);
  };
  const handleShareToggleOpen = () => {
    setCurrentSurvey({});
    shareToggleOpen();
  };
  const handleViewToggleOpen = () => {
    setCurrentSurvey({});
    viewToggleOpen();
  };
  const canvas = document?.getElementById("qr-gen");
  const pngUrl = canvas
    ?.toDataURL("image/png")
    ?.replace("image/png", "image/octet-stream");

  const QrData = {
    mail: inchargeEmail,
    qrCode: pngUrl,
    survey: surveyName,
    loc: surveyLoc?.location,
  };
  const handleSendEmail = async () => {
    axios
      .post(`${emailUrl}`, QrData)
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
  //email validation//
  const handleEmail = (e) => {
    setInchargeEmail(e.target.value);
  };
  //email validation//
  useEffect(() => {
    if (Boolean(inchargeEmail)) {
      if (validator.isEmail(inchargeEmail)) {
        setEmailSuccess("valid email");
        setAlertSuccessEmail(true);
        setAlertError(false);
      } else {
        setEmailError("Enter valid Email!");
        setAlertError(true);
        setAlertSuccessEmail(false);
      }
    } else {
      setAlertSuccessEmail(false);
      setAlertError(false);
    }
  }, [inchargeEmail]);
  useEffect(() => {
    const surveyLoc = data?.listSurveyLocations?.items?.find(
      (loc) => loc?.id === surveyLocation
    );
    setInchargeEmail(surveyLoc?.inchargeEmail || "");
  }, [surveyLocation]);
  // console.log("data",survey)
  // const look =survey?.locations?.find(
  //   (loc) => loc?.id === locationId
  // )
  // console.log("surveyLoc",look?.map((i)=>(i?.location)) );

  return (
    <Box height="100%">
      
      <DynamicModel
        dialogTitle={` Share survey - ${currentSurvey?.name}`}
        open={openShareDialog}
        toggle={handleShareToggleOpen}
        isClose
        maxWidth="sm"
        isActions={false}
      >
        <Suspense fallback={<Loader />}>
          <ShareSurvey
            toggle={handleShareToggleOpen}
            currentSurveyData={currentSurvey}
          />
        </Suspense>
      </DynamicModel>
      <DynamicModel
        dialogTitle="Generate QR Code"
        open={openQrShareDialog}
        toggle={handleQrToggleOpen}
        isClose
        maxWidth="md"
        isActions={false}
      >    
       

        <Box my={2}>
          {alertSuccess ? (
            <Alert severity="success">{alertContentSuccess}</Alert>
          ) : (
            ""
          )}
          {alertFail ? <Alert severity="error">{alertContentFail}</Alert> : ""}
        </Box>
        <Grid container spacing={4}>
          <Grid item md={4}>
            <QRCode
              id="qr-gen"
              value={surveyQrcodeTest}
              size={280}
              level={"H"}
              includeMargin={true}
            />{" "}
          </Grid>

          <Grid item md={8}>
          <Typography style={{fontWeight:"bold"}}>Survey -<span style={{fontWeight:"lighter"}}> {survey?.name}</span></Typography>
        <Typography  sx={{pb:3}} style={{fontWeight:"bold"}}>Location -<span style={{fontWeight:"lighter"}}> {look?.location}</span></Typography>
            {" "}
            <TextField
              margin="dense"
              id="InchargeEmail"
              label="Email"
              placeholder="Enter Email Address to  receive Qr Code"
              value={inchargeEmail}
              onChange={(e) => handleEmail(e)}
              fullWidth
              type="Email"
             
            />
            {alertSuccessEmail ? (
              <Alert severity="success">{emailSuccess}</Alert>
            ) : (
              ""
            )}
            {alertError ? <Alert severity="error">{emailError}</Alert> : ""}{" "}
            <Grid
              item
              display="flex"
              justifyContent="space-evenly"
              alignItems="center"
            >
              <IconButton
                color="primary"
                aria-label="mailsend"
                onClick={downloadQRCodeTest}
              >
                <DownloadForOfflineOutlinedIcon fontSize="large" />
              </IconButton>

              <IconButton
                color="error"
                aria-label="mailsend"
                onClick={handleSendEmail}
                disabled={!alertSuccessEmail}
              >
                <ForwardToInboxOutlinedIcon fontSize="large" />
              </IconButton>
              
            </Grid>
           
          </Grid>
        </Grid>
      </DynamicModel>
      <Suspense fallback={<Loader />}></Suspense>
      <DynamicModel
        open={openViewDialog}
        toggle={handleViewToggleOpen}
        dialogTitle={`View Survey `}
        isActions={false}
      >
        <Suspense fallback={<Loader />}>
          <ViewSurvey
            toggle={handleViewToggleOpen}
            currentSurveyData={currentSurvey}
          />
        </Suspense>
      </DynamicModel>
      <Card
        sx={{
          p: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100",
        }}
      >
        <CardMedia
          component="img"
          height="100"
          src={image}
          alt="Survey Logo"
          sx={{ p: 0.5, objectFit: "contain" }}
        />
        <CardContent>
          <Typography gutterBottom variant="h6" component="div">
            {name}
          </Typography>
          {description && (
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          )}
        </CardContent>
        <CardActions
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <IconButton
            color="primary"
            aria-label="archive"
            onClick={() => handleSurveyViewDialog(survey)}
          >
            <VisibilityOutlinedIcon />
          </IconButton>

          {showActions && (
            <>
              {survey?.preQuestionnaire?.id && (
                <IconButton
                  color="primary"
                  aria-label="delete"
                  onClick={() => handleQrToggleOpen(survey)}
                >
                  <ShareOutlinedIcon />
                </IconButton>
              )}
            </>
          )}
        </CardActions>
      </Card>
    </Box>
  );
};

export default LocationSurveyCard;
