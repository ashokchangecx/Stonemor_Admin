import { Grid, Tab, Tabs } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import BreadCrumbs from "../reusable/BreadCrumbs";
import SearchBar from "../reusable/SearchBar";
import Location from "./Locations";
import SMLocation from "./SMLocation";
import { useQuery } from "@apollo/client";
import { LIST_SURVEY_LOCATIONS } from "../../graphql/custom/queries";
import withSuspense from "../../helpers/hoc/withSuspense";
import { Loader } from "../common/Loader";
import useSmLocationData from "../../helpers/hooks/useSmLocationData";

const Locations = () => {
  const [tabValue, setTabValue] = useState(0);
  const [locationSearch, setLocationSearch] = useState("");
  const [Locationdata, setLocationData] = useState([]);
  const { loadingLocation, smLocations } = useSmLocationData();

  const {
    loading: listLocationLoading,
    error: listLocationError,
    data: listLocationdata,
  } = useQuery(LIST_SURVEY_LOCATIONS);
  const handleSetLocations = (locationsData) => {
    const {
      listSurveyLocations: { items },
    } = locationsData;
    if (items?.length > 0) setLocationData(items);
  };

  const locationsList = smLocations.filter(
    (user) => user?.responses?.items?.length !== 0
  );
console.log("smLocations",smLocations)

  useEffect(() => {
   
    if (!listLocationLoading && !listLocationError)
      handleSetLocations(listLocationdata);
   
  }, [listLocationLoading]);

  if (listLocationLoading || loadingLocation) {
    return   <>  {smLocations?.length <= 0 && <p  style={{display:"flex",justifyContent:"center",color:"red"}}>  Api CRM down</p>}</>
    ;
  }
  const TabPanel = (props) => {
    const { value, index, items, children, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <>
            {children}
            <Grid container spacing={2} alignItems="stretch">
              {items?.length > 0 &&
                items?.map((Item, i) => (
                  <Grid item xs={12} sm={6} key={i}>
                    {Item}
                  </Grid>
                ))}
            </Grid>
          </>
        )}
      </div>
    );
  };
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };
  return (
    <div>
      <div sx={{ mt: 2 }}>
        <Grid container spacing={2} sx={{ p: "0.5rem" }}>
          <Grid item xs={6}>
            <BreadCrumbs active="Locations" />
          </Grid>
          <Grid item xs={6}>
            <SearchBar searchInput={(e) => setLocationSearch(e.target.value)} />
          </Grid>
        </Grid>
      </div>
      {/* <Box
        sx={{
          width: "100%",
          bgcolor: "background.paper",
          mt: 2,
         
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleChange}
          textColor="primary"
          indicatorColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs "
          sx={{
            maxWidth: "100%",
            backgroundColor: "secondary.light",
            px: 3,
            borderRadius: 2,
            mb: 2,
          }}
        >
          <Tab label=" Location  " />
          <Tab label=" Stonemor Location " />
        </Tabs>
       
      </Box>
      <TabPanel value={tabValue} index={0}>
        <Location
          locations={locationSearch}
          locationsData={locationsList
            ?.slice()
            ?.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={1}> */}
      <SMLocation smLocations={locationSearch} locationData={smLocations} />
      {/* </TabPanel> */}
    </div>
  );
};

export default withSuspense(Locations);
