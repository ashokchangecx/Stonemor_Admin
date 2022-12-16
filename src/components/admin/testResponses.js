/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useRef, useState } from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  Box,
  Button,
  IconButton,
  InputBase,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  withStyles,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import SearchIcon from "@material-ui/icons/Search";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { listQuestionnaires, listSurveyEntriess } from "../../graphql/queries";
import { graphql, compose, withApollo } from "react-apollo";
import gql from "graphql-tag";
import { useQuery } from "../../helpers/useQuery";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.up("sm")]: {
      marginLeft: 240,
    },
    flexGrow: 1,
    overflow: "hidden",
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
  search: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: 400,
    marginBottom: 10,
  },
  searchInput: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
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
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};
const a11yProps = (index) => {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
};
const Loader = () => (
  <div>
    <CircularProgress />
  </div>
);
const testResponsesPort = (props) => {
  const classes = useStyles();
  const query = useQuery();
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const {
    data: { listSurveyEntriess },
  } = props.listSurveyEntriess;

  const {
    data: { listQuestionnaires },
  } = props.listQuestionnaires;

  const lrResId = query.get("Lrid");

  const filterResposnse = () => {
    if (lrResId) {
      return listSurveyEntriess?.items?.filter(
        (user) => user?.questionnaireId === lrResId
      );
    } else return listSurveyEntriess?.items;
  };
  const questionCount = filterResposnse()
    ?.filter((user) => user?.by?.name)
    ?.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const testLinkRes = questionCount?.filter(
    (user) => user?.testing === true && user?.responses?.items?.length > 0
  );

  console.log("testLinkRes", testLinkRes);

  const [search, setSearch] = useState("");

  const requestSearch = (searched) => {
    setSearch(
      testLinkRes?.filter(
        (item) =>
          item?.by?.name

            .toString()
            .toLowerCase()
            .includes(searched.toString().toLowerCase()) ||
          item?.by?.email

            .toString()
            .toLowerCase()
            .includes(searched.toString().toLowerCase())
      )
    );
  };
  // qr code responses//

  const locationID = query.get("lid");
  const qrResId = query.get("Qrid");

  const filterResposnseQr = () => {
    if (locationID) {
      return listSurveyEntriess?.items.filter(
        (user) => user?.location?.id === locationID
      );
    } else if (qrResId) {
      return listSurveyEntriess?.items.filter(
        (user) => user?.questionnaireId === qrResId
      );
    } else return listSurveyEntriess?.items;
  };

  const QrResponses = filterResposnseQr()
    ?.filter((user) => user?.location?.location)
    ?.sort(
      (a, b) =>
        new Date(b?.finishTime).getTime() - new Date(a?.finishTime).getTime()
    );

  const testQrRes = QrResponses?.filter(
    (user) => user?.testing === true && user?.responses?.items?.length > 0
  );

  const [searchQr, setSearchQr] = useState("");

  const requestSearchQr = (searched) => {
    setSearchQr(
      questionCount.filter(
        (item) =>
          item?.location?.location

            .toString()
            .toLowerCase()
            .includes(searched.toString().toLowerCase()) ||
          item?.by?.inchargeEmail

            .toString()
            .toLowerCase()
            .includes(searched.toString().toLowerCase())
      )
    );
  };

  const onGettingQuestionnaireById = (id) => {
    const que = listQuestionnaires?.items?.find((q) => q?.id === id);

    return que?.name ?? id;
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  // const questionCount = listans?.question?.items.sort(
  //   (a, b) => a?.order - b?.order
  // );

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  return (
    <div className={classes?.root}>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
      >
        <Tab label="Test Link Responses" {...a11yProps(0)} />
        <Tab label="Test QR Code responses" {...a11yProps(1)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <Box display="flex">
          <Box flexGrow={1} p={1}>
            {" "}
            {/* <Typography variant="h5">Test Survey Response </Typography> */}
          </Box>

          <Box p={0.5}>
            <Paper component="form" className={classes.search} elevation={5}>
              <InputBase
                className={classes.searchInput}
                placeholder="Search "
                inputProps={{ "aria-label": "search google maps" }}
                onInput={(e) => requestSearch(e.target.value)}
              />
              <IconButton className={classes.iconButton} aria-label="search">
                <SearchIcon />
              </IconButton>
            </Paper>
          </Box>
        </Box>
        {testLinkRes?.length > 0 && (
          <Paper className={classes.content} elevation={10}>
            <>
              <Table
                className={classes.table}
                stickyHeader
                aria-label="sticky table"
              >
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell>S.NO</StyledTableCell>
                    <StyledTableCell>Name</StyledTableCell>
                    <StyledTableCell>Email</StyledTableCell>

                    <StyledTableCell>Questionnaire</StyledTableCell>
                    <StyledTableCell>Start Time</StyledTableCell>
                    <StyledTableCell>Finish Time</StyledTableCell>

                    <StyledTableCell>Manage</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {(search?.length > 0 ? search : testLinkRes)
                    ?.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                    .map((user, u) => (
                      <StyledTableRow key={u}>
                        <StyledTableCell>{u + 1}</StyledTableCell>
                        <StyledTableCell>{user?.by?.name}</StyledTableCell>
                        <StyledTableCell>{user?.by?.email}</StyledTableCell>

                        <StyledTableCell>
                          {" "}
                          {onGettingQuestionnaireById(user?.questionnaireId)}
                        </StyledTableCell>

                        <StyledTableCell>
                          {moment(user?.startTime).format("DD-MM-YYYY hh:mm A")}
                        </StyledTableCell>
                        <StyledTableCell>
                          {moment(user?.finishTime).format(
                            "DD-MM-YYYY hh:mm A"
                          )}
                        </StyledTableCell>

                        <StyledTableCell>
                          <Button
                            size="small"
                            color="primary"
                            component={Link}
                            // to={`/surveyResponses/${user?.questionnaireId}?uid=${user?.by?.id}`}
                            to={`/surveyResponses/${user?.id}`}
                          >
                            <VisibilityIcon />
                          </Button>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={search?.length || testLinkRes?.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          </Paper>
        )}
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Box display="flex">
          <Box flexGrow={1} p={1}>
            {" "}
            {/* <Typography variant="h5">QR Code Response </Typography> */}
          </Box>

          <Box p={0.5}>
            <Paper component="form" className={classes.search} elevation={5}>
              <InputBase
                className={classes.searchInput}
                placeholder="Search "
                inputProps={{ "aria-label": "search google maps" }}
                onInput={(e) => requestSearchQr(e.target.value)}
              />
              <IconButton className={classes.iconButton} aria-label="search">
                <SearchIcon />
              </IconButton>
            </Paper>
          </Box>
        </Box>
        <Paper className={classes.content} elevation={10}>
          {testQrRes?.length > 0 && (
            <Table
              className={classes.table}
              stickyHeader
              aria-label="sticky table"
            >
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>S.NO</StyledTableCell>

                  <StyledTableCell>Location</StyledTableCell>
                  <StyledTableCell>Email</StyledTableCell>
                  <StyledTableCell>Questionnaire</StyledTableCell>
                  <StyledTableCell>Start Time</StyledTableCell>
                  <StyledTableCell>Finish Time</StyledTableCell>

                  <StyledTableCell>Manage</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {(searchQr?.length > 0 ? searchQr : testQrRes)
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user, u) => (
                    <StyledTableRow key={u}>
                      <StyledTableCell>{u + 1}</StyledTableCell>

                      <StyledTableCell>
                        {user?.location?.location}
                      </StyledTableCell>
                      <StyledTableCell>
                        {user?.location?.inchargeEmail}
                      </StyledTableCell>
                      <StyledTableCell>
                        {" "}
                        {onGettingQuestionnaireById(user?.questionnaireId)}
                      </StyledTableCell>

                      <StyledTableCell>
                        {moment(user?.startTime).format("DD-MM-YYYY hh:mm A")}
                      </StyledTableCell>
                      <StyledTableCell>
                        {moment(user?.finishTime).format("DD-MM-YYYY hh:mm A")}
                      </StyledTableCell>

                      <StyledTableCell>
                        <Button
                          size="small"
                          color="primary"
                          component={Link}
                          // to={`/surveyResponses/${user?.questionnaireId}?uid=${user?.by?.id}`}
                          to={`/surveyResponses/${user?.id}`}
                          // onClick={handleOpenDialog}
                        >
                          <VisibilityIcon />
                        </Button>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
              </TableBody>
            </Table>
          )}
          <TablePagination
            component="div"
            count={searchQr?.length || testQrRes?.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </TabPanel>
    </div>
  );
};
const Responses = compose(
  graphql(gql(listSurveyEntriess), {
    options: (props) => ({
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
    }),
    props: (props) => {
      return {
        listSurveyEntriess: props ? props : [],
      };
    },
  }),

  graphql(gql(listQuestionnaires), {
    options: (props) => ({
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
    }),
    props: (props) => {
      return {
        listQuestionnaires: props ? props : [],
      };
    },
  })
)(testResponsesPort);
export default Responses;
