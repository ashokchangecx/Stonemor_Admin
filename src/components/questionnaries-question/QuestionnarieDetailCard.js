import { Card, CardContent, Grid, Paper, Typography } from "@mui/material";
import moment from "moment-timezone";

const QuestionnarieDetailCard = ({ questionnarieData }) => {
  const { endMsg, introMsg, name, createdAt, description } = questionnarieData;

  let zone = "America/New_York";
  const linkify = () => {
    const urlRegex =
      /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
    return endMsg?.replace(urlRegex, function (url) {
      return (
        '<a href="' + url + '" target="_blank" rel="noreferrer">' + url + "</a>"
      );
    });
  };

  return (
    <>
      <Paper elevation={10} sx={{ mb: "1rem", mt: 2 }}>
        <Card
          sx={{
            p: 3,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            bgcolor: "white",
            border: "1px solid #6aa342",
          }}
        >
          <CardContent>
            <Typography
              sx={{ mb: 1, fontWeight: "bold" }}
              color="text.primary"
              gutterBottom
              variant="h6"
            >
              {name}
            </Typography>
            <Typography variant="body1" gutterBottom color="text.secondary">
              {moment.tz(createdAt, zone).format(" MMMM Do  YYYY")}
            </Typography>
            <Grid container spacing={1} sx={{ mt: "1rem" }}>
              <Grid item xs={4} md={2}>
                <Typography
                  sx={{ mb: 1.5, fontWeight: "bold" }}
                  color="text.primary"
                  gutterBottom
                  variant="body1"
                >
                  Description
                </Typography>
              </Grid>
              <Grid item xs={8} md={10}>
                <Typography
                  sx={{ mb: 1.5 }}
                  color="text.primary"
                  gutterBottom
                  variant="body1"
                >
                  {description}
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={4} md={2}>
                <Typography
                  sx={{ mb: 1.5, fontWeight: "bold" }}
                  color="text.primary"
                  gutterBottom
                  variant="body1"
                >
                  Intro Message
                </Typography>
              </Grid>
              <Grid item xs={8} md={10}>
                <Typography
                  sx={{ mb: 1.5 }}
                  color="text.primary"
                  gutterBottom
                  variant="body1"
                >
                  {introMsg}
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={4} md={2}>
                <Typography
                  sx={{ fontWeight: "bold" }}
                  color="text.primary"
                  gutterBottom
                  variant="body1"
                >
                  ThankYou Message
                </Typography>
              </Grid>
              <Grid item xs={8} md={10}>
                <Typography gutterBottom variant="body1">
                  <a dangerouslySetInnerHTML={{ __html: linkify() }} />
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Paper>
    </>
  );
};

export default QuestionnarieDetailCard;
