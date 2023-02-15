import styled from "@emotion/styled";
import {
  Button,
  Grid,
  Tab,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
} from "@mui/material";
import React, { Suspense, useEffect, useState } from "react";
import withSuspense from "../../helpers/hoc/withSuspense";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Surveys from "../surveys";
import { LIST_SURVEYS } from "../../graphql/custom/queries";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";

const SMLocation = ({ smLocations, locationData }) => {
  const { loading, error, data } = useQuery(LIST_SURVEYS, {
    variables: {
      filter: { archived: { ne: true }, deleted: { ne: true } },
      limit: 100,
    },
  });


  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(10);

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
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
    "&:hover": {
      boxShadow: "3px 2px 5px 2px #888888",
    },
  }));

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const locationsSearch = locationData.filter(
    (item) =>
      item?.location
        .toString()
        .toLowerCase()
        .includes(smLocations.toString().toLowerCase()) ||
      item?.internalLocationID?.includes(smLocations) ||
      item?.locationEmail
        ?.toString()
        .toLowerCase()
        .includes(smLocations.toString().toLowerCase()) ||
      item?.locationPhone?.includes(smLocations)
  );

  if (!locationsSearch.length)
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
    <div>
      {locationsSearch?.length > 0 && (
        <TableContainer style={{overflow: "scroll"}}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>#</StyledTableCell>
                <StyledTableCell>Location ID</StyledTableCell>
                <StyledTableCell>Location</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
                <StyledTableCell>Phone Number</StyledTableCell>
                <StyledTableCell> View</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {locationsSearch
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((location, i) => (
                  <StyledTableRow key={i}         
>
                    <StyledTableCell component="th" scope="row">
                      {i + 1}
                    </StyledTableCell>
                    <StyledTableCell>
                      {location?.internalLocationID}
                    </StyledTableCell>
                    <StyledTableCell>{location?.location}</StyledTableCell>
                    <StyledTableCell>{location?.locationEmail}</StyledTableCell>
                    <StyledTableCell>{location?.locationPhone}</StyledTableCell>
                    <StyledTableCell>
                      <Button
                        size="small"
                        color="secondary"
                        component={Link}
                        to={`/surveyslocations/${location?.locationID}`}
                      >
                        <VisibilityOutlinedIcon color="inherit" />
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={locationsSearch?.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          />
        </TableContainer>
      )}
    </div>
  );

  //dfdf
};

export default withSuspense(SMLocation);
