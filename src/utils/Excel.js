import moment from "moment";

export const SurveyEntriesToExcel = (surveyEntries, questionariesName) => {
  const getQuestionarieName = (qid) => {
    const question = questionariesName?.find((q) => q?.id === qid);
    return question ? question?.name : qid;
  };
  return surveyEntries.map((entry) => {
    const { questionnaireId, finishTime, startTime, by, location, createdAt } =
      entry;
    const SD = moment(startTime);
    const ED = moment(finishTime);
    const duration = ED.diff(SD, "seconds");
    const created = moment(createdAt).format("DD/MM/YYYY, hh:mm:ss a");
    const userName = by?.name || "-";
    const userEmail = by?.email || "-";
    const locationName = location?.location || "-";
    const locationInchargeMail = location?.inchargeEmail || "-";
    return {
      Questionnaire: getQuestionarieName(questionnaireId),
      Date: created,
      Duration: duration,
      UserName: userName,
      UserEmail: userEmail,
      LocationName: locationName,
      LocationMail: locationInchargeMail,
    };
  });
};
