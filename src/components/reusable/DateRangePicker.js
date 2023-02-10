import TextField from "@mui/material/TextField";
import { Button, Grid } from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const ResponsiveDateRangePicker = ({
  fromDate,
  setFromDate,
  endDate,
  setEndDate,
}) => {
  const handleDateReset = () => {
    setFromDate(null);
    setEndDate(null);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Grid
        container
        spacing={3}
        mb={2}
        // textAlign="center"
        // justifyContent="center"
      >
        <Grid item xs={5} cm={5} maxWidth="350px">
          <DatePicker
            timezone="America/New_York"
            label="From"
            value={fromDate}
            maxDate={endDate ? endDate : undefined}
            onChange={(event) => {
              setFromDate(event?._d);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </Grid>
        <Grid item xs={5} cm={5} maxWidth="350px">
          <DatePicker
            timezone="America/New_York"
            label="To"
            value={endDate}
            minDate={fromDate ? fromDate : undefined}
            onChange={(event) => {
              setEndDate(event?._d);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </Grid>
        <Grid
          item
          xs={2}
          cm={2}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Button
            variant="contained"
            size="small"
            color="secondary"
            onClick={handleDateReset}
          >
            Reset
          </Button>
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
};

export default ResponsiveDateRangePicker;
