import { useMutation, useQuery } from "@apollo/client";
import {
  Alert,
  Autocomplete,
  Button,
  Chip,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { UPDATE_SURVEY } from "../../graphql/custom/mutations";
import { LIST_SURVEYS } from "../../graphql/custom/queries";
import withSuspense from "../../helpers/hoc/withSuspense";
import useForm from "../../helpers/hooks/useForm";
import useSmLocationData from "../../helpers/hooks/useSmLocationData";
import { Loader } from "../common/Loader";

const UpdateSurvey = ({ toggle, initialFormValues }) => {
  const { loadingLocation, smLocations } = useSmLocationData();
  const { values, handleInputChange } = useForm(initialFormValues);
  const [updateSurvey, { loading, error }] = useMutation(UPDATE_SURVEY, {
    query: LIST_SURVEYS,
    variables: {
      filter: { archived: { ne: true }, deleted: { ne: true } },
      limit: 100,
    },
  });
  const { data } = useQuery(LIST_SURVEYS);
  const surveyUpdateData = data?.listSurveys?.items?.filter(
    (item) => item?.id === values?.id
  );
  const currentLocationList =
    surveyUpdateData?.length > 0 ? surveyUpdateData[0]?.locations : [];

  const defaultLocations = smLocations?.filter((obj) =>
    currentLocationList?.includes(obj.locationID)
  );

  const [surveyLocation, setSuveyLocation] = useState([]);
  const surveyData = data?.listSurveys?.items.filter(
    (item) => item?.id !== values?.id
  );

  const [duplicate, setDuplicate] = useState(false);
  const [surveyDup, setSurveyDup] = useState("");

  const handleUpdateSurveyName = (e) => {
    handleInputChange(e);
    setDuplicate(false);
  };

  const handleSelectedLocationChange = (event, values) => {
    setSuveyLocation(values);
  };
  const getLocationData = (id) =>
    smLocations?.find((loc) => loc?.locationID === id);

  const handleSelectChange = (event) => {
    setSuveyLocation(event.target.value);
  };
  const handleRemoveValue = (valueToRemove) => {
    const updatedValues = surveyLocation.filter(
      (value) => value !== valueToRemove
    );
    setSuveyLocation(updatedValues);
  };
  const SurveyEntriesUpdate = async () => {
    let findEntries = surveyData?.find(
      (s) => s?.name.toLowerCase() === values.name.toLowerCase()
    );
    if (findEntries) {
      return true;
    } else {
      return false;
    }
  };
  const enableButton =
    Boolean(values.name) &&
    Boolean(values.description) &&
    Boolean(values.image);

  const onClickUpdate = async () => {
    let dup = await SurveyEntriesUpdate();
    if (dup) {
      setDuplicate(true);
      setSurveyDup(`${values.name} already Exists. Give another SurveyName `);
    } else {
      await updateSurvey({
        variables: {
          input: {
            ...values,
            locations: surveyLocation?.map((item) => item?.locationID),
          },
        },
      });
      toggle();
    }
  };
  useEffect(() => {
    if (loading) {
      setSuveyLocation(surveyData?.locations || []);
    }
  }, [loading]);

  useEffect(() => {
    setSuveyLocation(defaultLocations);
  }, [defaultLocations?.length > 0]);

  return (
    <Box>
      {duplicate ? <Alert severity="error">{surveyDup}</Alert> : null}
      <Grid my={2} justifyContent="center">
        <Grid item xs={12} my={2}>
          <TextField
            required
            id="standard-user-name"
            label="Survey Name"
            variant="standard"
            color="secondary"
            name="name"
            fullWidth
            onChange={handleUpdateSurveyName}
            value={values.name}
          />
        </Grid>
        <Grid item xs={12} my={2}>
          <TextField
            required
            id="standard-description"
            label="Description"
            variant="standard"
            color="secondary"
            name="description"
            fullWidth
            onChange={handleInputChange}
            value={values.description}
          />
        </Grid>
        <Grid item xs={12} my={2}>
          <TextField
            required
            id="standard-image"
            label="Image"
            variant="standard"
            color="secondary"
            name="image"
            fullWidth
            onChange={handleInputChange}
            value={values.image}
          />
        </Grid>
      </Grid>
      <Grid item xs={12} my={2}>
        {/* {defaultLocations?.length ? ( */}
        <Autocomplete
          multiple
          id="locations"
          options={smLocations}
          getOptionLabel={(option) => option?.location}
          onChange={handleSelectedLocationChange}
          filterSelectedOptions
          value={surveyLocation}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Link Location"
              placeholder="Location"
            />
          )}
          renderOption={(props, option) => {
            return (
              <li {...props} key={option.locationID}>
                {option.location}
              </li>
            );
          }}
        />
        {/* ) : (
          <Loader />
        )} */}
      </Grid>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Button onClick={toggle} variant="text" color="info">
          Close
        </Button>
        {!loading ? (
          <Button
            onClick={onClickUpdate}
            variant="contained"
            color="primary"
            disabled={!enableButton}
          >
            Update
          </Button>
        ) : (
          <Button variant="contained" color="primary" disabled>
            Updating ....
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default withSuspense(UpdateSurvey);
