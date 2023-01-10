import moment from "moment";
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
  const chartData = data?.reduce((chartData, data) => {
    const x =
      moment(data?.finishTime).format("YYYY-MM-DD") ||
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
