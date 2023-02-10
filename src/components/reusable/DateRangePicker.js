import TextField from "@mui/material/TextField";
import { Button, Grid, IconButton } from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";

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
        spacing={1}
        mb={2}
        // textAlign="center"
        // justifyContent="center"
      >
        <Grid item xs={5} cm={5} md={5} maxWidth="350px">
          <DatePicker
            label="From"
            value={fromDate}
            maxDate={endDate ? endDate : undefined}
            onChange={(event) => {
              setFromDate(event?._d);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </Grid>
        <Grid item xs={5} cm={5} md={5} maxWidth="350px">
          <DatePicker
            label="To"
            value={endDate}
            minDate={fromDate ? fromDate : undefined}
            onChange={(event) => {
              setEndDate(event?._d);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </Grid>
        {(fromDate || endDate) && (
          <Grid
            item
            xs={2}
            cm={2}
            md={2}
            display="flex"
            justifyContent="start"
            alignItems="start"
          >
            {/* <Button
            variant="contained"
            size="small"
            color="secondary"
            onClick={handleDateReset}
          >
            Reset
          </Button> */}
            <IconButton
            sx={{p:0}}
              color="error"
              aria-label="mailsend"
              onClick={handleDateReset}
            >
              <HighlightOffOutlinedIcon fontSize="small" />
            </IconButton>
          </Grid>
        )}
      </Grid>
    </LocalizationProvider>
  );
};

export default ResponsiveDateRangePicker;
