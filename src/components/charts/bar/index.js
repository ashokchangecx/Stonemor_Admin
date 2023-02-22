import { useTheme } from "@mui/system";
import Chart from "react-apexcharts";
import {
  CHART_FORECOLOR,
  CHART_HEIGHT,
  CHART_PDF_DOWNLOAD_ICON,
  CHART_THEME_MODE,
} from "../../../config/ChartConfig";
import { dowloadChartAsPDF } from "../../../utils/PDF";
import { Loader } from "../../common/Loader";
import ChartWrapper from "../ChartWrapper";

const color = [
  "#68d4cd",
  "#cff67b",
  "#94dafb",
  "#fd8080",
  "#6d848e",
  "#26a0fc",
  "#26e7a6",
  "#febc3b",
  "#fab1b2",
  "#8973d5",
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
  // const color = theme.palette.secondary.main;

  const chartData = Object.entries(data)
    ?.map(([name, obj]) => obj)
    // ?.sort((a, b) => b?.y - a?.y)
    ?.slice(0, 10);

  const series = [
    {
      name: seriesName,
      data: chartData,
    },
  ];
  const seriesLength = series[0]?.data?.length;

  if (seriesLength < 3) {
    const seriesLength = series[0]?.data?.length;

    var optimalColumnWidthPercent =
      10 + 40 / (1 + 30 * Math.exp(-seriesLength / 3));
  } else {
    optimalColumnWidthPercent = 70;
  }
  const options = {
    plotOptions: {
      bar: {
        distributed: true,
        // barHeight: "20%",

        columnWidth: optimalColumnWidthPercent + "%",
      },
    },
    chart: {
      id,
      events: {
        dataPointSelection: onClick,
      },
      foreColor: CHART_FORECOLOR,
      // toolbar: {
      // show: false,
      // tools: {
      //   customIcons: [
      //     {
      //       ...CHART_PDF_DOWNLOAD_ICON,
      //       click: async () =>
      //         await dowloadChartAsPDF({ ID: id, docName: title }),
      //     },
      //   ],
      // },
      // export: {
      //   csv: {
      //     filename: title,
      //     columnDelimiter: ",",
      //     headerCategory: title,
      //     headerValue: yAxisTitle,
      //     dateFormatter(timestamp) {
      //       return new Date(timestamp).toDateString();
      //     },
      //   },
      //   svg: {
      //     filename: title,
      //   },
      //   png: {
      //     filename: title,
      //   },
      // },
      // },
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      type: "category",
      labels: {
        trim: true,
        hideOverlappingLabels: true,
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

    colors: color,
    fill: {
      // type: "solid",
      colors: color,
    },
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
