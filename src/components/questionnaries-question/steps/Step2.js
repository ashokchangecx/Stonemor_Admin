import { Divider } from "@mui/material";
import React, { useMemo, useState } from "react";
import AutoCompleteSelect from "../../reusable/AutoComplete";
import DependentAutocomplete from "../DependentAutocomplete";
import ListOptions from "../ListOptions";

const initialValue = {
  listValue: "",
  nextQuestion: "",
};

const Step2 = ({
  currentMode,
  type,
  handleAutoCompleteChange,
  questions,
  nexQuestionAU,
  dependentQuestion,
  dependentQuestionAU,
  handleSettingDependentNextQuestion,
  dependentQuestionOptionsAU,
  listItemOptions,
  setValues,
  getQuestionById,
}) => {
  const [listItem, setListItem] = useState(initialValue);

  const options = useMemo(
    () =>
      questions?.map((question) => ({
        id: question?.id,
        label: question?.order + ". " + question?.qu,
      })), 
    [questions]
  );

  const getDependentQuestionListOptions = () => {
    const question = questions?.find((que) => que?.id === dependentQuestion);
    const options = question?.listOptions?.map((l) => l?.listValue);
    return options ? options : [];
  };

  const handleAddingListItem = () => {
    setValues((prevState) => ({
      ...prevState,
      listItemOptions: [...prevState?.listItemOptions, listItem],
    }));
    setListItem(initialValue);
  };
  const handleRemovingListItem = (listValue) => {
    const filteredArray = listItemOptions?.filter(
      (item) => item?.listValue !== listValue
    );
    setValues((prevState) => ({
      ...prevState,
      listItemOptions: filteredArray,
    }));
  };
  return (
    <>
      {currentMode === "self" && type === "TEXT" && (
        <AutoCompleteSelect
          handleAutoCompleteChange={(event, newValue) => {
            handleAutoCompleteChange(newValue, "nextQuestion", "nexQuestionAU");
          }}
          value={nexQuestionAU}
          label="Next Question"
          options={options}
        />
      )}
      {currentMode === "dependent" && type === "TEXT" && (
        <DependentAutocomplete
          dependentQuestionOptionsAU={dependentQuestionOptionsAU}
          dependentQuestionListOptions={getDependentQuestionListOptions()}
          handleAutoCompleteChange={handleAutoCompleteChange}
          handleSettingDependentNextQuestion={
            handleSettingDependentNextQuestion
          }
          options={options}
          dependentQuestionAU={dependentQuestionAU}
        />
      )}
      {currentMode === "self" && type === "RADIO" && (
        <ListOptions
          showNextQuestion={true}
          options={options}
          setListItem={setListItem}
          getQuestionById={getQuestionById}
          handleAddingListItem={handleAddingListItem}
          handleRemovingListItem={handleRemovingListItem}
          listItem={listItem}
          listItemOptions={listItemOptions}
          currentMode={"self"}
        />
      )}
      {currentMode === "normal" &&
        (type === "RADIO" || type === "CHECKBOX") && (
          <ListOptions
            showNextQuestion={false}
            options={options}
            setListItem={setListItem}
            getQuestionById={getQuestionById}
            handleAddingListItem={handleAddingListItem}
            handleRemovingListItem={handleRemovingListItem}
            listItem={listItem}
            listItemOptions={listItemOptions}
            currentMode={"normal"}
          />
        )}
      {currentMode === "dependent" &&
        (type === "RADIO" || type === "CHECKBOX") && (
          <>
            <ListOptions
              showNextQuestion={false}
              options={options}
              setListItem={setListItem}
              getQuestionById={getQuestionById}
              handleAddingListItem={handleAddingListItem}
              handleRemovingListItem={handleRemovingListItem}
              listItem={listItem}
              listItemOptions={listItemOptions}
              currentMode={"dependent"}
            />
            <Divider
              sx={{
                my: 2,
              }}
            />
            <DependentAutocomplete
              dependentQuestionOptionsAU={dependentQuestionOptionsAU}
              dependentQuestionListOptions={getDependentQuestionListOptions()}
              handleAutoCompleteChange={handleAutoCompleteChange}
              handleSettingDependentNextQuestion={
                handleSettingDependentNextQuestion
              }
              options={options}
              dependentQuestionAU={dependentQuestionAU}
            />
          </>
        )}
      {currentMode === "self" && type === "CHECKBOX" && (
        <>
          <ListOptions
            showNextQuestion={false}
            options={options}
            setListItem={setListItem}
            getQuestionById={getQuestionById}
            handleAddingListItem={handleAddingListItem}
            handleRemovingListItem={handleRemovingListItem}
            listItem={listItem}
            listItemOptions={listItemOptions}
            currentMode={"self"}
          />
          <Divider sx={{ my: 2 }} />
          <AutoCompleteSelect
            handleAutoCompleteChange={(event, newValue) => {
              handleAutoCompleteChange(
                newValue,
                "nextQuestion",
                "nexQuestionAU"
              );
            }}
            value={nexQuestionAU}
            label="Next Question"
            options={options}
          />
        </>
      )}
    </>
  );
};

export default Step2;
