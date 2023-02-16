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
  const { image, name, description, preQuestionnaire, createdAt } =
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
          Created Date : {moment.tz(createdAt, zone).format(" MMMM Do  YYYY")}
        </Typography>

        {preQuestionnaire?.name && (
          <Typography gutterBottom component="div">
            Associated Question Pools : {preQuestionnaire?.name}
          </Typography>
        )}
      {currentSurveyData?.locations?.length > 0 && 
       <Typography gutterBottom component="div">
          Associated Locations :{" "}
          {currentSurveyData?.locations?.map((loc, i,arr) => (
            <span key={i}>{loc?.length > 0 ? <>{getLocationData(loc)?.location} {i !== (arr.length-1) ? ',' : '.'}</>:<Loader/> }</span>
          ))}
        </Typography>}
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
