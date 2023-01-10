import { useEffect, useState } from "react";
import { bindTitle } from "../../../config/ChartConfig";
import SimpleDonutChart from "../../charts/donut";
import { Loader } from "../../common/Loader";

const CHART_ID = "survey_by_questionnaire";
const TITLE = "Number of Completed by Available Surveys";
const SurveyByQuestionnarie = ({
  data,
  questionariesName,
  loading = false,
  error = undefined,
  fromDate,
  endDate,
}) => {
  const [date, setDate] = useState(TITLE);
  const chartData = data?.reduce((chartData, { questionnaireId }) => {
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
    });
    setDate(fullTitle);
  }, [fromDate, endDate]);
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
            labels={questionariesName.listQuestionnaires.items}
          />
        )
      )}
    </>
  );
};

export default SurveyByQuestionnarie;
