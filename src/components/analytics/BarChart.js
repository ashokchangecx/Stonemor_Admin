import React, { useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, getElementAtEvent } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const COLORS = ["	 #00cc00", "#739900", " #ffff00", " #ff9900", " #ff1a1a"];

var colors = [];
while (colors.length < 100) {
  do {
    var color = Math.floor(Math.random() * 1000000 + 1);
  } while (colors.indexOf(color) >= 0);
  colors.push("#" + ("800000" + color.toString(16)).slice(-6));
}

const OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: "StoneMor Chart",
    },
  },
  scales: {
    y: {
      min: 0, // minimum value
      //   max: 20, // maximum value
    },
  },
};

const BarChart = ({ data, title, xAxisKey, yAxisKey, onClickingNav }) => {
  const finalOptions = {
    ...OPTIONS,
    plugins: {
      ...OPTIONS?.plugins,
      title: {
        ...OPTIONS?.plugins?.title,
        text: title,
      },
    },
    parsing: {
      xAxisKey,
      yAxisKey,
    },
  };
  const chartRef = useRef();
  const onClick = (event) => {
    const el = getElementAtEvent(chartRef.current, event)[0];
    onClickingNav(el?.element?.$context?.raw);
  };
  return (
    <div style={{ minHeight: "400px" }}>
      <Bar
        ref={chartRef}
        options={finalOptions}
        data={{
          datasets: [
            {
              label: " Count",

              data: data,
              backgroundColor: COLORS,
              //   borderColor: colors,
              borderWidth: 1,
            },
          ],
        }}
        onClick={onClick}
      />
    </div>
  );
};

export default BarChart;
