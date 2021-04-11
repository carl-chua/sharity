import React from "react";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import CampaignCard from "../components/CampaignCard";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import defaultAvatarLogo from "../assets/Default Avatar logo.svg";

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
      charityId: parseInt(
        window.location.href.substring(window.location.href.length - 1)
      ),
      owner: false,
      regFee: 0,
      name: "",
      description: "",
      contact: "",
      address: "",
      charityPictureURL: "",
      verificationLink: "",
      status: "",
      currentCampaigns: "",
      pastCampaigns: "",
      ongoingCampaignsIds: [],
      valueOfTab: 0,
      isLoading: true,
      isLoadingButton: false,
      isLoadingDia: false,
      openDialogue: false,
      verificationLinkInput: "",
    };
    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleOpenDia = this.handleOpenDia.bind(this);
    this.handleCloseDia = this.handleCloseDia.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleTabChange(event, value) {
    this.setState({ valueOfTab: value });
  }

  handleOpenDia() {
    this.setState({ openDialogue: true });
  }

  handleCloseDia() {
    this.setState({ openDialogue: false });
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  componentDidMount = async () => {
    var currentCampaigns = [];
    var pastCampaigns = [];
    const charityContract = this.props.charityContract;
    const accounts = this.props.accounts;
    const owner = await charityContract.methods.getContractOwner().call();
    if (accounts[0] === owner) {
      this.setState({ owner: true });
    }
    const charityRegFee = await charityContract.methods.getRegFee().call();
    this.setState({ regFee: parseInt(charityRegFee) });

    const charityStatus = await charityContract.methods
      .getCharityStatus(this.state.charityId)
      .call();
    if (parseInt(charityStatus) === 0) {
      this.setState({ status: "PENDING" });
    }
    if (parseInt(charityStatus) === 1) {
      this.setState({ status: "VERIFIED" });
    }
    if (parseInt(charityStatus) === 2) {
      this.setState({ status: "REJECTED" });
    }
    const charityName = await charityContract.methods
      .getCharityName(this.state.charityId)
      .call();
    this.setState({ name: charityName });
    const charityPictureURL = await charityContract.methods
      .getCharityPictureURL(this.state.charityId)
      .call();
    this.setState({ charityPictureURL: charityPictureURL });
    const charityDescription = await charityContract.methods
      .getCharityDescription(this.state.charityId)
      .call();
    this.setState({
      description: charityDescription,
    });
    const charityContact = await charityContract.methods
      .getCharityContactNumber(this.state.charityId)
      .call();
    this.setState({
      contact: this.props.web3.utils.toBN(charityContact).toString(),
    });
    const charityAddress = await charityContract.methods
      .getCharityContactAddress(this.state.charityId)
      .call();
    this.setState({ address: charityAddress });
    const charityVerificationLink = await charityContract.methods
      .getCharityVerificationLink(this.state.charityId)
      .call();

    if (charityVerificationLink != null) {
      this.setState({ verificationLink: charityVerificationLink });
    }
    const length = await charityContract.methods.getNoOfCampaigns().call();
    for (var i = 0; i < length; i++) {
      const campaign = [];
      campaign.campaignId = i;
      campaign.charityId = parseInt(
        await charityContract.methods.getCampaignCharity(i).call()
      );
      campaign.charityPictureURL = await charityContract.methods
        .getCharityPictureURL(campaign.charityId)
        .call();
      campaign.campaignName = await charityContract.methods
        .getCampaignName(i)
        .call();
      campaign.campaignDescription = await charityContract.methods
        .getCampaignDescription(i)
        .call();
      campaign.campaignTargetDonation = parseInt(
        await charityContract.methods.getCampaignTargetDonation(i).call()
      );
      campaign.campaignPictureURL = await charityContract.methods
        .getCampaignPictureURL(i)
        .call();
      campaign.campaignStartDate = parseInt(
        await charityContract.methods.getCampaignStartDate(i).call()
      );
      campaign.campaignEndDate = parseInt(
        await charityContract.methods.getCampaignEndDate(i).call()
      );
      campaign.status = await charityContract.methods
        .getCampaignStatus(i)
        .call();
      campaign.campaignCurrentDonation = parseInt(
        await charityContract.methods.getCampaignCurrentDonation(i).call()
      );
      campaign.campaignNoOfDonors = parseInt(
        await charityContract.methods.getCampaignNoOfDonors(i).call()
      );
      campaign.charityName = await charityContract.methods
        .getCharityName(parseInt(campaign.charityId))
        .call();

      if (
        parseInt(campaign.charityId) === this.state.charityId &&
        campaign.status === "0"
      ) {
        campaign.id = i;
        this.state.ongoingCampaignsIds.push(parseInt(campaign.id));
        currentCampaigns.push(campaign);
      }
      if (
        parseInt(campaign.charityId) === this.state.charityId &&
        campaign.status === "1"
      ) {
        campaign.id = i;
        pastCampaigns.push(campaign);
      }
    }

    var currentCampaignsCards = currentCampaigns.map((campaign) => {
      const classes = useStyles;
      console.log(campaign);
      const data = {
        campaignId: campaign.campaignId,
        campaignCurrentDonation: campaign.campaignCurrentDonation,
        campaignTargetDonation: campaign.campaignTargetDonation,
        campaignNoOfDonors: campaign.campaignNoOfDonors,
        campaignStartDate: campaign.campaignStartDate,
        campaignEndDate: campaign.campaignEndDate,
        campaignName: campaign.campaignName,
        charityName: campaign.charityName,
        campaignDescription: campaign.campaignDescription,
        charityPictureURL: campaign.charityPictureURL,
        campaignPictureURL: campaign.campaignPictureURL,
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
        campaignId: campaign.campaignId,
        campaignCurrentDonation: campaign.campaignCurrentDonation,
        campaignTargetDonation: campaign.campaignTargetDonation,
        campaignNoOfDonors: campaign.campaignNoOfDonors,
        campaignStartDate: campaign.campaignStartDate,
        campaignEndDate: campaign.campaignEndDate,
        campaignName: campaign.campaignName,
        charityName: campaign.charityName,
        campaignDescription: campaign.campaignDescription,
        charityPictureURL: campaign.charityPictureURL,
        campaignPictureURL: campaign.campaignPictureURL,
      };
      return (
        <Grid key={campaign.id} item xs={4}>
          <CampaignCard data={data} />
        </Grid>
      );
    });

    this.setState({
      currentCampaigns: currentCampaignsCards,
      pastCampaigns: pastCampaignsCards,
      isLoading: false,
    });
  };

  handleVerify = () => {
    this.setState({ isLoadingDia: true });
    try {
      this.props.charityContract.methods
        .verifyCharity(this.state.charityId, this.state.verificationLinkInput)
        .send({ from: this.props.accounts[0] })
        .on("receipt", (receipt) => {
          console.log(receipt);
          this.setState({ isLoadingDia: false });
          alert("Verification successful");
          this.refreshPage();
        })
        .on("error", (error) => {
          console.log(error.message);
          this.setState({ isLoadingDia: false });
          alert(
            "Verification unsuccessful, please verify again. Error Occured: " +
              error.message
          );
        });
    } catch (err) {
      console.log(err);
    }
  };

  handleReject = () => {
    this.setState({ isLoadingButton: true });
    try {
      this.props.charityContract.methods
        .rejectCharity(this.state.charityId)
        .send({ from: this.props.accounts[0] })
        .on("receipt", (receipt) => {
          console.log(receipt);
          this.setState({ isLoadingButton: false });

          alert("Rejection successful");
          this.refreshPage();
        })
        .on("error", (error) => {
          console.log(error.message);
          this.setState({ isLoadingButton: false });

          alert(
            "Rejection unsuccessful, please verify again. Error Occured: " +
              error.message
          );
        });
    } catch (err) {
      console.log(err);
    }
  };

  handleRevoke = async() => {
    this.setState({ isLoadingButton: true });
    console.log(this.state.ongoingCampaignsIds);
    
    for (var i = 0; i < this.state.ongoingCampaignsIds.length; i++) {
      await this.props.charityContract.methods.endCampaign(parseInt(this.state.ongoingCampaignsIds[i])).send({ from: this.props.accounts[0] })
    }
    const donors = await this.props.charityContract.methods.getDonors(this.state.charityId).call({ from: this.props.accounts[0] })
    console.log(donors)
    console.log(this.state.regFee)
    const amount = this.state.regFee / donors.length;
    console.log(amount);
    const owner = await this.props.charityContract.methods.getContractOwner().call();
    for (var i = 0; i < donors.length; i++) {
      console.log(donors[i])
      this.props.web3.eth.sendTransaction({
        from: owner.toString(),
        to: donors[i].toString(),
        value: amount.toString(),
      }).on("receipt", (receipt) => {console.log(receipt)})
    };
    console.log("here")
    const revoke = await this.props.charityContract.methods
    .revokeCharity(this.state.charityId)
    .send({ from: this.props.accounts[0] })

    this.setState({ isLoadingButton: false });
    alert("Revoke success")
    this.refreshPage();
  };

  refreshPage = () => {
    window.location.reload(false);
  };

  render() {
    const useStyles = makeStyles((theme) => ({
      form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(3),
      },
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
      submit: {
        margin: theme.spacing(3, 0, 2),
      },
    }));
    const classes = useStyles;

    var profile = () => {
      if (this.state.owner === true && this.state.status === "PENDING") {
        return (
          <div>
            <img
              src={this.state.charityPictureURL || defaultAvatarLogo}
              alt="charity avatar"
              width="300"
              height="300"
            ></img>
            <p>Name:{this.state.name}</p>
            <p>Description:{this.state.description}</p>
            <p>Contact: {this.state.contact}</p>
            <p>Address: {this.state.address}</p>
            <p>Status: {this.state.status}</p>
            <Button
              size="small"
              color="primary"
              variant="outlined"
              onClick={this.handleOpenDia}
            >
              Verify the Charity
            </Button>
            <Dialog
              open={this.state.openDialogue}
              onClose={this.handleCloseDia}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">
                Verification Link
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Enter the link that evidence the legitimacy of the charity.
                </DialogContentText>
                <TextField
                  name="verificationLinkInput"
                  variant="outlined"
                  required
                  fullWidth
                  id="verificationLink"
                  value={this.state.verificationLinkInput}
                  onChange={this.handleInputChange}
                  label="Verification Link"
                  autoFocus
                />
              </DialogContent>
              <DialogActions>
                {this.state.isLoadingDia ? (
                  <Grid item xs={12}>
                    <CircularProgress />
                  </Grid>
                ) : (
                  <span></span>
                )}
                <Button onClick={this.handleVerify} color="primary">
                  Submit
                </Button>
              </DialogActions>
            </Dialog>
            {this.state.isLoadingButton ? (
              <Grid item xs={12}>
                <CircularProgress />
              </Grid>
            ) : (
              <span></span>
            )}
            <Button
              size="small"
              color="primary"
              variant="outlined"
              onClick={this.handleReject}
            >
              Reject the Charity
            </Button>
            <Typography>
              After submission, please wait for alert to come out.
            </Typography>
          </div>
        );
      } else if (
        this.state.owner === true &&
        this.state.status === "VERIFIED"
      ) {
        return (
          <div>
            <img
              src={this.state.charityPictureURL || defaultAvatarLogo}
              alt="charity avatar"
              width="300"
              height="300"
            ></img>
            <p>Name: {this.state.name}</p>
            <p>Description: {this.state.description}</p>
            <p>Contact: {this.state.contact}</p>
            <p>Address: {this.state.address}</p>
            <p>Verification Link: {this.state.verificationLink}</p>
            <p>Status: {this.state.status}</p>
            {this.state.isLoadingButton ? (
              <Grid item xs={12}>
                <CircularProgress />
              </Grid>
            ) : (
              <span></span>
            )}
                {this.state.isLoading ? (<span></span>
                ) : (
                  <Button
              size="small"
              color="primary"
              variant="outlined"
              onClick={this.handleRevoke}
            >
              Revoke the Charity
            </Button>
                )}
            
            <Typography>
              After submission, please wait for alert to come out.
            </Typography>
          </div>
        );
      } else if (this.state.status === "REJECTED") {
        return (
          <div>
            <Typography>
              This is not a valid charity or the charity has been rejected.
              Please find another.{" "}
            </Typography>
          </div>
        );
      } else {
        return (
          <div>
            <img
              src={this.state.charityPictureURL || defaultAvatarLogo}
              alt="charity avatar"
              width="300"
              height="300"
            ></img>
            <Grid>
            <p>Name: {this.state.name}</p>
            <p>Description: {this.state.description}</p>
            <p>Contact: {this.state.contact}</p>
            <p>Address: {this.state.address}</p>
            <p>Verification Link: {this.state.verificationLink}</p>
            <p>Status: {this.state.status}</p>
            </Grid>
          </div>
        );
      }
    };
    var view = () => {
      if (this.state.status === "VERIFIED") {
        return (
          <Grid item xs={10}>
            <Tabs
              value={this.state.valueOfTab}
              onChange={this.handleTabChange}
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label="Ongoing Campaigns" />
              <Tab label="Ended Campaigns" />
            </Tabs>
            <TabPanel value={this.state.valueOfTab} index={0}>
              <Grid container spacing={3}>
                {this.state.isLoading ? (
                  <Grid item xs={12}>
                    <CircularProgress />
                  </Grid>
                ) : (
                  this.state.currentCampaigns
                )}
              </Grid>
            </TabPanel>
            <TabPanel value={this.state.valueOfTab} index={1}>
              <Grid container spacing={3}>
                {this.state.isLoading ? (
                  <Grid item xs={12}>
                    <CircularProgress />
                  </Grid>
                ) : (
                  this.state.pastCampaigns
                )}
              </Grid>
            </TabPanel>
          </Grid>
        );
      } else {
        return;
      }
    };

    return (
      <Grid container spacing={2} justify="center">
          <Box textAlign="left"  fontSize={26}>
            {profile()}
          </Box>
        {view()}
      </Grid>
    );
  }
}

export default CharityPage;
