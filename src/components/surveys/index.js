import { useQuery } from "@apollo/client";
import { Grid, Pagination } from "@mui/material";
import { lazy, Suspense, useEffect, useState } from "react";
import { LIST_SURVEYS } from "../../graphql/custom/queries";
import useToggle from "../../helpers/hooks/useToggle";
import { Loader } from "../common/Loader";

import CreateCard from "../reusable/CreateCard";
import DynamicModel from "../reusable/DynamicModel";
import withSuspense from "../../helpers/hoc/withSuspense";
import SurveyCard from "./SurveyCard";
import usePagination from "../../helpers/hooks/usePagination";
import { Box } from "@mui/system";
import SearchBar from "../reusable/SearchBar";
import BreadCrumbs from "../reusable/BreadCrumbs";

const CreateSurvey = lazy(() =>
  import("../../components/surveys/CreateSurvey")
);
const Surveys = () => {
  const { open, toggleOpen } = useToggle();
  const { loading, error, data } = useQuery(LIST_SURVEYS, {
    variables: {
      filter: { archived: { ne: true }, deleted: { ne: true } },
      limit: 100,
    },
  });

  const [surveys, setSurveys] = useState([]);
  const [surveySearch, setSurveySearch] = useState("");
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;
  const surveysList = surveys
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

  useEffect(() => {
    if (!loading && !error) setSurveys(data?.listSurveys?.items);
  }, [loading, data?.listSurveys?.items]);

  if (loading) {
    return <Loader />;
  }
  if (error) {
    return <>error</>;
  }

  return (
    <div>
      <DynamicModel
        dialogTitle="Create Survey"
        open={open}
        toggle={toggleOpen}
        isClose
        maxWidth="md"
        isActions={false}
      >
        <Suspense fallback={<Loader />}>
          <CreateSurvey toggle={toggleOpen} surevy={surveys} />
        </Suspense>
      </DynamicModel>
      <Grid container spacing={2} sx={{ py: "0.5rem" }}>
        <Grid item xs={6}>
          <BreadCrumbs active="Surveys" />
        </Grid>
        <Grid item xs={6}>
          <SearchBar searchInput={(e) => setSurveySearch(e.target.value)} />
        </Grid>
      </Grid>

      {surveys.length > 0 ? (
        <>
          <Grid container spacing={2} alignItems="stretch" sx={{ p: "0.5rem" }}>
            <Grid item xs={12} cm={6} md={4}>
              <CreateCard title="Create Survey" onClick={toggleOpen} />
            </Grid>
            {_DATA?.currentData()?.map((survey, i) => (
              <Grid item xs={12} cm={6} md={4} key={i}>
                <SurveyCard survey={survey} sx={{ height: "100%" }} />
              </Grid>
            ))}
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
      ) : (
        <p>No surveys found</p>
      )}
    </div>
  );
};

export default withSuspense(Surveys);
