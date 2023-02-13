import withSuspense from "../../../helpers/hoc/withSuspense";
import SimpleDonutChart from "../../charts/donut";
import { Loader } from "../../common/Loader";

const CHART_ID = "questionnarie_by_location";
const TITLE = "Question Pools By Location";

const QuestionnariesByLocation = ({
  data,
  questionariesName,
  loading,
  error,
  selectedLocation,
  locationData,
}) => {
  const onGettingLocationById = (id) => {
    const loc = locationData?.find((q) => q?.locationID === id);
    return loc?.location ?? id;
  };
  const locationName = onGettingLocationById(selectedLocation);
  const chartData = data
    ?.filter((d) => d?.LocationId === selectedLocation)
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

  return (
    <>
      {selectedLocation && !error ? (
        <SimpleDonutChart
          id={CHART_ID}
          data={chartData}
          title={TITLE + " - " + locationName}
          labels={questionariesName.listQuestionnaires.items}
        />
      ) : (
        loading && <Loader />
      )}
    </>
  );
};

export default withSuspense(QuestionnariesByLocation);
