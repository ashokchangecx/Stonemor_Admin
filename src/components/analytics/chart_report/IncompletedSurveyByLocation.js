import { useEffect, useState } from "react";
import SimpleBarChart from "../../charts/bar";
import { bindTitle } from "../../../config/ChartConfig";
import { Loader } from "../../common/Loader";

const CHART_ID = "Incompleted survey_by_locations";
const TITLE = "Incompleted Survey By Locations";

const IcompletedSurveyByLocation = ({
  data,
  setSelectedLocation,
  fromDate,
  type,
  endDate,
  locationData,
}) => {
  const [date, setDate] = useState(TITLE);

  const onGettingLocationById = (id) => {
    const loc = locationData?.find((q) => q?.locationID === id);
    return loc?.location ?? id;
  };

  const xAxisFormatter = (value) => {
    const label = value;
    return label;
  };

  const chartData = data?.reduce((chartData, { LocationId }) => {
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
  const onClick = (event, chartContext, config) => {
    const locationId =
      config.w.config.series[0]?.data[config.dataPointIndex]?.x;
    setSelectedLocation(locationId);
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

  if (!locationData) {
    return <Loader />;
  }

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
