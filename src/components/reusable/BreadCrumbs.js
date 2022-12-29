import { Breadcrumbs, Link as MUILink } from "@mui/material";
import { Link } from "react-router-dom";
import NavigateNextOutlinedIcon from "@mui/icons-material/NavigateNextOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

const BreadCrumbs = ({ paths = [], active }) => {
  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      sx={{ mb: 2 }}
      separator={<NavigateNextOutlinedIcon fontSize="small" />}
    >
      <MUILink underline="none" color="black" to="/" component={Link}>
        <HomeOutlinedIcon
          sx={{
            mr: 0.5,
            pt: 0.5,
            "&:hover": {
              fontWeight: "bold",
            },
          }}
          fontSize="medium"
        />
      </MUILink>
      {paths.map((path, p) => (
        <MUILink
          underline="none"
          color="black"
          to={path?.to}
          component={Link}
          key={p}
          sx={{
            "&:hover": {
              fontWeight: "bold",
            },
          }}
        >
          {path?.name}
        </MUILink>
      ))}
      <MUILink
        underline="none"
        color="black"
        to="#"
        component={Link}
        sx={{ fontWeight: "bold" }}
      >
        {active}
      </MUILink>
    </Breadcrumbs>
  );
};

export default BreadCrumbs;
