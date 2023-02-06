import { Grid, Tab, Tabs } from '@mui/material'
import { Box } from '@mui/system'
import React, { useState } from 'react'
import BreadCrumbs from '../reusable/BreadCrumbs'
import SearchBar from '../reusable/SearchBar'
import Location from './Locations'
import SMLocation from './SMLocation'

const Locations = () => {
  const [tabValue, setTabValue] = useState(0);
  const [locationSearch, setLocationSearch] = useState("");


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
            <BreadCrumbs active=" Survey Entries" />
          </Grid>
          <Grid item xs={6}>
            <SearchBar searchInput={(e) => setLocationSearch(e.target.value)} />
          </Grid>
        </Grid>
      </div>
      <Box
        sx={{
          width: "100%",
          bgcolor: "background.paper",
          mt: 2,
          // display: "flex",
          // justifyContent: "flex-start",
          // alignItems: "center",
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
          <Tab label=" SM Location " />
         
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
      
        <Location locations={locationSearch}/>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
      
        <SMLocation smLocations={locationSearch}/>
      </TabPanel>
    </div>
  )
}

export default Locations