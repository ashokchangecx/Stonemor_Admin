import Chart from "react-apexcharts";
import { CHART_HEIGHT, CHART_THEME_MODE } from "../../../config/ChartConfig";
import ChartWrapper from "../ChartWrapper";

const SimpleLineChart = ({ data, title, id, seriesName, yAxisTitle }) => {
  const chartData = Object?.entries(data)
    ?.map(([name, obj]) => obj)
    ?.sort((a, b) => new Date(b.x).getTime() - new Date(a.x).getTime());

  const series = [
    {
      name: seriesName,
      data: chartData,
    },
  ];
  const options = {
    chart: {
      id,
      type: "line",
      dropShadow: {
        enabled: true,
        color: "#000",
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.2,
      },
      zoom: {
        type: "x",
        enabled: true,
        autoScaleYaxis: true,
      },
      toolbar: {
        tools: {
          download: false,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
        },
        export: {
          csv: {
            filename: title,
            columnDelimiter: ",",
            headerCategory: title,
            headerValue: yAxisTitle,
            dateFormatter(timestamp) {
              return new Date(timestamp).toDateString();
            },
          },
          svg: {
            filename: title,
          },
          png: {
            filename: title,
          },
        },
      },
    },
    colors: ["#7fb05d"],
    dataLabels: {
      enabled: true,
    },
    stroke: {
      curve: "smooth",
    },
    theme: {
      mode: CHART_THEME_MODE,
    },
    grid: {
      row: {
        colors: ["#084975", "#084975"],
        opacity: 0.7,
      },
    },

    xaxis: {
      type: "category",
      labels: {
        trim: true,
        hideOverlappingLabels: false,
      },
    },
    // yaxis: {
    //   title: {
    //     text: yAxisTitle,
    //   },
    // },
  };

  return (
    <ChartWrapper title={title} id={id}>
      <Chart
        options={options}
        series={series}
        type="line"
        width="100%"
        height={CHART_HEIGHT}
      />
    </ChartWrapper>
  );
};

export default SimpleLineChart;
