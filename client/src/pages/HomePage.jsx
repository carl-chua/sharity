import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";

import CardMedia from "@material-ui/core/CardMedia";
import HomePageBanner from "../assets/homepagebanner.jpg";
import TabPanel from "../components/TabPanel";
import CampaignCard from "../components/CampaignCard";
const useStyles = makeStyles({
  media: {
    height: 250,
  },
});

export default function HomePage() {
  const classes = useStyles();
  const [campaigns, setCampaigns] = useState();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const campaignExample = {
    currentDonation: 95474,
    targetDonation: 99999,
    noOfDonors: 848,
    startDate: 10,
    endDate: 30,
    campaignName: "Help the vulnerable in a crisis..to stay",
    charityName: "JL KAH for Samaritans of Singapore",
    description:
      "It is very sad when people, in the depths of despair, can no longer find reason or hope to live on and think of ending their................",
  };

  return (
    <Grid container spacing={2} justify="center">
      <Grid item xs={12}>
        <Card>
          <CardMedia className={classes.media} image={HomePageBanner} />
          <div
            style={{
              position: "absolute",
              color: "white",
              top: "12%",
              left: "9%",
            }}
          >
            <Box textAlign="left" fontWeight="fontWeightBold" fontSize={40}>
              Give the Gift Today!
            </Box>
          </div>
          <div
            style={{
              position: "absolute",
              color: "white",
              top: "18%",
              left: "9%",
            }}
          >
            <Box textAlign="left" fontWeight="fontWeightBold" fontSize={28}>
              Every little bit counts!
            </Box>
          </div>
        </Card>
      </Grid>
      <Grid item xs={10}>
        <Box textAlign="left" fontWeight="fontWeightBold" fontSize={26}>
          Campaigns
        </Box>
      </Grid>
      <Grid item xs={10}>
        <Tabs
          value={value}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChange}
        >
          <Tab label="Ongoing" />
          <Tab label="Past" />
        </Tabs>
        <TabPanel value={value} index={0}>
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5].map((card, index) => (
              <Grid key={index} item xs={4}>
                <CampaignCard data={campaignExample} />
              </Grid>
            ))}
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Grid container spacing={3}>
            {[1].map((card, index) => (
              <Grid key={index} item xs={4}>
                <CampaignCard data={campaignExample} />
              </Grid>
            ))}
          </Grid>
        </TabPanel>
      </Grid>
    </Grid>
  );
}
