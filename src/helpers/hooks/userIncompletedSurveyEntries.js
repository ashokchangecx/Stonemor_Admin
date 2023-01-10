import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { LIST_INCOMPLETED_SURVEY_ENTRIES } from "../../graphql/custom/queries";

const useIncompletedSurveyEntries = (initialVar = {}) => {
  let variables = {
    ...initialVar,
    limit: 100000,
  };
  const {
    loading: listIncompletedSurveyEntriesLoading,
    error: listIncompletedSurveyEntriesError,
    data: listIncompletedSurveyEntriesData,
    fetchMore: listSurveyEntriesFetchMore,
  } = useQuery(LIST_INCOMPLETED_SURVEY_ENTRIES, {
    variables,
  });

  const [surveyIncompletedEntries, setIncompletedSurveyEntries] = useState([]);
  const [nextToken, setNextToken] = useState(null);
  const [incompletedLoading, setIncompletedLoading] = useState(true);
  const handleSetSurvey = (IncompletedSurveyEntriesData) => {
    const {
      listSurveyEntriess: { items, nextToken },
    } = IncompletedSurveyEntriesData;
    if (items?.length > 0)
      setIncompletedSurveyEntries((prevState) => [...prevState, ...items]);

    if (nextToken) {
      setNextToken(nextToken);
    } else {
      setNextToken(null);
      setIncompletedLoading(false);
    }
  };

  const fetchMore = async () => {
    const res = await listSurveyEntriesFetchMore({
      variables: {
        nextToken: nextToken,
      },
    });
    handleSetSurvey(res.data);
  };

  useEffect(() => {
    if (
      !listIncompletedSurveyEntriesLoading &&
      !listIncompletedSurveyEntriesError
    ) {
      handleSetSurvey(listIncompletedSurveyEntriesData);
    }
  }, [listIncompletedSurveyEntriesLoading]);

  useEffect(() => {
    if (nextToken) {
      const handleFetch = async () => await fetchMore();
      handleFetch();
    }
  }, [nextToken]);

  return { incompletedLoading, surveyIncompletedEntries };
};

export default useIncompletedSurveyEntries;
