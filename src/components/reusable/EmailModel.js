import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  IconButton,
  Slide,
  ListSubheader,
  ListItem,
  ListItemText,
  List,
} from "@mui/material";
import * as React from "react";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

const DynamicModel = ({
  open = false,
  toggle,
  dialogTitle,
  children,
  confirmText = "Create",
  cancelText = "Close",
  onClickConfirm,
  isClose = false,
  maxWidth = "md",
  isActions = true,
  sub
}) => {
  return (
    <Dialog open={open} fullWidth maxWidth={maxWidth}>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {dialogTitle}
        <IconButton
          aria-label="close"
          onClick={toggle}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CancelOutlinedIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>  <List
      sx={{
        width: '100%',
        maxWidth: 360,
        bgcolor: 'background.paper',
        position: 'relative',
        overflow: 'auto',
        maxHeight: 300,
        '& ul': { padding: 0 },
      }}
      subheader={sub}
    >
      
        <li >
          <ul>
            
              <ListItem>2</ListItem>
              <ListItem>2</ListItem>
              <ListItem>2</ListItem>
              <ListItem>{children}</ListItem>
       
          </ul>
        </li>
     
    </List>
  </DialogContent>
      {isActions && (
        <DialogActions>
          {isClose && (
            <Button onClick={toggle} variant="text" color="info">
              {cancelText}
            </Button>
          )}
          <Button onClick={onClickConfirm} variant="contained" color="primary">
            {confirmText}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default DynamicModel;
