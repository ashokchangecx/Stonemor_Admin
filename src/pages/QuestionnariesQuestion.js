import React, { lazy, Suspense, useEffect, useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "@apollo/client";
import { Loader } from "../components/common/Loader";
import QuestionnariesQuestion from "../components/questionnaries-question";
import CreateButton from "../components/reusable/CreateButton";
import DynamicModel from "../components/reusable/DynamicModel";
import { GET_QUESTIONNAIRES } from "../graphql/custom/queries";
import { LIST_QUESTIONS } from "../graphql/custom/queries";
import withSuspense from "../helpers/hoc/withSuspense";
import useToggle from "../helpers/hooks/useToggle";
import DynamicModelForQuestion from "../components/reusable/DynamicModelForQuestion";

const CreateQuestion = lazy(() =>
  import("../components/questionnaries-question/CreateQuestion")
);

const QuestionnariesQuestionPage = () => {
  const params = useParams();
  const questionQuestionnaireId = params.id;
  const qid = "c5580d13-9061-418a-90bc-78b05da6e680";
  const { loading, error, data } = useQuery(GET_QUESTIONNAIRES, {
    variables: {
      id: questionQuestionnaireId,
    },
  });
  const { data: questionnaries } = useQuery(LIST_QUESTIONS, {
    variables: {
      id: qid,
    },
  });

  const { open, toggleOpen } = useToggle();
  const [questions, setQuestions] = useState([]);
  const [questionnarieData, setQuestionnarieData] = useState({});

  useEffect(() => {
    if (!loading && !error) {
      const { getQuestionnaire } = data;
      setQuestionnarieData({
        id: getQuestionnaire?.id,
        name: getQuestionnaire?.name,
        description: getQuestionnaire?.description,
        createdAt: getQuestionnaire?.createdAt,
        endMsg: getQuestionnaire?.endMsg,
        introMsg: getQuestionnaire?.introMsg,
      });
      setQuestions(
        data?.getQuestionnaire?.question?.items
          ?.filter((qu) => qu?.deleted !== true)
          ?.slice()
          ?.sort((a, b) => a?.order - b?.order)
      );
    }
  }, [loading, data?.getQuestionnaire?.question?.items]);

  if (loading) {
    return <Loader />;
  }
  if (error) {
    return <>error</>;
  }

  return (
    <div>
      <DynamicModelForQuestion
        dialogTitle="Create Question "
        open={open}
        toggle={toggleOpen}
        isClose
        maxWidth="md"
        isActions={false}
      >
        <Suspense fallback={<Loader />}>
          <CreateQuestion
            toggle={toggleOpen}
            questions={questions}
            questionQuestionnaireId={questionQuestionnaireId}
          />
        </Suspense>
      </DynamicModelForQuestion>
      <QuestionnariesQuestion
        questions={questions}
        questionnarieData={questionnarieData}
      />
      <CreateButton onClick={toggleOpen} />
    </div>
  );
};

export default withSuspense(QuestionnariesQuestionPage);
