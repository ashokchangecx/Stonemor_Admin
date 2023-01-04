import moment from "moment";

export const QrCodeSurveyEntriesToExcel = (
  surveyEntries,
  questionariesName
) => {
  const getQuestionarieName = (qid) => {
    const question = questionariesName?.find((q) => q?.id === qid);
    return question ? question?.name : qid;
  };
  return surveyEntries
    ?.filter((data) => data?.location?.location)
    ?.map((entry, index) => {
      const {
        questionnaireId,
        finishTime,
        startTime,

        location,
        createdAt,
      } = entry;
      const serialNo = index + 1;
      const locationName = location?.location || "-";
      const locationInchargeMail = location?.inchargeEmail || "-";
      const created = moment(createdAt).format("DD/MM/YYYY");
      const SD = moment(startTime);
      const ED = moment(finishTime);
      const duration = ED.diff(SD, "seconds") + " " + "sec";
      return {
        No: serialNo,
        Questionnaire: getQuestionarieName(questionnaireId),
        LocationName: locationName,
        LocationMail: locationInchargeMail,
        Date: created,
        Duration: duration,
      };
    });
};

export const LinkSurveyEntriesToExcel = (surveyEntries, questionariesName) => {
  const getQuestionarieName = (qid) => {
    const question = questionariesName?.find((q) => q?.id === qid);
    return question ? question?.name : qid;
  };
  return surveyEntries
    ?.filter((data) => data?.by?.name)
    ?.map((entry, index) => {
      const {
        questionnaireId,
        finishTime,
        startTime,
        by,

        createdAt,
      } = entry;
      const serialNo = index + 1;
      const userName = by?.name || "-";
      const userEmail = by?.email || "-";
      const created = moment(createdAt).format("DD/MM/YYYY");
      const SD = moment(startTime);
      const ED = moment(finishTime);
      const duration = ED.diff(SD, "seconds") + " " + "sec";

      return {
        No: serialNo,
        Questionnaire: getQuestionarieName(questionnaireId),
        UserName: userName,
        UserEmail: userEmail,
        Date: created,
        Duration: duration,
      };
    });
};
