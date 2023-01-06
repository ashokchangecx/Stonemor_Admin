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
      const duration = `${ED.diff(SD, "seconds")}  ${"sec"}`;
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
      const duration = `${ED.diff(SD, "seconds")}  ${"sec"}`;

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

export const SurveyEntriesByQuestionnariesToExcel = (
  surveyEntries,
  questionariesName
) => {
  const getQuestionarieName = (qid) => {
    const question = questionariesName?.find((q) => q?.id === qid);
    return question ? question?.name : qid;
  };
  const SurveyEntriesByQuestionnariesData = surveyEntries?.reduce(
    (SurveyEntriesByQuestionnariesData, { questionnaireId }) => {
      if (questionnaireId) {
        const questionnaire = questionnaireId || "no-questionnarie";
        const count =
          (SurveyEntriesByQuestionnariesData[questionnaire]?.count || 0) + 1;
        const loc = {
          questionnaire,
          count,
        };
        SurveyEntriesByQuestionnariesData[questionnaire] = loc;
      }
      return SurveyEntriesByQuestionnariesData;
    },
    {}
  );

  const Data = Object.entries(SurveyEntriesByQuestionnariesData)?.map(
    ([name, obj]) => ({
      ...obj,
    })
  );

  return Data?.map((entry, index) => {
    const { questionnaire, count } = entry;

    const serialNo = index + 1;
    const questName = questionnaire || "-";
    const counts = count || "0";

    return {
      No: serialNo,
      Questionnaire: getQuestionarieName(questName),
      SurveyCount: counts,
    };
  });
};
export const SurveyEntriesByLocationToExcel = (surveyEntries) => {
  const SurveyEntriesByLocationData = surveyEntries?.reduce(
    (SurveyEntriesByLocationData, { location }) => {
      if (location?.id) {
        const locationName = location?.location || "no-questionnarie";
        const count =
          (SurveyEntriesByLocationData[locationName]?.count || 0) + 1;
        const loc = {
          locationName,
          count,
        };
        SurveyEntriesByLocationData[locationName] = loc;
      }
      return SurveyEntriesByLocationData;
    },
    {}
  );

  const Data = Object.entries(SurveyEntriesByLocationData)?.map(
    ([name, obj]) => ({
      ...obj,
    })
  );

  return Data?.map((entry, index) => {
    const { locationName, count } = entry;

    const serialNo = index + 1;
    const LocName = locationName || "-";
    const counts = count || "0";

    return {
      No: serialNo,
      Location: LocName,
      SurveyCount: counts,
    };
  });
};
export const SurveyEntriesBydateToExcel = (surveyEntries) => {
  const SurveyEntriesByDateData = surveyEntries?.reduce(
    (SurveyEntriesByDateData, surveyEntries) => {
      const date =
        moment(surveyEntries?.finishTime).format("YYYY-MM-DD") ||
        "no SurveyEntry on this date";
      const count = (SurveyEntriesByDateData[date]?.count || 0) + 1;
      const entry = {
        date,
        count,
      };
      SurveyEntriesByDateData[date] = entry;

      return SurveyEntriesByDateData;
    },
    {}
  );

  const Data = Object.entries(SurveyEntriesByDateData)?.map(([name, obj]) => ({
    ...obj,
  }));

  return Data?.map((entry, index) => {
    const { date, count } = entry;

    const serialNo = index + 1;
    const entryDate = date || "-";
    const counts = count || "0";

    return {
      No: serialNo,
      Date: entryDate,
      SurveyCount: counts,
    };
  });
};
