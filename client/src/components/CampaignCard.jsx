import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";

import LinearWithValueLabel from "./LinearWithValueLabel";

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 180,
    filter: "brightness(60%)",
  },
});

export default function CampaignCard({ data }) {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={data.campaignPictureURL}
          alt="campaign image"
        />
        <div
          style={{
            position: "absolute",
            height: "180",
            width: "100%",
            top: "25%",
            color: "white",
          }}
        >
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="center"
          >
            <Grid item xs={12}>
              <Box ml={2} textAlign="left" fontWeight="fontWeightBold">
                ${data.campaignCurrentDonation}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box ml={2} textAlign="left" fontSize={13}>
                raised from <b>{data.campaignNoOfDonors}</b> donors
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box ml={2}>
                <LinearWithValueLabel
                  progress={Math.floor(
                    (100 * data.campaignCurrentDonation) /
                      data.campaignTargetDonation
                  )}
                />
              </Box>
            </Grid>
            <Grid item xs={7}>
              <Box ml={2} textAlign="left" fontSize={13}>
                <b>
                  {Math.floor(
                    (100 * data.campaignCurrentDonation) /
                      data.campaignTargetDonation
                  )}
                  %
                </b>{" "}
                of <b>${data.campaignTargetDonation}</b>
              </Box>
            </Grid>
            <Grid item xs={5}>
              <Box fontSize={13}>
                <b>{data.campaignEndDate - data.campaignStartDate}</b> more days
              </Box>
            </Grid>
          </Grid>
        </div>
        <CardContent>
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="center"
            spacing={1}
          >
            <Grid item xs={12}>
              <Box fontSize={17} fontWeight="fontWeightBold" textAlign="left">
                {data.campaignName}
              </Box>
            </Grid>
            <Grid item xs={3}>
              <img
                src={data.charityPictureURL}
                className="rounded-circle img-fluid"
              />
            </Grid>
            <Grid item xs={9}>
              <Box fontSize={14} fontWeight="fontWeightMedium" textAlign="left">
                {data.charityName}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box fontSize={13} fontWeight="fontWeightLight" textAlign="left">
                {data.campaignDescription}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
