import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import { useHistory } from "react-router-dom";
import LinearWithValueLabel from "./LinearWithValueLabel";
import moment from "moment";
import defaultAvatarLogo from "../assets/Default Avatar logo.svg";
import defaultCharityPicture from "../assets/defaultCharityPicture.jpg";

export default function CampaignCard({ data }) {
  let history = useHistory();
  const useStyles = makeStyles({
    root: {
      maxWidth: 345,
    },
    mediaCard: {
      height: 200,
      background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${
        data.campaignPictureURL || defaultCharityPicture
      })`,
      backgroundSize: "cover",
      color: "white",
    },
  });
  const classes = useStyles();

  const handleClick = () => {
    history.push("/CampaignPage/" + data.campaignId);
  };

  return (
    <Card className={classes.root} onClick={handleClick}>
      <CardActionArea>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="flex-end"
          spacing={0}
          className={classes.mediaCard}
        >
          <Grid item xs={12}>
            <Box ml={2} mt={10} textAlign="left">
              <b>{data.campaignCurrentDonation}</b> wei
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
              of <b>{data.campaignTargetDonation}</b> wei
            </Box>
          </Grid>
          <Grid item xs={5}>
            {data.campaignStatus === "0" && (
              <Box fontSize={13}>
                <b>
                  {moment(data.campaignEndDate, "YYYYMMDD").diff(
                    moment(),
                    "days"
                  )}
                </b>{" "}
                more days
              </Box>
            )}
          </Grid>
        </Grid>
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
                style={{ height: "48px" }}
                src={data.charityPictureURL || defaultAvatarLogo}
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
