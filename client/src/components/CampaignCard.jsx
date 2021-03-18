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
          image="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
        />
        <div
          style={{
            position: "absolute",
            height: "180",
            width: "100%",
            top: "20%",
            color: "white",
          }}
        >
          <Grid container>
            <Grid item xs={12}>
              <Box ml={2} textAlign="left" fontWeight="fontWeightBold">
                ${data.currentDonation}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box ml={2} textAlign="left" fontSize={13}>
                raised from <b>{data.noOfDonors}</b> donors
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box ml={2}>
                <LinearWithValueLabel
                  progress={Math.floor(
                    (100 * data.currentDonation) / data.targetDonation
                  )}
                />
              </Box>
            </Grid>
            <Grid item xs={7}>
              <Box ml={2} textAlign="left" fontSize={13}>
                <b>
                  {Math.floor(
                    (100 * data.currentDonation) / data.targetDonation
                  )}
                  %
                </b>{" "}
                of <b>${data.targetDonation}</b>
              </Box>
            </Grid>
            <Grid item xs={5}>
              <Box fontSize={13}>
                <b>{data.endDate - data.startDate}</b> more days
              </Box>
            </Grid>
          </Grid>
        </div>
        <CardContent>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Box fontSize={17} fontWeight="fontWeightBold" textAlign="left">
                {data.campaignName}
              </Box>
            </Grid>
            <Grid item xs={3}>
              <img
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
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
                {data.description}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
