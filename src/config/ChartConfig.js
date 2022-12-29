import ApexCharts from "apexcharts";
import { jsPDF } from "jspdf";
import moment from "moment";
import PDFICON from "../assets/images/PDF_ICON.svg";

export const CHART_THEME_MODE = "dark";

export const CHART_HEIGHT = 440;

export const CHART_FORECOLOR = "#fcfcfc";

export const CHART_PDF_DOWNLOAD_ICON = {
  icon: `<img src=${PDFICON} width="16" class="PDF_ICON_CLASS"/>`,
  title: "Download PDF",
};

export const dowloadChartAsPDF = async ({
  ID,
  docName = "chart.pdf",
  isCustom = false,
}) => {
  ApexCharts.exec(ID, "dataURI").then(({ imgURI }) => {
    const doc = new jsPDF("p", "px", "a4");
    if (isCustom) doc.addImage(imgURI, "JPEG", 20, 20, 406, 280);
    else doc.addImage(imgURI, "JPEG", 20, 20, 406, 230);
    doc.save(docName);
  });
};

export const bindTitle = ({ TITLE, fromDate, endDate, type }) => {
  if (fromDate && endDate && type) {
    const fromDateFormat = moment(fromDate).format("MM/DD/YYYY");
    const endDateFormat = moment(endDate).format("MM/DD/YYYY");

    return (
      TITLE +
      " - " +
      fromDateFormat +
      "  " +
      "to" +
      "  " +
      endDateFormat +
      " - " +
      type +
      " " +
      "SurveyEntries"
    );
  } else if (fromDate && endDate) {
    const fromDateFormat = moment(fromDate).format("MM/DD/YYYY");
    const endDateFormat = moment(endDate).format("MM/DD/YYYY");

    return TITLE + " - " + fromDateFormat + "  " + "to" + "  " + endDateFormat;
  } else if (type && fromDate) {
    const fromDateFormat = moment(fromDate).format("MM/DD/YYYY");
    return (
      TITLE + " - from " + fromDateFormat + " - " + type + " " + "SurveyEntries"
    );
  } else if (endDate && type) {
    const endDateFormat = moment(endDate).format("MM/DD/YYYY");
    return (
      TITLE + " - till " + endDateFormat + " - " + type + " " + "SurveyEntries"
    );
  } else if (fromDate) {
    const fromDateFormat = moment(fromDate).format("MM/DD/YYYY");
    return TITLE + " - from " + fromDateFormat;
  } else if (endDate) {
    const endDateFormat = moment(endDate).format("MM/DD/YYYY");
    return TITLE + " - till " + endDateFormat;
  } else if (type) {
    return TITLE + " - " + type + " " + "SurveyEntries";
  } else {
    return TITLE;
  }
};
