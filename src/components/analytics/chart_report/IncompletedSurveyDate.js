import moment from "moment-timezone";
import React, { useEffect, useState } from "react";
import { bindTitle } from "../../../config/ChartConfig";
import SimpleLineChart from "../../charts/line";
import { Loader } from "../../common/Loader";

const CHART_ID = "Incompleted Survey Entries_by_date";
const TITLE = "Incompleted Survey Entries By Date";

const IncompletedSurveyDate = ({
  data,
  loading,
  error,
  fromDate,
  type,
  endDate,
}) => {
  const [date, setDate] = useState(TITLE);
  let zone = "America/New_York";
  const chartData = data?.reduce((chartData, data) => {
    const x =
      moment.tz(data?.finishTime, zone).format("DD-MM-YYYY") ||
      "no SurveyEntry on this date";

    const y = (chartData[x]?.y || 0) + 1;
    const date = {
      x,

      y,
    };
    chartData[x] = date;

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
          <SimpleLineChart
            data={chartData}
            seriesName="Survey Entry"
            title={date}
            id={CHART_ID}
            yAxisTitle="Count"
          />
        )
      )}
    </>
  );
};

export default IncompletedSurveyDate;
