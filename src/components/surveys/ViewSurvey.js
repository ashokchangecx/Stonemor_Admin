import withSuspense from "../../helpers/hoc/withSuspense";
import { useQuery } from "@apollo/client";
import {
  Button,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import moment from "moment-timezone";
import { Link } from "react-router-dom";
import useSmLocationData from "../../helpers/hooks/useSmLocationData";
import { Loader } from "../common/Loader";

const ViewSurvey = ({ currentSurveyData }) => {
  const { image, name, description, preQuestionnaire, createdAt, locations } =
    currentSurveyData;
  let zone = "America/New_York";
  const { loadingLocation, smLocations } = useSmLocationData();
  const getLocationData = (id) =>
    smLocations?.find((loc) => loc?.locationID === id);
  return (
    <Box
      sx={{
        p: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <CardMedia
        component="img"
        height="100"
        src={image}
        alt="Survey Logo"
        sx={{ p: 0.5, objectFit: "contain" }}
      />
      <CardHeader />

      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {name}
        </Typography>
        {description && (
          <Typography gutterBottom variant="body2" color="text.secondary">
            {description}
          </Typography>
        )}

        <Typography gutterBottom variant="body2">
          <span style={{ fontWeight: "bold" }}> Created Date :</span>{" "}
          {moment.tz(createdAt, zone).format(" MMMM Do  YYYY")}
        </Typography>

        <Typography gutterBottom component="div">
          <span style={{ fontWeight: "bold" }}>
            {" "}
            Associated Question Pools :
          </span>{" "}
          {preQuestionnaire?.name ? (
            <>{preQuestionnaire?.name}</>
          ) : (
            <span style={{ color: "red" }}>No associated question pool assign for this survey</span>
          )}
        </Typography>
        {locations?.length > 0 ? (
          <Typography gutterBottom component="div">
            <span style={{ fontWeight: "bold" }}> Associated Locations : </span>

            <>
              {" "}
              {currentSurveyData?.locations?.map((loc, i, arr) => (
                <span key={i}>
                  {" "}
                  <>
                    {getLocationData(loc)?.location}
                    {i !== arr.length - 1 ? "," : "."}
                  </>
                </span>
              ))}
            </>
          </Typography>
        ) : (
          <Typography>
                      <span style={{ fontWeight: "bold" }}> Associated Locations : </span>
         <span style={{ color: "red" }}>No associated location assign for this survey</span>
    
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
        {preQuestionnaire?.name && (
          <Button
            size="small"
            variant="contained"
            color="secondary"
            component={Link}
            to={`/questionnaries/${preQuestionnaire?.id}`}
          >
            View Question Pools
          </Button>
        )}
      </CardActions>
    </Box>
  );
};

export default withSuspense(ViewSurvey);
