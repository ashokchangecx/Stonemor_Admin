import ApexCharts from "apexcharts";
import { jsPDF } from "jspdf";

const logoBase64 = () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas?.getContext("2d");
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const img = document.getElementById("memorial_planning_logo");
  ctx.drawImage(img, 0, 0);
  return canvas.toDataURL("image/jpeg");
};

const convertChartToImage = async ({ ID, chartName }) => {
  try {
    const { imgURI } = await ApexCharts.exec(ID, "dataURI", { width: 1224 });
    return { imgURI, chartName };
  } catch (error) {
    console.log("convertChartToImage error : ", error);
  }
};

export const dowloadChartAsPDF = async ({ ID, docName = "chart.pdf" }) => {
  try {
    const { imgURI } = await convertChartToImage({ ID, chartName: docName });
    const doc = new jsPDF("p", "px", "a4");
    const width = doc.internal.pageSize.getWidth();
    doc.setFontSize(18);
    doc.text(docName, width / 2, 20, { align: "center" });
    doc.addImage(imgURI, "JPEG", 15, 40, 416, 270);
    doc.save(docName);
  } catch (error) {
    console.log("dowloadChartAsPDF error : ", error);
  }
};

export const adminDownloadChartsAsPDF = async (charts = []) => {
  try {
    const name = "Survey Report";
    const doc = new jsPDF("l", "px", [447, 380]);
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();
    doc.setFontSize(22).setFont("helvetica", "bold");
    doc.setTextColor(106, 163, 66);
    doc.text(name, width / 2, 40, { align: "center" });
    const Logo = logoBase64();
    doc.addImage(Logo, "JPEG", 120, 70, 190, 70);
    doc.setFontSize(14).setFont(undefined, "normal");
    doc.setTextColor(100);
    await Promise.allSettled(
      charts?.map(async (chart) => {
        try {
          const { imgURI, chartName } = await convertChartToImage({
            ID: chart?.id,
            chartName: chart?.name,
          });
          doc.addPage();
          doc.text(chartName, width / 2, 20, { align: "center" });
          doc.addImage(imgURI, "JPEG", 15, 40, 416, 270);
        } catch (error) {
          console.log("adminDownloadChartsAsPDF error : ", error);
        }
      })
    );
    const totalPages = doc.getNumberOfPages();
    doc.setFontSize(8).setFont(undefined, "normal");
    doc.setTextColor(150);

    for (let i = 2; i <= totalPages; i++) {
      doc.setPage(i);
      //Handle appending page number
      const currentPage = doc.getCurrentPageInfo().pageNumber;

      doc.line(5, height - 25, width - 5, height - 25);
      doc.text(currentPage.toString(), width - 10, height - 10);
      doc.text(name, 10, height - 10);
    }
    doc.save(name);
  } catch (error) {
    console.log("Error adminDownloadChartsAsPDF", error);
  }
};
