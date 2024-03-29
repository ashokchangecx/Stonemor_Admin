import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { styled } from "@mui/system";
import React, { useState } from "react";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import withSuspense from "../../helpers/hoc/withSuspense";
import moment from "moment-timezone";
import { Link } from "react-router-dom";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 13,
  },
}));
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:hover": {
    boxShadow: "3px 2px 5px 2px #888888",
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const TestQrSurveyEntries = ({
  surveyEntries,
  questionnaries,
  testQrSurvey,
  locationData,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  let zone = "America/New_York";
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const onGettingQuestionnaireById = (id) => {
    const que = questionnaries?.listQuestionnaires?.items?.find(
      (q) => q?.id === id
    );

    return que?.name ?? id;
  };

  const onGettingLocationById = (id) => {
    const loc = locationData?.find((q) => q?.locationID === id);
    return loc?.location ?? id;
  };

  const TestQrSurveyEntriesData = surveyEntries?.filter(
    (item) =>
      onGettingLocationById(item?.LocationId)
        ?.toString()
        .toLowerCase()
        .includes(testQrSurvey.toString().toLowerCase()) ||
      // item?.location?.inchargeEmail
      //   .toString()
      //   .toLowerCase()
      //   .includes(testQrSurvey.toString().toLowerCase()) ||
      onGettingQuestionnaireById(item?.questionnaireId)
        .toString()
        .toLowerCase()
        .includes(testQrSurvey.toString().toLowerCase())
  );
  if (!TestQrSurveyEntriesData.length)
    return (
      <p
        style={{
          textAlign: "center",
          marginTop: "20px",
        }}
      >
        No Search Results Found
      </p>
    );
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      {" "}
      {TestQrSurveyEntriesData?.length > 0 && (
        <TableContainer component={Paper}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>S.NO</StyledTableCell>

                <StyledTableCell>Location</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
                <StyledTableCell>Question Pools</StyledTableCell>
                <StyledTableCell>Date</StyledTableCell>
                <StyledTableCell>Time</StyledTableCell>
                <StyledTableCell>Duration</StyledTableCell>
                <StyledTableCell>View</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {TestQrSurveyEntriesData?.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
              )?.map((res, u) => (
                <StyledTableRow key={u}>
                  <StyledTableCell>{u + 1}</StyledTableCell>
                  <StyledTableCell>
                    {onGettingLocationById(res?.LocationId)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {res?.location?.locationEmail}
                  </StyledTableCell>
                  <StyledTableCell>
                    {onGettingQuestionnaireById(res?.questionnaireId)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {moment.tz(res?.startTime, zone).format("MM-DD-YYYY")}
                  </StyledTableCell>
                  <StyledTableCell>
                    {moment.tz(res?.startTime, zone).format("hh:mm a ")}
                  </StyledTableCell>
                  <StyledTableCell>
                    {" "}
                    {moment(res?.finishTime).diff(
                      moment(res?.startTime),
                      "seconds"
                    )}{" "}
                    {"sec"}
                  </StyledTableCell>
                  <StyledTableCell>
                    <Button
                      size="small"
                      color="secondary"
                      component={Link}
                      to={`/surveyEntries/${res.id}`}
                    >
                      <VisibilityOutlinedIcon color="inherit" />
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>

          <TablePagination
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
            component="div"
            count={TestQrSurveyEntriesData?.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      )}
    </>
  );
};

export default withSuspense(TestQrSurveyEntries);
