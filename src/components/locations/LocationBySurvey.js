import { useMutation, useQuery } from "@apollo/client";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Pagination,
} from "@mui/material";
import { lazy, Suspense, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UPDATE_SURVEY } from "../../graphql/custom/mutations";
import { LIST_SURVEYS } from "../../graphql/custom/queries";
import useToggle from "../../helpers/hooks/useToggle";

import { Loader } from "../common/Loader";
import CreateButton from "../reusable/CreateButton";
import CreateCard from "../reusable/CreateCard";
import DynamicModel from "../reusable/DynamicModel";
import SurveyCard from "../surveys/SurveyCard";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import BreadCrumbs from "../reusable/BreadCrumbs";
import SearchBar from "../reusable/SearchBar";
import usePagination from "@mui/material/usePagination/usePagination";
import { Box } from "@mui/system";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import LocationSurveyCard from "./LocationSurveyCard";
const LocationBySurveys = () => {
  const params = useParams();
  const locationId = params.id;
  const { loading, error, data } = useQuery(LIST_SURVEYS, {
    variables: {
      filter: {
        archived: { ne: true },
        deleted: { ne: true },
        // locations: { contains: locationId },
      },
      limit: 100,
    },
  });
  const [updateSurvey, { loading: updateLoading, error: updateError }] =
    useMutation(UPDATE_SURVEY, {
      query: LIST_SURVEYS,
      variables: {
        filter: { archived: { ne: true }, deleted: { ne: true } },
        limit: 100,
      },
    });
  const surveys = data?.listSurveys?.items;
  const [assignedSurveys, setAssignedSurveys] = useState([]);
  const [unAssignedSurveys, setUnAssignedSurveys] = useState([]);
  const [surveySearch, setSurveySearch] = useState("");
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;

  const { open, toggleOpen } = useToggle();

  useEffect(() => {
    if (surveys?.length > 0) {
      let tempAssignedSurveys = [];
      let tempUnAssignedSurveys = [];
      surveys.map((survey) => {
        const isAssigned = survey?.locations?.includes(locationId);
        isAssigned
          ? tempAssignedSurveys.push(survey)
          : tempUnAssignedSurveys.push(survey);
      });
      setAssignedSurveys(tempAssignedSurveys);
      setUnAssignedSurveys(tempUnAssignedSurveys);
    }

    return () => null;
  }, [surveys]);

  const handleAddSurvey = async (survey) => {
    const { id, locations } = survey;
    const payload = {
      id,
      locations: [...locations, locationId],
    };
    await updateSurvey({
      variables: { input: payload },
    });
  };

  const surveysList = assignedSurveys
    ?.filter((item) =>
      item?.name
        .toString()
        .toLowerCase()
        .includes(surveySearch.toString().toLowerCase())
    )
    ?.slice()
    ?.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  const _DATA = usePagination(surveysList, PER_PAGE);
  const count = Math.ceil(surveysList?.length / PER_PAGE);
  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };
  const handleRemoveSurvey = async (survey) => {
    const { id, locations } = survey;
    const payload = {
      id,
      locations: locations?.filter((loc) => loc !== locationId),
    };
    await updateSurvey({
      variables: { input: payload },
    });
  };

  if (loading) <Loader />;
  return (
    <>
      <DynamicModel
        dialogTitle="Assign Survey"
        open={open}
        toggle={toggleOpen}
        isClose
        maxWidth="2xl"
        isActions={false}
      >
        <Suspense fallback={<Loader />}>
          <Grid container spacing={2} xs={12}>
            {unAssignedSurveys?.map((survey, i) => (
              <Grid item xs={12} md={3} key={i} sx={{ position: "relative" }}>
                <AddCircleOutlineOutlinedIcon
                  sx={{
                    color: "green",
                    position: "absolute",
                    top: 20,
                    right: 4,
                    fontWeight: "bold",
                    backgroundColor: "transparent",
                    ":hover": {
                      color: "#78f069",
                    },
                  }}
                  onClick={() => handleAddSurvey(survey)}
                  title="Assign Survey"
                />

                <LocationSurveyCard
                  survey={survey}
                  showActions={false}
                  locationId={locationId}
                  unAssignedSurveys={unAssignedSurveys}
                />
              </Grid>
            ))}
          </Grid>
          <Grid></Grid>
        </Suspense>
      </DynamicModel>
      <Grid container spacing={2} sx={{ py: "0.5rem" }}>
        <Grid item xs={6}>
          <BreadCrumbs
            paths={[
              {
                name: "Locations",
                to: "/locations",
              },
            ]}
            active="Location Surveys"
          />{" "}
        </Grid>
        <Grid item xs={6}>
          <SearchBar searchInput={(e) => setSurveySearch(e.target.value)} />
        </Grid>
      </Grid>
      <Grid container spacing={2} alignItems="stretch" sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid xs={12} md={3} item>
            {" "}
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                cursor: "pointer",
                ":hover": {
                  backgroundColor: "transparent",
                },
              }}
              onClick={toggleOpen}
            >
              <AddCircleOutlineOutlinedIcon
                sx={{
                  height: "45%",
                  width: 90,
                  ":hover": {
                    color: "rgb(106, 163, 66)",
                  },
                }}
              />

              <CardContent style={{ fontWeight: "bold" }}>
                {" "}
                Assign Survey
              </CardContent>
            </Card>
          </Grid>
          {surveysList?.map((survey, i) => (
            <Grid xs={12} md={3} item key={i} sx={{ position: "relative" }}>
              <RemoveCircleOutlineIcon
                sx={{
                  color: "#fc0d00",
                  position: "absolute",
                  top: 20,
                  right: 4,
                  fontWeight: "bold",
                  ":hover": {
                    color: "#b83832",
                  },
                }}
                onClick={() => handleRemoveSurvey(survey)}
                title="Remove Survey"
              />
              <LocationSurveyCard
                survey={survey}
                sx={{ height: "100%" }}
                showActions={true}
                locationId={locationId}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Box display="flex" justifyContent="end" my={2}>
        <Pagination
          count={count}
          size="large"
          page={page}
          color="primary"
          variant="outlined"
          shape="rounded"
          onChange={handleChange}
        />
      </Box>
    </>
  );
};

export default LocationBySurveys;
