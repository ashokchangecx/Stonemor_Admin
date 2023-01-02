import {
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Typography,
} from "@mui/material";
import { useState } from "react";
import DensityMediumOutlinedIcon from "@mui/icons-material/DensityMediumOutlined";
import { dowloadChartAsPDF } from "../../utils/PDF";

const ChartWrapper = ({ title, id, children }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Paper variant="elevation" elevation={8} sx={{ p: 0.35, height: "100%" }}>
      <Grid container alignItems="center">
        <Grid item xs={11}>
          <Typography variant="h6" px={1} textAlign="center">
            {title}
          </Typography>
        </Grid>
        <Grid item xs={1} textAlign="right">
          <IconButton onClick={handleMenu}>
            <DensityMediumOutlinedIcon fontSize="small" />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 0.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            open={menuOpen}
            onClose={handleClose}
          >
            {/* <MenuItem>Download CSV</MenuItem> */}
            <MenuItem
              onClick={async () => {
                await dowloadChartAsPDF({ ID: id, docName: title });
                handleClose();
              }}
            >
              Download PDF
            </MenuItem>
          </Menu>
        </Grid>
      </Grid>
      {children}
    </Paper>
  );
};

export default ChartWrapper;
