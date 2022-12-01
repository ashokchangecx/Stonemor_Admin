import React from "react";
import { Link } from "react-router-dom";

import { Auth } from "aws-amplify";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import HomeIcon from "@material-ui/icons/Home";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MenuIcon from "@material-ui/icons/Menu";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import LinkIcon from "@material-ui/icons/Link";
import SelectAllIcon from "@material-ui/icons/SelectAll";
import PersonIcon from "@material-ui/icons/Person";
import PinDropIcon from "@material-ui/icons/PinDrop";
import StarHalfIcon from "@material-ui/icons/StarHalf";
import LanguageIcon from "@material-ui/icons/Language";
import PieChartIcon from "@material-ui/icons/PieChart";
import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles";
import MuiListItem from "@material-ui/core/ListItem";
import PollIcon from "@material-ui/icons/Poll";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
    flexShrink: 0,
  },
  appBar: {
    marginLeft: drawerWidth,
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    top: 64,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

const ListItem = withStyles({
  root: {
    "&$selected": {
      backgroundColor: "#5e8abf",
      color: "white",
      "& .MuiListItemIcon-root": {
        color: "white",
      },
    },
    "&:hover": {
      boxShadow: "3px 2px 5px 2px #888888",
    },

    "&$selected:hover": {
      backgroundColor: "#9db7d6",
      color: "white",
      "& .MuiListItemIcon-root": {
        color: "white",
      },
    },
    // "&:hover": {
    //   backgroundColor: "blue",
    //   color: "white",
    //   "& .MuiListItemIcon-root": {
    //     color: "white",
    //   },
    // },
  },
  selected: {},
})(MuiListItem);
const Admin = (props) => {
  const { container } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [userPoolId] = React.useState(Auth.userPool.userPoolId);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleListItemClick = (event, index) => {
    // event.preventDefault();

    setSelectedIndex(index);
  };

  function handleDrawerToggle() {
    setMobileOpen(!mobileOpen);
  }

  const drawer = (
    <div>
      <List>
        <ListItem
          button
          selected={selectedIndex === 0}
          onClick={(event) => handleListItemClick(event, 0)}
          component={Link}
          to={{
            pathname: "/",
            state: {
              userPoolId: userPoolId,
            },
          }}
        >
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem
          button
          selected={selectedIndex === 1}
          onClick={(event) => handleListItemClick(event, 1)}
          component={Link}
          to={{
            pathname: "/admin",
            state: {
              userPoolId: userPoolId,
            },
          }}
        >
          <ListItemIcon>
            <LanguageIcon />
          </ListItemIcon>
          <ListItemText primary="Surveys" />
        </ListItem>
        <ListItem
          button
          selected={selectedIndex === 2}
          onClick={(event) => handleListItemClick(event, 2)}
          component={Link}
          to="/admin/questionnaires"
        >
          <ListItemIcon>
            <QuestionAnswerIcon />
          </ListItemIcon>
          <ListItemText primary="Questionnaires" />
        </ListItem>
        <Divider />
        {/* <ListItem button component={Link} to="/admin/questions">
          <ListItemIcon>
            <ChatBubbleOutlineIcon />
          </ListItemIcon>
          <ListItemText primary="Questions" />
        </ListItem> */}
        <ListItem
          button
          selected={selectedIndex === 3}
          onClick={(event) => handleListItemClick(event, 3)}
          component={Link}
          to={{
            pathname: "/admin/users",
            state: {
              userPoolId: userPoolId,
            },
          }}
        >
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="Users" />
        </ListItem>
        <ListItem
          button
          selected={selectedIndex === 4}
          onClick={(event) => handleListItemClick(event, 4)}
          component={Link}
          to={{
            pathname: "/admin/location",
            state: {
              userPoolId: userPoolId,
            },
          }}
        >
          <ListItemIcon>
            <PinDropIcon />
          </ListItemIcon>
          <ListItemText primary="Location" />
        </ListItem>
        <ListItem
          button
          selected={selectedIndex === 5}
          onClick={(event) => handleListItemClick(event, 5)}
          component={Link}
          to="/admin/responses"
        >
          <ListItemIcon>
            <LinkIcon />
          </ListItemIcon>
          <ListItemText primary="Link Responses" />
        </ListItem>
        <ListItem
          button
          selected={selectedIndex === 6}
          onClick={(event) => handleListItemClick(event, 6)}
          component={Link}
          to="/admin/qrresponses"
        >
          <ListItemIcon>
            <SelectAllIcon />
          </ListItemIcon>
          <ListItemText primary="QR Responses" />
        </ListItem>
        <Divider />
        <ListItem
          button
          selected={selectedIndex === 7}
          onClick={(event) => handleListItemClick(event, 7)}
          component={Link}
          to="/admin/analytics"
        >
          <ListItemIcon>
            <PollIcon />
          </ListItemIcon>
          <ListItemText primary="Analytic Data" />
        </ListItem>
        <ListItem
          button
          selected={selectedIndex === 8}
          onClick={(event) => handleListItemClick(event, 8)}
          component={Link}
          to="/admin/ratingQuestion"
        >
          <ListItemIcon>
            <StarHalfIcon />
          </ListItemIcon>
          <ListItemText primary="Rating Analysis" />
        </ListItem>
        {/* <ListItem
          button
          component={Link}
          to={{
            pathname: "/admin/groups",
            state: {
              userPoolId: userPoolId,
            },
          }}
        >
          <ListItemIcon>
            <SupervisedUserCircleIcon />
          </ListItemIcon>
          <ListItemText primary="Groups" />
        </ListItem> */}
      </List>
    </div>
  );

  return (
    <div className={classes.root}>
      <div>
        <IconButton
          color="inherit"
          aria-label="Open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          className={classes.menuButton}
        >
          <MenuIcon />
        </IconButton>
      </div>
      <nav className={classes.drawer} aria-label="Admin Section">
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true,
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
    </div>
  );
};

export default Admin;
