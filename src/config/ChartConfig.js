import moment from "moment-timezone";
import PDFICON from "../assets/images/PDF_ICON.svg";

export const CHART_THEME_MODE = "light";

export const CHART_HEIGHT = 440;

export const CHART_FORECOLOR = "#0f0f0f";

export const CHART_PDF_DOWNLOAD_ICON = {
  icon: `<img src=${PDFICON} width="16" class="PDF_ICON_CLASS"/>`,
  title: "Download PDF",
};

export const bindTitle = ({ TITLE, fromDate, endDate, type }) => {
  let zone = "America/New_York";

  if (fromDate && endDate && type) {
    const fromDateFormat = moment.tz(fromDate, zone).format("MM/DD/YYYY");
    const endDateFormat = moment.tz(endDate, zone).format("MM/DD/YYYY");

    return (
      TITLE +
      " - " +
      fromDateFormat +
      "  " +
      "to" +
      "  " +
      endDateFormat +
      " - " +
      type
    );
  } else if (fromDate && endDate) {
    const fromDateFormat = moment.tz(fromDate, zone).format("MM/DD/YYYY");
    const endDateFormat = moment.tz(endDate, zone).format("MM/DD/YYYY");

    return TITLE + " - " + fromDateFormat + " to " + endDateFormat;
  } else if (type && fromDate) {
    const fromDateFormat = moment.tz(fromDate, zone).format("MM/DD/YYYY");
    return TITLE + " - from " + fromDateFormat + " - " + type;
  } else if (endDate && type) {
    const endDateFormat = moment.tz(endDate, zone).format("MM/DD/YYYY");
    return TITLE + " - till " + endDateFormat + " - " + type;
  } else if (fromDate) {
    const fromDateFormat = moment.tz(fromDate, zone).format("MM/DD/YYYY");
    return TITLE + " - from " + fromDateFormat;
  } else if (endDate) {
    const endDateFormat = moment.tz(endDate, zone).format("MM/DD/YYYY");
    return TITLE + " - till " + endDateFormat;
  } else if (type) {
    return TITLE + " - " + type;
  } else {
    return TITLE;
  }
};
