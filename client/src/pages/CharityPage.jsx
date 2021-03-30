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
      contact: '',
      address: "",
      status: "",
      currentCampaigns: "",
      pastCampaigns: "",
      valueOfTab:0
    };    
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event, value) {
    console.log(value)
    this.setState({ valueOfTab: value });
  };

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
        const charityContact = await charityContract.methods
        .getCharityContactNumber(this.state.charityId)
        .call();
        this.setState({contact: (this.props.web3.utils.toBN(charityContact)).toString()})
        const charityAddress = await charityContract.methods
        .getCharityContactAddress(this.state.charityId)
        .call();
        this.setState({address: this.props.web3.utils.toUtf8(charityAddress)})
      const length = await charityContract.methods.getNoOfCampaigns().call();
      console.log(length)
      for (var i = 0; i < length; i++) {
        const campaign = [];
        campaign.charityId = parseInt(await charityContract.methods.getCampaignCharity(i).call());
        campaign.charityPictureURL = this.props.web3.utils.toUtf8(await charityContract.methods.getCharityPictureURL(campaign.charityId).call());
        campaign.campaignName = this.props.web3.utils.toUtf8(await charityContract.methods.getCampaignName(i).call());
        campaign.campaignDescription = this.props.web3.utils.toUtf8(await charityContract.methods.getCampaignDescription(i).call());
        campaign.campaignTargetDonation = parseInt(await charityContract.methods.getCampaignTargetDonation(i).call());
        campaign.campaignPictureURL = this.props.web3.utils.toUtf8(await charityContract.methods.getCampaignPictureURL(i).call());
        campaign.campaignStartDate = parseInt(await charityContract.methods.getCampaignStartDate(i).call());
        campaign.campaignEndDate = parseInt(await charityContract.methods.getCampaignEndDate(i).call());
        campaign.status = await charityContract.methods.getCampaignStatus(i).call();
        campaign.campaignCurrentDonation = parseInt(await charityContract.methods.getCampaignCurrentDonation(i).call());
        campaign.campaignNoOfDonors = parseInt(await charityContract.methods.getCampaignNoOfDonors(i).call());
        campaign.charityName = this.props.web3.utils.toUtf8(await charityContract.methods.getCharityName(parseInt(campaign.charityId)).call());

        if (parseInt(campaign.charityId) === this.state.charityId && campaign.status === "0") {
            campaign.id = i;
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
          campaignCurrentDonation: campaign.campaignCurrentDonation,
          campaignTargetDonation: campaign.campaignTargetDonation,
          campaignNoOfDonors: campaign.campaignNoOfDonors,
          campaignStartDate: campaign.campaignStartDate,
          campaignEndDate: campaign.campaignEndDate,
            campaignName: campaign.campaignName,
            charityName: campaign.charityName,
            campaignDescription:campaign.campaignDescription,
            charityPictureURL: campaign.charityPictureURL,
            campaignPictureURL: campaign.campaignPictureURL
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
          campaignCurrentDonation: campaign.campaignCurrentDonation,
          campaignTargetDonation: campaign.campaignTargetDonation,
          campaignNoOfDonors: campaign.campaignNoOfDonors,
          campaignStartDate: campaign.campaignStartDate,
          campaignEndDate: campaign.campaignEndDate,
            campaignName: campaign.campaignName,
            charityName: campaign.charityName,
            campaignDescription:campaign.campaignDescription,
            charityPictureURL: campaign.charityPictureURL,
            campaignPictureURL: campaign.campaignPictureURL
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
            <p>Name:{this.state.name}</p>
            <p>Description:{this.state.description}</p>
            <p>Contact: {this.state.contact}</p>
        <p>Address: {this.state.address}</p>
            <p>Status: {this.state.status}</p>
            <Button size="small" onClick={this.handleVerify}>Verify the Charity</Button>
            <Button size="small" onClick={this.handleReject}>Reject the Charity</Button>
          </div>
        );
      }
      else {
        return (
          <div>

          <p>Name: {this.state.name}</p>
          
          <p>Description: {this.state.description}</p>
          <p>Contact: {this.state.contact}</p>
        <p>Address: {this.state.address}</p>
          <p>Status: {this.state.status}</p>
          </div>

        );
      }
    };
    var view = () => {
      if (this.state.status === "VERIFIED") {
        return (
          <Grid item xs={10}>
            <Tabs value={this.state.valueOfTab} onChange={this.handleChange} indicatorColor="primary" textColor="primary">
              <Tab label="Profile" />
              <Tab label="Campaigns" />
            </Tabs>
            <TabPanel value={this.state.valueOfTab} index={0}>
              <Grid container spacing={3}>
                {profile()}
              </Grid>
            </TabPanel>
            <TabPanel value={this.state.valueOfTab} index={1}>
            <Grid container spacing={3}>
              Ongoing Campaigns: 
                {this.state.currentCampaigns}
                </Grid>
                <Grid container spacing={3}>

              Ended Campaigns: 
              
                {this.state.pastCampaigns}
              </Grid>
            </TabPanel>
          </Grid>
        );
      } else {
        return (
        <Grid item xs={10}>
          <Tabs value={this.state.valueOfTab} onchange={this.handleChange} indicatorColor="primary" textColor="primary">
            <Tab label="Profile" />
          </Tabs>
          <TabPanel value={this.state.valueOfTab} index={0}>
            <Grid container spacing={3}>
              {profile()}
            </Grid>
          </TabPanel>
          </Grid>)
      }
      }

    return (
      <Grid container spacing={2} justify="center">
        <Grid item xs={10}>
          <Box textAlign="left" fontWeight="fontWeightBold" fontSize={26}>
            {this.state.name}
          </Box>
        </Grid>
        {view()}
      </Grid>
    );
  }
}

export default CharityPage;
