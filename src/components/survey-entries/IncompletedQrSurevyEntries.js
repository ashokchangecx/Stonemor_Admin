import {
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
import moment from "moment-timezone";
import React, { useEffect, useState } from "react";
import withSuspense from "../../helpers/hoc/withSuspense";
import { useQuery } from "@apollo/client";
import {
  LIST_INCOMPLETED_SURVEY_ENTRIES,
  LIST_QUESTIONNARIES_NAME,
} from "../../graphql/custom/queries";
import { Loader } from "../common/Loader";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
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
const IncompletedQrSurveyEntries = ({ incompleteQrSurvey, locationData }) => {
  const [incompeletedSurveyEntriesData, setIncompletedSurveyEntriesData] =
    useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  let zone = "America/New_York";

  let variables = {
    limit: 10000,
  };
  const {
    loading: listIncompletedSurveyEntriesLoading,
    error: listIncompletedSurveyEntriesError,
    data: listIncompletedSurveyEntriesData,
  } = useQuery(LIST_INCOMPLETED_SURVEY_ENTRIES, {
    variables,
  });
  const { data: questionariesName } = useQuery(LIST_QUESTIONNARIES_NAME);

  const onGettingQuestionnaireById = (id) => {
    const que = questionariesName?.listQuestionnaires?.items?.find(
      (q) => q?.id === id
    );

    return que?.name ?? id;
  };

  const onGettingLocationById = (id) => {
    const loc = locationData?.find((q) => q?.locationID === id);
    return loc?.location ?? id;
  };
  const incompleteQrEntries = incompeletedSurveyEntriesData
    ?.filter((data) => data?.LocationId)
    ?.filter(
      (item) =>
        onGettingLocationById(item?.LocationId)
          .toString()
          .toLowerCase()
          .includes(incompleteQrSurvey.toString().toLowerCase()) ||
        //    ||
        // item?.location?.inchargeEmail
        //   .toString()
        //   .toLowerCase()
        //   .includes(incompleteQrSurvey.toString().toLowerCase())
        onGettingQuestionnaireById(item?.questionnaireId)
          .toString()
          .toLowerCase()
          .includes(incompleteQrSurvey.toString().toLowerCase())
    );
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    if (
      !listIncompletedSurveyEntriesLoading &&
      !listIncompletedSurveyEntriesError
    )
      setIncompletedSurveyEntriesData(
        listIncompletedSurveyEntriesData?.listSurveyEntriess?.items
      );
  }, [
    listIncompletedSurveyEntriesLoading,
    listIncompletedSurveyEntriesData?.listSurveyEntriess?.items,
  ]);

  if (listIncompletedSurveyEntriesLoading) {
    return <Loader />;
  }
  if (listIncompletedSurveyEntriesError) {
    return <>error</>;
  }

  if (!incompleteQrEntries.length)
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
  return (
    <>
      {" "}
      {/* {linkResponses?.length > 0 && ( */}
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
              <StyledTableCell>Completed Status</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {incompleteQrEntries
              ?.sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user, u) => (
                <StyledTableRow key={u}>
                  <StyledTableCell>{u + 1}</StyledTableCell>
                  <StyledTableCell>
                    {" "}
                    {onGettingLocationById(user?.LocationId)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {user?.location?.locationEmail}
                  </StyledTableCell>

                  <StyledTableCell>
                    {" "}
                    {onGettingQuestionnaireById(user?.questionnaireId)}
                  </StyledTableCell>

                  <StyledTableCell>
                    {moment.tz(user?.startTime, zone).format("MM-DD-YYYY")}
                  </StyledTableCell>
                  <StyledTableCell>
                    {moment.tz(user?.startTime, zone).format("hh:mm a ")}
                  </StyledTableCell>

                  <StyledTableCell>{user?.complete}%</StyledTableCell>
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
          count={incompleteQrEntries?.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
      {/* )} */}
    </>
  );
};

export default withSuspense(IncompletedQrSurveyEntries);
