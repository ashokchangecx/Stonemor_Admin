import {
  Autocomplete,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import AutoCompleteSelect from "../reusable/AutoComplete";

const ListOptions = ({
  listItem,
  setListItem,
  options,
  handleAddingListItem,
  handleRemovingListItem,
  listItemOptions,
  showNextQuestion,
  getQuestionById,
  currentMode,
}) => {
  // console.log("options : ",options)
  return (
    <Grid container rowGap={3} columnGap={1} alignItems="center">
      <Grid item xs={12} md={4}>
        <TextField
          required
          id="list-item"
          label="List Item"
          value={listItem?.listValue}
          variant="standard"
          color="secondary"
          onChange={(e) =>
            setListItem({ ...listItem, listValue: e.target.value })
          }
          fullWidth
        />
      </Grid>
      {showNextQuestion && (
        <Grid item xs={12} md={6}>
          {/* <AutoCompleteSelect
            handleAutoCompleteChange={(event, newValue) => {
              setListItem({ ...listItem, nextQuestion: newValue?.id });
            }}
            options={options}
            value={listItem}
            label="Next Question"
          /> */}
          
          <Autocomplete
      disablePortal
      onChange={(event, newValue) => {
        setListItem({ ...listItem, nextQuestion: newValue?.id });
      }}
      id="combo-box-questions-select-ioo"
      options={options}
      value={listItem?.listValue}
      isOptionEqualToValue={(option, value) =>  option.id === value?.nextQuestion}
      getOptionLabel={(option)=> option.label || ""}
      fullWidth
      renderOption={(props, option) => {
        return (
          <li {...props} key={option.id}>
            {option.label}
          </li>
        );
      }}
    
      renderInput={(params) => (
        <TextField {...params} label="Next Question" color="secondary" />
      )}
    />


        </Grid>
      )}
      <Grid item xs={12} md={1} textAlign="center">
        <Button
          variant="contained"
          color="secondary"
          onClick={handleAddingListItem}
          disabled={!listItem?.listValue}
        >
          Add
        </Button>
      </Grid>
      {listItemOptions?.length > 0 && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Option </TableCell>
              {currentMode === "self" && showNextQuestion && (
                <TableCell>Next Question (self)</TableCell>
              )}

              <TableCell sx={{ textAlign: "center" }}>Remove</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listItemOptions.map((item, i) => (
              <TableRow key={i}>
                <TableCell>{item?.listValue}</TableCell>
                {showNextQuestion && (
                  <TableCell>{getQuestionById(item?.nextQuestion)}</TableCell>
                )}
                <TableCell sx={{ textAlign: "center" }}>
                  <Button
                    size="small"
                    onClick={() => handleRemovingListItem(item?.listValue)}
                  >
                    <HighlightOffOutlinedIcon color="error" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Grid>
  );
};
export default ListOptions;
