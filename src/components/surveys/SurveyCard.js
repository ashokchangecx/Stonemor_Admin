import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CardHeader,
  IconButton,
} from "@mui/material";
import DeleteModel from "../reusable/DeleteModel";
import React, { lazy, Suspense, useState } from "react";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import DynamicModel from "../reusable/DynamicModel";
import useToggle from "../../helpers/hooks/useToggle";
import { Loader } from "../common/Loader";
import ArchivedSurvey from "./ArchivedSurvey";
import withSuspense from "../../helpers/hoc/withSuspense";
import { LIST_SURVEYS } from "../../graphql/custom/queries";
import { UPDATE_SURVEY } from "../../graphql/custom/mutations";
import { useMutation } from "@apollo/client";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

const ShareSurvey = lazy(() => import("../../components/surveys/ShareSurvey"));
const UpdateSurvey = lazy(() => import("./UpdateSurvey"));
const ViewSurvey = lazy(() => import("./ViewSurvey"));

const SurveyCard = ({ survey, showActions = true }) => {
  const {
    open: updateOpen,
    toggleOpen: updateToggleOpen,
    setOpen: setUpdateOpen,
  } = useToggle();
  const {
    open: viewOpen,
    toggleOpen: viewToggleOpen,
    setOpen: setViewOpen,
  } = useToggle();

  const {
    open: shareOpen,
    toggleOpen: shareToggleOpen,
    setOpen: setShareOpen,
  } = useToggle();
  const {
    open: archivedOpen,
    toggleOpen: archivedToggleOpen,
    setOpen: setArchivedOpen,
  } = useToggle();

  const {
    open: deleteModelOpen,
    setOpen: setDeleteModelOpen,
    toggleOpen: toggleDeleteModelOpen,
  } = useToggle(false);

  const [currentSurvey, setCurrentSurvey] = useState({});
  const { image, name, description } = survey;

  const openUpdateDialog = Boolean(updateOpen) && Boolean(currentSurvey?.id);
  const openViewDialog = Boolean(viewOpen) && Boolean(currentSurvey?.id);
  const openArchivedDialog =
    Boolean(archivedOpen) && Boolean(currentSurvey?.id);
  const openShareDialog = Boolean(shareOpen) && Boolean(currentSurvey);

  const [deleteSurvey] = useMutation(UPDATE_SURVEY, {
    refetchQueries: [
      {
        query: LIST_SURVEYS,
        variables: {
          filter: { archived: { ne: true }, deleted: { ne: true } },
          limit: 100,
        },
      },
    ],
  });
  const handleSurveyUpdateDialog = (survey) => {
    const { name = "", image = "", description = "", id } = survey;
    setCurrentSurvey({
      name,
      image,
      description,
      id,
    });
    setUpdateOpen(true);
  };
  const handleSurveyViewDialog = (survey) => {
    setCurrentSurvey(survey);
    setViewOpen(true);
  };

  const handleSurveyDeleteDialog = (survey) => {
    const { id, name } = survey;
    setCurrentSurvey({
      id,
      name,
    });
    setDeleteModelOpen(true);
  };

  const handleSurveyArchivedDialog = (survey) => {
    setCurrentSurvey(survey);
    setArchivedOpen(true);
  };
  const handleSurveyShareDialog = (survey) => {
    const { id, name } = survey?.preQuestionnaire;
    setCurrentSurvey({
      id,
      name,
    });
    setShareOpen(true);
  };
  const handleupdateToggleOpen = () => {
    setCurrentSurvey({});
    updateToggleOpen();
  };
  const handleViewToggleOpen = () => {
    setCurrentSurvey({});
    viewToggleOpen();
  };
  const handleShareToggleOpen = () => {
    setCurrentSurvey({});
    shareToggleOpen();
  };
  const handleArchivedToggleOpen = () => {
    setCurrentSurvey({});
    archivedToggleOpen();
  };
  const onClickDelete = async () => {
    const DeleteSurveyQuery = {
      id: currentSurvey?.id,

      deleted: true,
    };
    await deleteSurvey({ variables: { input: DeleteSurveyQuery } });
    toggleDeleteModelOpen();
  };

  return (
    <>
      <DeleteModel
        open={deleteModelOpen}
        toggle={toggleDeleteModelOpen}
        onClickConfirm={onClickDelete}
        isClose
        dialogTitle="Delete "
        dialogContentText={`Are You Sure You Want to Delete ${currentSurvey?.name} survey?`}
      />

      <DynamicModel
        dialogTitle={` Archive - ${currentSurvey?.name}`}
        open={openArchivedDialog}
        toggle={handleArchivedToggleOpen}
        isClose
        maxWidth="sm"
        isActions={false}
      >
        <Suspense fallback={<Loader />}>
          <ArchivedSurvey
            toggle={handleArchivedToggleOpen}
            currentSurveyData={currentSurvey}
          />
        </Suspense>
      </DynamicModel>
      <DynamicModel
        dialogTitle={` Share survey - ${currentSurvey?.name}`}
        open={openShareDialog}
        toggle={handleShareToggleOpen}
        isClose
        maxWidth="sm"
        isActions={false}
      >
        <Suspense fallback={<Loader />}>
          <ShareSurvey
            toggle={handleShareToggleOpen}
            currentSurveyData={currentSurvey}
          />
        </Suspense>
      </DynamicModel>
      <DynamicModel
        open={openUpdateDialog}
        toggle={handleupdateToggleOpen}
        dialogTitle={`Update Survey - ${currentSurvey?.name}`}
        isActions={false}
      >
        <Suspense fallback={<Loader />}>
          <UpdateSurvey
            toggle={handleupdateToggleOpen}
            initialFormValues={currentSurvey}
          />
        </Suspense>
      </DynamicModel>

      <DynamicModel
        open={openViewDialog}
        toggle={handleViewToggleOpen}
        dialogTitle={`View Survey `}
        isActions={false}
      >
        <Suspense fallback={<Loader />}>
          <ViewSurvey
            toggle={handleViewToggleOpen}
            currentSurveyData={currentSurvey}
          />
        </Suspense>
      </DynamicModel>

      <Card
        sx={{
          p: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {showActions && (
          <CardHeader
            action={
              <IconButton
                aria-label="delete"
                onClick={() => handleSurveyDeleteDialog(survey)}
              >
                <DeleteForeverOutlinedIcon color="error" />
              </IconButton>
            }
          />
        )}
        <CardMedia
          component="img"
          height="100"
          src={image}
          alt="Survey Logo"
          sx={{ p: 0.5, objectFit: "contain" }}
        />
        <CardContent>
          <Typography gutterBottom variant="h6" component="div">
            {name}
          </Typography>
          {description && (
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          )}
        </CardContent>
        <CardActions
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
        {showActions &&  <>  {survey?.preQuestionnaire?.id && (
            <IconButton
              color="primary"
              aria-label="archive"
              onClick={() => handleSurveyArchivedDialog(survey)}
            >
              <ArchiveOutlinedIcon />
            </IconButton>
          )}

   <IconButton
            color="primary"
            aria-label="archive"
            onClick={() => handleSurveyUpdateDialog(survey)}
          >
            <ModeEditOutlineOutlinedIcon />
          </IconButton></>}
          <IconButton
            color="primary"
            aria-label="archive"
            onClick={() => handleSurveyViewDialog(survey)}
          >
            <VisibilityOutlinedIcon />
          </IconButton>

          {survey?.preQuestionnaire?.id && (
            <IconButton
              color="primary"
              aria-label="delete"
              onClick={() => handleSurveyShareDialog(survey)}
            >
              <ShareOutlinedIcon />
            </IconButton>
          )}
        </CardActions>
      </Card>
    </>
  );
};

export default withSuspense(SurveyCard);
