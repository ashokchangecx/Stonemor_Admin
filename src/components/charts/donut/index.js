import Chart from "react-apexcharts";
import {
  CHART_FORECOLOR,
  CHART_HEIGHT,
  CHART_THEME_MODE,
} from "../../../config/ChartConfig";
import ChartWrapper from "../ChartWrapper";

const SimpleDonutChart = ({ id, data, title, labels }) => {
  const chartData = Object.entries(data)
    ?.map(([name, obj]) => ({
      ...obj,
      name: labels?.find((l) => l.id === obj.x)?.name,
    }))
    ?.sort((a, b) => b?.y - a?.y);
  const options = {
    chart: {
      id,
      foreColor: CHART_FORECOLOR,
      toolbar: {
        show: false,
      },
    },
    series: chartData.map((m) => m?.y),
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 270,
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: true,
              label: "Total",
              fontSize: "22px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 600,
              color: "#fcfcfc",
              formatter: function (w) {
                return w.globals.seriesTotals.reduce((a, b) => {
                  return a + b;
                }, 0);
              },
            },
          },
        },
      },
    },
    labels: chartData.map((m) => m?.name),
    dataLabels: {
      enabled: true,
    },
    fill: {
      type: "gradient",
    },
    legend: {
      position: "bottom",
      formatter: function (val, opts) {
        return val + " - " + opts.w.globals.series[opts.seriesIndex];
      },
    },

    theme: {
      mode: CHART_THEME_MODE,
    },
  };

  return (
    <ChartWrapper title={title} id={id}>
      <Chart
        options={options}
        series={options.series}
        type="donut"
        width="100%"
        height={CHART_HEIGHT}
      />
    </ChartWrapper>
  );
};

export default SimpleDonutChart;
