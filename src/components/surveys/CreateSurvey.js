import { useMutation } from "@apollo/client";
import {
  Alert,
  Autocomplete,
  Button,
  FormControl,
  Grid,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { CREATE_SURVEY } from "../../graphql/custom/mutations";
import { LIST_SURVEYS } from "../../graphql/custom/queries";

import withSuspense from "../../helpers/hoc/withSuspense";
import useForm from "../../helpers/hooks/useForm";
import useSmLocationData from "../../helpers/hooks/useSmLocationData";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";

const initialFormValues = {
  name: "",
  description: "",
  image:
    "https://dynamix-cdn.s3.amazonaws.com/stonemorcom/stonemorcom_616045937.svg",

  groups: "Users",
  archived: false,
  deleted: false,
};

const CreateSurvey = ({ toggle, surevy }) => {
  const [createSurvey, { loading }] = useMutation(CREATE_SURVEY, {
    refetchQueries: [
      {
        query: LIST_SURVEYS,
        variables: {
          filter: { archived: { ne: true }, deleted: { ne: true } },
          limit: 100,
        },
      },
    ],
  });
  const { values, handleInputChange } = useForm(initialFormValues);
  const [duplicate, setDuplicate] = useState(false);
  const [surveyDup, setSurveyDup] = useState("");
  const { loadingLocation, smLocations } = useSmLocationData();
  const [surveyLocation, setSuveyLocation] = useState([]);

  // const handleLocationChange = (e) => {
  //   setSuveyLocation(e.target.value);
  // };

  const handleSelectedLocationChange = (event, values) => {
    setSuveyLocation(values);
  };

  const getLocationData = (id) =>
    smLocations?.find((loc) => loc?.locationID === id);

  const handleChangeName = (e) => {
    handleInputChange(e);
    setDuplicate(false);
  };
  const handleRemoveValue = (valueToRemove) => {
    const updatedValues = surveyLocation.filter(
      (value) => value !== valueToRemove
    );
    setSuveyLocation(updatedValues);
  };
  const SurveyEntries = async (sname) => {
    let findEntries = surevy?.find(
      (s) => s?.name.toLowerCase() === sname.toLowerCase()
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
    Boolean(values.image) &&
    Boolean(surveyLocation?.length > 0);

  const onClickCreate = async () => {
    let dup = await SurveyEntries(values.name);
    if (dup) {
      setDuplicate(true);
      setSurveyDup(`${values.name} already Exists. Give another SurveyName `);
    } else {
      await createSurvey({
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
  return (
    <Box>
      {duplicate ? <Alert severity="error">{surveyDup}</Alert> : null}
      <Grid my={2} justifyContent="center">
        <Grid item xs={12} cm={6} my={2}>
          <TextField
            required
            id="standard-survey-name"
            label="Survey Name"
            variant="standard"
            color="secondary"
            name="name"
            fullWidth
            onChange={handleChangeName}
            value={values.name}
          />
        </Grid>
        <Grid item xs={12} cm={6} my={2}>
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
        <Grid item xs={12} cm={6} my={2}>
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
        <Grid item xs={12} cm={6} my={2}>
          {/* <FormControl fullWidth margin="dense">
            <InputLabel>Link Location</InputLabel>

            <Select
              multiple
              margin="dense"
              fullWidth
              variant="standard"
              color="secondary"
              value={surveyLocation}
              onChange={(e) => {
                setSuveyLocation(e.target.value);
              }}
            >
              {smLocations?.map((loc, s) => (
                <MenuItem key={s} value={loc?.locationID}>
                  {loc?.location}
                </MenuItem>
              ))}
            </Select>
            {surveyLocation?.length > 0 && (
              <>
                {" "}
                <Typography>
                  {" "}
                  Linked {surveyLocation?.length} Location
                </Typography>
                <Grid container spacing={2} pl={2}>
                  {surveyLocation?.map((loc, i) => (
                    <Grid item xs={6} key={i}>
                      {" "}
                      <ul>
                        <li>
                          {" "}
                          {getLocationData(loc)?.location}
                          <IconButton
                            sx={{ p: 0 }}
                            color="error"
                            aria-label="mailsend"
                            onClick={() => handleRemoveValue(loc)}
                          >
                            <HighlightOffOutlinedIcon fontSize="small" />
                          </IconButton>
                        </li>
                      </ul>{" "}
                    </Grid>
                  ))}
                </Grid>
              </>
            )}
          </FormControl> */}

          <Autocomplete
            multiple
            id="tags-outlined"
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
          />
        </Grid>
      </Grid>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 2,
        }}
        spacing={2}
        my={2}
      >
        <Button onClick={toggle} variant="text" color="info">
          Close
        </Button>
        {!loading ? (
          <Button
            onClick={onClickCreate}
            variant="contained"
            color="primary"
            disabled={!enableButton}
          >
            Create
          </Button>
        ) : (
          <Button variant="contained" color="primary" disabled>
            Creating ....
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default withSuspense(CreateSurvey);
