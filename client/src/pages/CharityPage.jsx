import React from "react";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import CampaignCard from "../components/CampaignCard";
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';

import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TabPanel from "../components/TabPanel";
const useStyles = makeStyles({
  root: {
    maxWidth: 100,
  },
  media: {
    height: 140,
  },
});

class CharityPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      charityId: this.props.location.state.id,
      owner: false,
      charity: "",
      status: "",
      currentCampaigns: "",
      pastCampaigns: "",
    };
  }

  componentDidMount() {
    const getCharities = async () => {
      const charityContract = this.props.charityContract;
      const accounts = this.props.accounts;
      const owner = await charityContract.methods.contractOwner().call();
      if (accounts[0] === owner) {
        this.setState({ owner: true });
      }
      const charity = await charityContract.methods
        .charities(this.state.charityId)
        .call();
        if (charity.charityStatus === 0) {
            this.state.setState({status: "PENDING"});
        }
        if (charity.charityStatus === 1) {
          this.state.setState({status: "VERIFIED"});
        }
        if (charity.charityStatus === 2) {
          this.state.setState({status: "REJECTED"});
        }
      const length = await charityContract.methods.noOfCampaigns().call();
      var currentCampaigns = [];
      var pastCampaigns = [];
      for (var i = 0; i < length; i++) {
        const campaign = await charityContract.methods.campaigns(i).call();
        if (campaign.charityId === this.state.charityId && campaign.campaignStatus === 0) {
            campaign.id = i;
            currentCampaigns.push(campaign);
        }
        if (campaign.charityId === this.state.charityId && campaign.campaignStatus === 1) {
            campaign.id = i;
            pastCampaigns.push(campaign);
        }
      }

      var currentCampaignsCards = currentCampaigns.map((campaign) => {
        const classes = useStyles;
        const data = {
            currentDonation: campaign.currentDonation,
            targetDonation: campaign.targetDonation,
            noOfDonors: campaign.noOfDonors,
            startDate: campaign.startDate,
            endDate: campaign.endDate,
            campaignName: campaign.campaignName,
            charityName: campaign.charityName,
            description:campaign.description,
          };
        return (
          <Grid key={campaign.id} item xs={4}>
              <CampaignCard data={data} />
          </Grid>
        );
      });

      var pastCampaignsCards = pastCampaigns.map((campaign) => {
        const classes = useStyles;
        const data = {
            currentDonation: campaign.currentDonation,
            targetDonation: campaign.targetDonation,
            noOfDonors: campaign.noOfDonors,
            startDate: campaign.startDate,
            endDate: campaign.endDate,
            campaignName: campaign.campaignName,
            charityName: campaign.charityName,
            description:campaign.description,
          };
        return (
          <Grid key={campaign.id} item xs={4}>
              <CampaignCard data={data} />
          </Grid>
        );
      });

      this.setState({
        charity: charity,
        currentCampaigns: currentCampaignsCards,
        pastCampaigns: pastCampaignsCards
      });
    };

    getCharities();
  }

  handleVerify = () => {
    /*try {
            this.props.charityContract.methods.verifyCharity(this.state.charityId).send({from: this.props.accounts[0]})
            .on("receipt", (receipt) => {
                console.log(receipt)
                alert("Verification successful=")
                this.refreshPage()
            })
            .on("error", error => {
                console.log(error.message);
                alert("Verification unsuccessful, please verify again. Error Occured: " + error.message)
            });
        } catch (err) {
            console.log(err)
        }*/
  }

  handleReject = () => {
    /*try {
            this.props.charityContract.methods.rejectCharity(this.state.charityId).send({from: this.props.accounts[0]})
            .on("receipt", (receipt) => {
                console.log(receipt)
                alert("Rejection successful=")
                this.refreshPage()
            })
            .on("error", error => {
                console.log(error.message);
                alert("Rejection unsuccessful, please verify again. Error Occured: " + error.message)
            });
        } catch (err) {
            console.log(err)
    }*/
  }

  refreshPage = () => {
    window.location.reload(false);
  }

  render() {
    const useStyles = makeStyles({
      root: {
        minWidth: 275,
      },
      bullet: {
        display: "inline-block",
        margin: "0 2px",
        transform: "scale(0.8)",
      },
      title: {
        fontSize: 14,
      },
      pos: {
        marginBottom: 12,
      },
    });
    const classes = useStyles();

    var profile = () => {
      if (this.state.owner === true && this.state.status === "PENDING") {
        return (
            <Card className={classes.root}>
            <CardContent>
                <Typography variant="body2" component="p">
                {this.state.charity.description}
                </Typography>
                <Typography variant="body2" component="p">
                Status: {this.state.status}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" onclick={this.handleVerify}>Verify the Charity</Button>
                <Button size="small" onclick={this.handleVerify}>Reject the Charity</Button>
            </CardActions>
            </Card>
        );
      }
      else {
        return (
            <Card className={classes.root}>
            <CardContent>
                <Typography variant="body2" component="p">
                {this.state.charity.description}
                </Typography>
                <Typography variant="body2" component="p">
                Status: {this.state.status}
                </Typography>
            </CardContent>
            </Card>
        );
      }
    };
    var view = () => {
        return (
          <Grid item xs={10}>
            <Tabs value={0} indicatorColor="primary" textColor="primary">
              <Tab label="Profile" />
              <Tab label="Campaigns" />
            </Tabs>
            <TabPanel value={0} index={0}>
              <Grid container spacing={3}>
                {profile}
              </Grid>
            </TabPanel>
            <TabPanel value={0} index={1}>
              Ongoing Campaigns: 
              <Grid container spacing={3}>
                {this.state.currentCampaigns}
              </Grid>
              Ended Campaigns: 
              <Grid container spacing={3}>
                {this.state.pastCampaigns}
              </Grid>
            </TabPanel>
          </Grid>
        );
      }

    return (
      <Grid container spacing={2} justify="center">
        <Grid item xs={10}>
          <Box textAlign="left" fontWeight="fontWeightBold" fontSize={26}>
            {this.state.charity.charityName}
          </Box>
        </Grid>
        {view}
      </Grid>
    );
  }
}

export default CharityPage;
