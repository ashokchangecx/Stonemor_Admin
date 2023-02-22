import Chart from "react-apexcharts";
import { Link } from "react-router-dom";
import {
  CHART_FORECOLOR,
  CHART_HEIGHT,
  CHART_THEME_MODE,
} from "../../../config/ChartConfig";
import ChartWrapper from "../ChartWrapper";

const themeColor = [
  "#2E93fA",
  "#006600",
  "#ff00ff",
  "#996600",
  "#ff3300",
  "#4000ff",
  "#bfff00",
  "#9933ff",
  "#ffcccc",
  " #1a0a00",
];

// var themeColor = [];
// while (themeColor.length < 100) {
//   do {
//     var color = Math.floor(Math.random() * 123123 + 1);
//   } while (themeColor.indexOf(color) >= 0);
//   themeColor.push("#" + ("123123" + color.toString(16)).slice(-6));
// }
const SimpleLinkDonutChart = ({ id, data, title, labels, colorData,to,onClick }) => {
  const chartData = Object.entries(data)
    ?.map(([name, obj]) => ({
      ...obj,
      name: labels?.find((l) => l.id === obj.x)?.name,
    }))
    ?.sort((a, b) => b?.y - a?.y)
    ?.slice(0,9);
  const options = {
    chart: {
      id,
      events: {
        dataPointSelection: onClick,
      },
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
      // type: "gradient",
      colors: colorData,
    },
    tooltip: {
      enabled: true,
      fillSeriesColor: false,

      marker: {
        show: false,
      },
    },
    legend: {
      position: "bottom",
      markers: {
        fillColors: colorData,
      },
      formatter: function (val, opts) {
        return val + " - " + opts.w.globals.series[opts.seriesIndex];
      },
    },

    theme: {
      mode: CHART_THEME_MODE,
    },
  };

  return (
 <ChartWrapper title={title} id={id} >

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

export default SimpleLinkDonutChart;
