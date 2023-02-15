import { useEffect, useState } from "react";
import { bindTitle } from "../../../config/ChartConfig";
import SimpleDonutChart from "../../charts/donut";
import { Loader } from "../../common/Loader";

const CHART_ID = "Incompleted survey_by_questionnaire";
const TITLE = "Incompleted Survey By Question Pools";
const IncompletedSurveyByQuestionnarie = ({
  data,
  questionariesName,
  loading,
  error,
  fromDate,
  endDate,
  type,
}) => {
  const [date, setDate] = useState(TITLE);
  const color = [
    "#12263a",
    "#456b37",
    "#477c63",
    "#fd8080",
    "#5a170f",
    "#b18476",
    "#834833",
    "#266dd3",
    "#13270c",
    "#b15218",
  ];
  const chartData = data
    ?.filter((data) => data?.by?.name || data?.LocationId)
    ?.reduce((chartData, { questionnaireId }) => {
      if (questionnaireId) {
        const x = questionnaireId || "no-questionnarie";
        const y = (chartData[x]?.y || 0) + 1;
        const loc = {
          x,
          y,
        };
        chartData[x] = loc;
      }
      return chartData;
    }, {});

  useEffect(() => {
    const fullTitle = bindTitle({
      TITLE,
      fromDate,
      endDate,
      type,
    });
    setDate(fullTitle);
  }, [fromDate, endDate, type]);
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        !error && (
          <SimpleDonutChart
            id={CHART_ID}
            data={chartData}
            title={date}
            labels={questionariesName?.listQuestionnaires?.items}
            colorData={color}
          />
        )
      )}
    </>
  );
};

export default IncompletedSurveyByQuestionnarie;
