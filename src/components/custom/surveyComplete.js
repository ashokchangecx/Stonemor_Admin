import React from "react";
import { withApollo } from "react-apollo";
import logo from "../../assets/MemorialPlanning - Wide - Tag - 4C (2) (1).png";
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
  Box,
  AppBar,
  Toolbar,
} from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

const styles = {
  paperContainer: {
    backgroundRepeat: "no-repeat",
    // backgroundImage: `url('https://basis.net/wp-content/uploads/2021/10/house_plant_home.jpeg')`,
    backgroundSize: "cover",
    minHeight: "100vh",
  },
};

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      overflow: "hidden",
      marginLeft: 220,
      marginTop: 10,
      // padding: theme.spacing(0, 3),s
    },
    button: {
      margin: theme.spacing(2),
    },
    logo: {
      maxWidth: 300,
      paddingTop: 2,
    },
    text: {
      marginTop: 100,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    img: {
      width: 100,
      height: 100,
    },
    textcolor: {
      // color: "#fafafa",
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
    <div className={classes.root}>
      <div style={styles.paperContainer}>
        {/* <AppBar position="sticky" style={{ backgroundColor: "#fff" }}>
          <Toolbar>
            <img src={logo} alt="logo" className={classes.logo} />
          </Toolbar>
        </AppBar> */}
        <div className={classes.text}>
          <Box
            sx={{ width: "300", height: "300", padding: "5px 40px" }}
            alignItems="center"
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src="https://www.freeiconspng.com/thumbs/success-icon/success-icon-10.png"
                className={classes.img}
                alt="success"
              />
            </div>

            <ThemeProvider theme={theme}>
              <Typography variant="h3" className={classes.textcolor}>
                Thank you for completing our survey. If you have requested a
                follow up,someone will be in touch with you soon.
              </Typography>
            </ThemeProvider>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default withApollo(SurveyComplete);
