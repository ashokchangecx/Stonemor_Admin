import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
  } from "@mui/material";
  import React from "react";
  
  const RemoveModel = ({
    open = false,
    toggle,
    dialogTitle,
    dialogContentText,
    onClickConfirm,
    isClose = true,
    isActions = true,
  }) => {
    return (
      <>
        <Dialog open={open} aria-labelledby="form-dialog-title">
          <FormControl>
            <DialogTitle id="form-dialog-title">{dialogTitle}</DialogTitle>
            <DialogContent>
              <DialogContentText color="error">
                {dialogContentText}
              </DialogContentText>
            </DialogContent>
            {isActions && (
              <DialogActions>
                {isClose && (
                  <Button onClick={toggle} variant="text" color="info">
                    cancel
                  </Button>
                )}
                <Button
                  onClick={onClickConfirm}
                  variant="contained"
                  color="primary"
                >
                  Remove
                </Button>
              </DialogActions>
            )}
          </FormControl>
        </Dialog>
      </>
    );
  };
  
  export default RemoveModel;
  