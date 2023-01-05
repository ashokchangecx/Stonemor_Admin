import { Card, CardContent, Grid, Paper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import BreadCrumbs from "../reusable/BreadCrumbs";
import { Auth } from "aws-amplify";
import withSuspense from "../../helpers/hoc/withSuspense";
import { Loader } from "../common/Loader";

const Profile = () => {
  const [profile, setProfile] = useState({});

  useEffect(() => {
    Auth.currentUserInfo()
      .then((res) => {
        setProfile(res);
        return res;
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div>
      <BreadCrumbs active="Profile" />
      {profile?.username ? (
        <Paper sx={{ mb: "1rem", mt: 2 }}>
          <Card
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={4} md={2}>
                  <Typography
                    sx={{ mb: 1.5, fontWeight: "bold" }}
                    color="text.primary"
                    gutterBottom
                    variant="body2"
                  >
                    User Name
                  </Typography>
                </Grid>
                <Grid item xs={8} md={10}>
                  <Typography
                    sx={{ mb: 1.5 }}
                    color="text.primary"
                    gutterBottom
                    variant="body2"
                  >
                    {profile.username ? profile?.username : ""}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={4} md={2}>
                  <Typography
                    sx={{ mb: 1.5, fontWeight: "bold" }}
                    color="text.primary"
                    gutterBottom
                    variant="body2"
                  >
                    Email
                  </Typography>
                </Grid>
                <Grid item xs={8} md={10}>
                  <Typography
                    sx={{ mb: 1.5 }}
                    color="text.primary"
                    gutterBottom
                    variant="body2"
                  >
                    {profile.attributes ? profile?.attributes?.email : ""}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={4} md={2}>
                  <Typography
                    sx={{ mb: 1.5, fontWeight: "bold" }}
                    color="text.primary"
                    gutterBottom
                    variant="body2"
                  >
                    Phone
                  </Typography>
                </Grid>
                <Grid item xs={8} md={10}>
                  <Typography
                    sx={{ mb: 1.5 }}
                    color="text.primary"
                    gutterBottom
                    variant="body2"
                  >
                    {profile.attributes
                      ? profile?.attributes?.phone_number
                      : ""}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Paper>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default withSuspense(Profile);
