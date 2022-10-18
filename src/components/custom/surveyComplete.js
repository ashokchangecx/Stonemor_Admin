import React from "react";
import { withApollo } from "react-apollo";

import {
  createStyles,
  makeStyles,
  ThemeProvider,
  createTheme,
} from "@material-ui/core/styles";

import {
  IconButton,
  Paper,
  Typography,
  Container,
  Card,
  Box,
} from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

const styles = {
  paperContainer: {
    backgroundRepeat: "no-repeat",
    backgroundImage: `url('https://wallpaperaccess.com/full/1454447.jpg')`,
    backgroundSize: "cover",
    minHeight: "100vh",
  },
};
const useStyles = makeStyles((theme) =>
  createStyles({
    text: {
      marginTop: 100,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    media: {
      objectFit: "cover",
    },
    button: {
      margin: theme.spacing(2),
    },
    textcolor: {
      color: "#fafafa",
    },
    img: {
      width: 100,
      height: 100,
      marginLeft: "40%",
    },
  })
);
const theme = createTheme();

theme.typography.h3 = {
  fontSize: "1.2rem",
  "@media (min-width:600px)": {
    fontSize: "1.5rem",
    textAlign: "center",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "2rem",
  },
};

const SurveyComplete = (props) => {
  const classes = useStyles();

  return (
    <div style={styles.paperContainer}>
      <div>
        <IconButton
          className={classes.button}
          aria-label="Back"
          onClick={() => {
            props.history.push("/");
          }}
        >
          <ArrowBackIcon />
        </IconButton>
      </div>
      <div className={classes.text}>
        <Box>
          <img
            src="https://basis.net/wp-content/uploads/2021/10/house_plant_home.jpeg"
            className={classes.img}
            alt="img"
          />
          s
          <ThemeProvider theme={theme}>
            <Typography variant="h3" className={classes.textcolor}>
              Thankyou for Your Participation
            </Typography>
            <Typography variant="h3" className={classes.textcolor}>
              Your Survey is Completed
            </Typography>
          </ThemeProvider>
        </Box>
      </div>
    </div>
  );
};

export default withApollo(SurveyComplete);
