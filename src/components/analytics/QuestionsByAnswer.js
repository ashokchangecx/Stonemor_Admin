import { Grid, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import AutoCompleteSelect from "../reusable/AutoComplete";
import { useLazyQuery, useQuery } from "@apollo/client";
import {
  GET_QUESTIONNAIRES,
  LIST_RESPONSESS,
} from "../../graphql/custom/queries";
import { Box } from "@mui/system";
import { Loader } from "../common/Loader";
import Progress_bar from "../charts/load";

const QuestionsByAnswer = ({ questionariesName }) => {
  const [get_questionnarie, { called, loading, data: currentQuestionnarie }] =
    useLazyQuery(GET_QUESTIONNAIRES);
  const { data: responsess, loading: listResponsessLoading } = useQuery(
    LIST_RESPONSESS,
    {
      variables: {
        limit: 100000,
      },
    }
  );

  const [questionariesValue, setQuestionariesValue] = useState(null);
  const [questionValue, setQuestionValue] = useState(null);
  const [loadingQuestion, setLoadingQuestion] = useState(true);

  const Rating = {
    1: "😟 - Very Dissatisfied",
    2: "🙁 - Dissatisfied",
    3: "😐 - neutral",
    4: "🙂 - Satisfied ",
    5: "😊 - Very Satisfied",
  };

  const options = useMemo(
    () =>
      questionariesName?.listQuestionnaires?.items?.map((question) => ({
        id: question?.id,
        label: question?.name,
      })),
    [questionariesName]
  );
  const questions = currentQuestionnarie?.getQuestionnaire?.question?.items;
  const questionOptions = questions
    ?.filter((q) => q?.type === "RADIO" || q?.type === "LIST")
    ?.map((question) => ({
      id: question?.id,
      label: question?.qu,
      listOptions: question?.listOptions,
      type: question?.type,
    }));

  const questionAnswers = responsess?.listResponsess?.items;

  useEffect(() => {
    setLoadingQuestion(true);
    setQuestionValue(null);
    if (questionariesValue) {
      get_questionnarie({
        variables: {
          id: questionariesValue,
        },
      });
    }
    setLoadingQuestion(false);
    return () => {};
  }, [questionariesValue]);

  const filterChartData = questionAnswers?.filter(
    (q) => q?.qu?.id === questionValue?.id
  );
  const chartData = filterChartData?.reduce((chartData, { res }) => {
    const x = res || "no";
    const y = (chartData[x]?.y || 0) + 1;
    const loc = {
      x,
      y,
    };
    chartData[x] = loc;

    return chartData;
  }, {});

  const total = filterChartData?.length;

  if (loadingQuestion) {
    <Loader />;
  }

  const calculatePercentage = (chartData) => {
    return (chartData["y"] / total) * 100;
  };

  return (
    <Box>
      <Grid container spacing={2} p={1}>
        <Grid item md={4} xs={12}>
          <AutoCompleteSelect
            handleAutoCompleteChange={(e, v) => setQuestionariesValue(v?.id)}
            label="Questionaries"
            options={options}
          />
        </Grid>
        <Grid item md={8} xs={12}>
          {called && loading ? (
            <Loader />
          ) : (
            questionOptions?.length > 0 && (
              <AutoCompleteSelect
                handleAutoCompleteChange={(e, v) => setQuestionValue(v)}
                label="Questions"
                options={questionOptions}
              />
            )
          )}
        </Grid>
      </Grid>
      {listResponsessLoading ? (
        <Loader />
      ) : (
        <>
          {" "}
          {questionValue?.id && (
            <Typography mt={2} pl={2} color="primary.main" variant="h6">
              Q. {questionValue?.label}
            </Typography>
          )}
          {questionValue?.id && (
            <Box pl={2}>
              <>
                {Object.entries(chartData).map(([key, value], i) => (
                  <div key={i}>
                    {" "}
                    {total > 0 ? (
                      <div key={key}>
                        <Grid pl={2}>
                          {" "}
                          <ul>
                            <li
                              style={{
                                fontWeight: "bold",
                              }}
                            >
                              {questionValue.type === "LIST" ? (
                                <> {Rating[key]}</>
                              ) : (
                                <>{key}</>
                              )}
                            </li>
                          </ul>
                          <Progress_bar
                            bgcolor="green"
                            progress={calculatePercentage(value).toFixed(2)}
                            height={30}
                          />
                        </Grid>
                      </div>
                    ) : (
                      <p>kk</p>
                    )}{" "}
                  </div>
                ))}
              </>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default QuestionsByAnswer;
