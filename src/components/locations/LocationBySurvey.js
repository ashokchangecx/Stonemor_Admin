import { useMutation, useQuery } from "@apollo/client";
import { Button, Card, CardContent, CardMedia, Grid } from "@mui/material";
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
  const [updateSurvey, { loading:updateLoading, error:updateError }] = useMutation(UPDATE_SURVEY, {
    query: LIST_SURVEYS,
    variables: {
      filter: { archived: { ne: true }, deleted: { ne: true } },
      limit: 100,
    },
  });
  const surveys = data?.listSurveys?.items;
  const [assignedSurveys, setAssignedSurveys] = useState([]);
  const [unAssignedSurveys, setUnAssignedSurveys] = useState([]);

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

  const handleClickValue =async (survey) => {
      const  {id,locations} = survey
      const payload = {
        id,
        locations:[...locations,locationId],
      }
      await updateSurvey({
        variables: { input: payload },
      })
  };

  if (loading) <Loader />;

  return (
    <Grid container spacing={2} alignItems="stretch" sx={{ p: "0.5rem" }}>
      <DynamicModel
        dialogTitle="Assign To Survey"
        open={open}
        toggle={toggleOpen}
        isClose
        maxWidth="2xl"
        isActions={false}
      >
        <Suspense fallback={<Loader />}>
          <Grid container spacing={2} xs={12}>
            {unAssignedSurveys?.map((survey, i) => (
              <Grid item xs={3} key={i}>
                <Button
                  style={{ position: "absolute" }}
                  onClick={()=>handleClickValue(survey)}
                >
                  +
                </Button>
                <SurveyCard survey={survey} showActions={false} />
              </Grid>
            ))}
          </Grid>
          <Grid></Grid>
        </Suspense>
      </DynamicModel>
      <Grid item container spacing={2}>
        <Button onClick={toggleOpen}>
          {" "}
          <Card
            sx={{
              height: "100%",
              mt: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <CardContent> Assign To Survey</CardContent>
          </Card>
        </Button>
        {assignedSurveys?.map((survey, i) => (
          <Grid xs={3} item key={i}>
            <SurveyCard
              survey={survey}
              sx={{ height: "100%" }}
              showActions={false}
            />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default LocationBySurveys;
