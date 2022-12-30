import { useEffect, useState } from "react";
import SimpleBarChart from "../../charts/bar";
import { bindTitle } from "../../../config/ChartConfig";

const CHART_ID = "Incompleted survey_by_locations";
const TITLE = "Incompleted Survey By Locations";

const IcompletedSurveyByLocation = ({
  data,
  setSelectedLocation,
  fromDate,
  type,
  endDate,
}) => {
  const [date, setDate] = useState(TITLE);
  const chartData = data?.reduce((chartData, { location }) => {
    if (location?.id) {
      const x = location?.id || "no-loc";
      const y = (chartData[x]?.y || 0) + 1;
      const loc = {
        x,
        y,
      };
      chartData[x] = loc;
    }
    return chartData;
  }, {});
  const onClick = (event, chartContext, config) => {
    const locationId =
      config.w.config.series[0]?.data[config.dataPointIndex]?.x;
    setSelectedLocation(locationId);
  };
  const xAxisFormatter = (value) => {
    const label =
      data.find((d) => d?.location?.id === value)?.location?.location || value;
    return label;
  };
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
      <SimpleBarChart
        data={chartData}
        onClick={onClick}
        xAxisFormatter={xAxisFormatter}
        yAxisTitle="Count"
        title={date}
        id={CHART_ID}
        seriesName="Survey"
      />
    </>
  );
};

export default IcompletedSurveyByLocation;
