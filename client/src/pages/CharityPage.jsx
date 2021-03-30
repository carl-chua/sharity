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
import { useLocation, Link } from "react-router-dom";

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
      charityId: parseInt(window.location.href.substring(window.location.href.length - 1)),
      owner: false,
      name: "",
      description: "",
      status: "",
      currentCampaigns: "",
      pastCampaigns: "",
    };    
  }

  componentDidMount = async() => {
    console.log(this.state)
    var currentCampaigns = [];
    var pastCampaigns = [];
      const charityContract = this.props.charityContract;
      const accounts = this.props.accounts;
      const owner = await charityContract.methods.getContractOwner().call();
      console.log(owner)
      if (accounts[0] === owner) {
        this.setState({ owner: true });
      }
      const charityStatus = await charityContract.methods
        .getCharityStatus(this.state.charityId)
        .call();
        if (parseInt(charityStatus) === 0) {
            this.setState({status: "PENDING"});
        }
        if (parseInt(charityStatus) === 1) {
          this.setState({status: "VERIFIED"});
        }
        if (parseInt(charityStatus) === 2) {
          this.setState({status: "REJECTED"});
        }
        const charityName = await charityContract.methods
        .getCharityName(this.state.charityId)
        .call();
        this.setState({name: this.props.web3.utils.toUtf8(charityName)})
        const charityDescription = await charityContract.methods
        .getCharityDescription(this.state.charityId)
        .call();
        this.setState({description: this.props.web3.utils.toUtf8(charityDescription)})
      const length = await charityContract.methods.getNoOfCampaigns().call();
      console.log(length)
      for (var i = 0; i < length; i++) {
        const campaign = [];
        campaign.charityId = await charityContract.methods.getCampaignCharity(i).call();
        campaign.name = this.props.web3.utils.toUtf8(await charityContract.methods.getCampaignName(i).call());
        campaign.description = this.props.web3.utils.toUtf8(await charityContract.methods.getCampaignDescription(i).call());
        campaign.targetDonation = await charityContract.methods.getCampaignTargetDonation(i).call();
        campaign.pictureURL = this.props.web3.utils.toUtf8(await charityContract.methods.getCampaignPictureURL(i).call());
        console.log()
        campaign.startDate = await charityContract.methods.getCampaignStartDate(i).call();
        campaign.endDate = await charityContract.methods.getCampaignEndDate(i).call();
        campaign.status = await charityContract.methods.getCampaignStatus(i).call();
        campaign.currentDonation = await charityContract.methods.getCampaignCurrentDonation(i).call();
        campaign.noOfDonors = await charityContract.methods.getCampaignNoOfDonors(i).call();
        campaign.charityName = await charityContract.methods.getCharityName(parseInt(campaign.charityId)).call();

        if (parseInt(campaign.charityId) === this.state.charityId && campaign.status === "0") {
            campaign.id = i;
            console.log(campaign.name)
            currentCampaigns.push(campaign);
        }
        if (parseInt(campaign.charityId) === this.state.charityId && campaign.status === "1") {
            campaign.id = i;
            pastCampaigns.push(campaign);
        }
        console.log(campaign)
      }
    

      console.log(currentCampaigns)
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
        currentCampaigns: currentCampaignsCards,
        pastCampaigns: pastCampaignsCards
      });
    
  }

  handleVerify = () => {
    try {
            this.props.charityContract.methods.verifyCharity(this.state.charityId).send({from: this.props.accounts[0]})
            .on("receipt", (receipt) => {
                console.log(receipt)
                alert("Verification successful")
                this.refreshPage()
            })
            .on("error", error => {
                console.log(error.message);
                alert("Verification unsuccessful, please verify again. Error Occured: " + error.message)
            });
        } catch (err) {
            console.log(err)
        }
  }

  handleReject = () => {
    try {
            this.props.charityContract.methods.rejectCharity(this.state.charityId).send({from: this.props.accounts[0]})
            .on("receipt", (receipt) => {
                console.log(receipt)
                alert("Rejection successful")
                this.refreshPage()
            })
            .on("error", error => {
                console.log(error.message);
                alert("Rejection unsuccessful, please verify again. Error Occured: " + error.message)
            });
        } catch (err) {
            console.log(err)
    }
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
    const classes = useStyles;

    var profile = () => {
      if (this.state.owner === true && this.state.status === "PENDING") {
        return (
          <div>
            <p>{this.state.name}</p>
            <p>{this.state.description}</p>
            <p>Status: {this.state.status}</p>
            <Button size="small" onClick={this.handleVerify}>Verify the Charity</Button>
            <Button size="small" onClick={this.handleReject}>Reject the Charity</Button>
          </div>
        );
      }
      else {
        return (
          <div>

          <p>{this.state.name}</p>
          <p>{this.state.description}</p>
          <p>Status: {this.state.status}</p>
          </div>

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
                {profile()}
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
            {this.state.charityName}
          </Box>
        </Grid>
        {view()}
        {this.state.currentCampaigns}

      </Grid>
    );
  }
}

export default CharityPage;
