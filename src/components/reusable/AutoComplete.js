import { Autocomplete, TextField } from "@mui/material";

const AutoCompleteSelect = ({
  options,
  label,
  handleAutoCompleteChange,
  value,
  ...others
}) => {
  // console.log("Value : ",value)
  return (
    <Autocomplete
      disablePortal
      onChange={handleAutoCompleteChange}
      id="combo-box-questions-select"
      options={options}
      value={value?.label}
      isOptionEqualToValue={(option, value) => option.id === value?.id || option.id === value?.nextQuestion}
      fullWidth
      renderOption={(props, option) => {
        return (
          <li {...props} key={option.id}>
            {option.label}
          </li>
        );
      }}
    
      renderInput={(params) => (
        <TextField {...params} label={label} color="secondary" />
      )}
      {...others}
    />
  );
};

export default AutoCompleteSelect;
