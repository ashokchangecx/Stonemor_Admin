import { useState } from "react";
import { useNavigate } from "react-router-dom";
import withSuspense from "../../../helpers/hoc/withSuspense";
import SimpleLinkDonutChart from "../../charts/donut/Donut";
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
  const onGettingIdByLocation = (id) => {
    const loc = locationData?.find((q) => q?.location === id);
    return loc?.id ?? id;
  };
  const navigate = useNavigate();
  const [value, setValue] = useState(null);
  const locationName = onGettingLocationById(selectedLocation);
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
  // const questionarieID = questionariesName?.listQuestionnaires?.items?.find(
  //   (que) => que?.id
  // );

  const questionarieID = questionariesName.listQuestionnaires.items?.find(
    (i) => i?.name === value
  );
  const onClick = (event, chartContext, config) => {
    const label = config.w.config.labels[config.dataPointIndex];
    console.log("config.w.config.labels:", config.w.config.labels);
    console.log("config.dataPointIndex:", config.dataPointIndex);
    console.log("Selected label:", label);
    console.log("questionarieID :", questionarieID);
    setValue(label);
    if (questionarieID?.id) {
      navigate(`/questionnaries/${questionarieID?.id}`);
    }
  };

  // const onClick = (event, chartContext, config) => {
  //   const questionarieID = questionariesName.listQuestionnaires.items?.find(
  //     (i) => i?.name === value
  //   );
  //   const label = config.w.config.labels[config.dataPointIndex];
  //   setValue(label);
  //   if (questionarieID) {
  //     // Navigate(`/questionnaries/${questionarieID?.id}`);
  //   }
  // };
  return (
    <>
      {selectedLocation && !error ? (
        <>
          {" "}
          <SimpleLinkDonutChart
            id={CHART_ID}
            data={chartData}
            onClick={onClick}
            // to={`/questionnaries/${questionarieID?.id}`}
            title={TITLE + " - " + locationName}
            labels={questionariesName.listQuestionnaires.items}
            colorData={color}
          />
        </>
      ) : (
        loading && <Loader />
      )}
    </>
  );
};

export default withSuspense(QuestionnariesByLocation);
