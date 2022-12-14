import { useTheme } from "@mui/system";
import Chart from "react-apexcharts";
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
  "#99cc00",
  "#0099cc",
  " #1a0a00",
  "#4000ff",
  "#bfff00",
  "#9933ff",
  "#ffcccc",
];
const SimpleBarChart = ({
  data,
  title,
  xAxisFormatter,
  id,
  onClick,
  seriesName,
  yAxisTitle,
}) => {
  const theme = useTheme();
  const color = theme.palette.secondary.main;
  const chartData = Object.entries(data)
    ?.map(([name, obj]) => obj)
    ?.sort((a, b) => b?.y - a?.y);

  const options = {
    chart: {
      id,
      events: {
        dataPointSelection: onClick,
      },
      foreColor: CHART_FORECOLOR,
      // toolbar: {
      //   // show: false,
      //   tools: {
      //     customIcons: [
      //       {
      //         ...CHART_PDF_DOWNLOAD_ICON,
      //         click: async () =>
      //           await dowloadChartAsPDF({ ID: id, docName: title }),
      //       },
      //     ],
      //   },
      //   export: {
      //     csv: {
      //       filename: title,
      //       columnDelimiter: ",",
      //       headerCategory: title,
      //       headerValue: yAxisTitle,
      //       dateFormatter(timestamp) {
      //         return new Date(timestamp).toDateString();
      //       },
      //     },
      //     svg: {
      //       filename: title,
      //     },
      //     png: {
      //       filename: title,
      //     },
      //   },
      // },
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      type: "category",
      labels: {
        trim: true,
        hideOverlappingLabels: false,
        formatter: xAxisFormatter,
        rotate: -30,
      },
    },
    // yaxis: {
    //   title: {
    //     text: yAxisTitle,
    //   },
    // },
    // title: {
    //   text: title,
    //   align: "center",
    // },
    colors: Array(chartData.length).fill(color),
    tooltip: {
      fillSeriesColor: true,
      intersect: true,
      shared: false,
    },
    markers: {
      size: 1,
    },
    theme: {
      mode: CHART_THEME_MODE,
    },
  };

  const series = [
    {
      name: seriesName,
      data: chartData,
    },
  ];

  return (
    <ChartWrapper title={title} id={id}>
      <Chart
        options={options}
        series={series}
        type="bar"
        width="100%"
        height={CHART_HEIGHT}
      />
    </ChartWrapper>
  );
};

export default SimpleBarChart;
