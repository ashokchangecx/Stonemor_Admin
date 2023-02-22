import withSuspense from "../../../helpers/hoc/withSuspense";
import SimpleBarChart from "../../charts/bar";
import SimpleDonutChart from "../../charts/donut";
import { Loader } from "../../common/Loader";

const CHART_ID = "Location_by_questionnarie";
const TITLE = "Location By Question Pools  ";

const LocationByQuestionnaire = ({
  data,
  questionariesName,
  loading,
  error,
  selectedQuestionnarie,
  locationData,
}) => {
  const onGettingQuestionnaireByname = (name) => {
    const que = questionariesName?.listQuestionnaires?.items?.find(
      (q) => q?.name === name
    );

    return que?.id ?? name;
  };

  const onGettingLocationById = (id) => {
    const loc = locationData?.find((q) => q?.locationID === id);
    return loc?.location ?? id;
  };

  const questionarieName =
    questionariesName?.listQuestionnaires?.items?.find(
      (q) => q?.id === onGettingQuestionnaireByname(selectedQuestionnarie)
    ) || "";

  const chartData = data
    ?.filter((data) => data?.LocationId)
    ?.filter(
      (d) =>
        d?.questionnaireId ===
        onGettingQuestionnaireByname(selectedQuestionnarie)
    )
    ?.reduce((chartData, { LocationId }) => {
      if (LocationId) {
        const x = onGettingLocationById(LocationId) || "no-loc";

        const y = (chartData[x]?.y || 0) + 1;

        const loc = {
          x,
          y,
        };
        chartData[x] = loc;
      }
      return chartData;
    }, {});
  console.log(data);
  return (
    <>
      {selectedQuestionnarie && !error ? (
        <SimpleBarChart
          id={CHART_ID}
          data={chartData}
          title={TITLE + " - " + questionarieName?.name}
          labels={questionariesName.listQuestionnaires.items}
        />
      ) : (
        loading && <Loader />
      )}
    </>
  );
};

export default withSuspense(LocationByQuestionnaire);
