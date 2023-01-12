import moment from "moment-timezone";
import React, { useEffect, useState } from "react";
import { bindTitle } from "../../../config/ChartConfig";
import SimpleLineChart from "../../charts/line";
import { Loader } from "../../common/Loader";

const CHART_ID = "Survey Entries_by_date";
const INITIAL_TITLE = "Survey Entries By Date";

const SurveyByDate = ({ data, loading, error, fromDate, type, endDate }) => {
  const [title, setTitle] = useState(INITIAL_TITLE);
  let zone = "America/New_York";
  const chartData = data?.reduce((chartData, data) => {
    const x =
      moment.tz(data?.finishTime, zone).format("MM-DD-YYYY") ||
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
      TITLE: INITIAL_TITLE,
      fromDate,
      endDate,
      type,
    });
    setTitle(fullTitle);
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
            title={title}
            id={CHART_ID}
            yAxisTitle="Count"
          />
        )
      )}
    </>
  );
};

export default SurveyByDate;
