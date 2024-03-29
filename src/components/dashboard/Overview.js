import { CardContent, Grid, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Link } from "react-router-dom";

const Overview = ({
  surveyCount,
  surveyEntriesCount,
  surveyLocationsCount,
  surveyUsersCount,
}) => {
  return (
    <Grid container>
      <Wrapper title="Total Surveys" count={surveyCount} to="/surveys" />
      <Wrapper
        title="Total Opens"
        count={surveyEntriesCount}
        secondary
        to="/surveyEntries"
      />
      <Wrapper
        title="Total Locations"
        count={surveyLocationsCount}
        to="/locations"
      />
      <Wrapper
        title="Total Completions"
        count={surveyUsersCount}
        secondary
        to="/users"
      />
    </Grid>
  );
};

export default Overview;

const Wrapper = ({ count, title = "Total", secondary = false, to }) => {
  return (
    <Grid item xs={12} sm={6} p={0.5}>
      <Link
        to={to}
        style={{
          textDecoration: "none",
        }}
      >
        <Paper
          sx={{
            borderRadius: 1,
            bgcolor: secondary ? "secondary.main" : "primary.main",
            color: "white",
          }}
        >
          <CardContent>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6">{title}</Typography>
              <Typography variant="h4">{count}</Typography>
            </Box>
          </CardContent>
        </Paper>
      </Link>
    </Grid>
  );
};
