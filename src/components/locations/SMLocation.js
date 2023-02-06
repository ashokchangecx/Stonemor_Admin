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
import { Loader } from "../common/Loader";
import CreateLocation from "./CreateLocation";
import BreadCrumbs from "../reusable/BreadCrumbs";
import DynamicModel from "../reusable/DynamicModel";
import SearchBar from "../reusable/SearchBar";
import withSuspense from "../../helpers/hoc/withSuspense";
import Locations from "../../pages/Locations";

// import axios from "axios";

const SMLocation = ({ smLocations }) => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const getAllData = async () => {
    setLoading(true);
    let url = "https://stonemor-jrni-zudy-mock-api.vercel.app/smlocation";
    let allData = [];
    let offset = 0;
    let limit = 100;
    while (true) {
      const response = await fetch(`${url}?$offset=${offset}&$limit=${limit}`);
      const data = await response.json();
      if (data?.items?.length === 0) {
        break;
      }
      allData = [...allData, ...data?.items];
      offset += limit;
    }

    setData(allData);
    setLoading(false);
    // return allData;
  };
  useEffect(() => {
    getAllData();
  }, []);
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
  const locationsSearch = data.filter(
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

  // useEffect(() => {
  //   const url =
  //     "https://stonemor-jrni-zudy-mock-api.vercel.app/smlocation?$limit=100";

  //   const fetchLocation = async () => {
  //     const response = await fetch(url);
  //     const res = await response.json();
  //     if (res?.items) {
  //       setData(res?.items);
  //     }
  //   };
  //   fetchLocation();
  // }, []);
  if (loading) {
    return <Loader />;
  }
  return (
    <div>
      {/* <Grid container spacing={2} sx={{ p: "0.5rem" }}>
              <Grid item xs={6}>
                <BreadCrumbs active="Locations" />
              </Grid>
              <Grid item xs={6}>
                <SearchBar
                  searchInput={(e) => locationsSearch(e.target.value)}
                />
              </Grid>
            </Grid> */}
      {locationsSearch.length > 0 ? (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>#</StyledTableCell>
                <StyledTableCell>Location ID</StyledTableCell>
                <StyledTableCell>Location</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
                <StyledTableCell>Phone Number</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {locationsSearch
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((location, i) => (
                  <StyledTableRow key={i}>
                    <StyledTableCell component="th" scope="row">
                      {i + 1}
                    </StyledTableCell>
                    <StyledTableCell>
                      {location?.internalLocationID}
                    </StyledTableCell>
                    <StyledTableCell>{location?.location}</StyledTableCell>
                    <StyledTableCell>{location?.locationEmail}</StyledTableCell>
                    <StyledTableCell>{location?.locationPhone}</StyledTableCell>
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
      ) : (
        <p>NO SURVEY LOCATION FOUND !</p>
      )}
    </div>
  );

  //dfdf
};

export default withSuspense(SMLocation);
