import React, { useState, useEffect } from "react";
import {
  Avatar,
  Card,
  CardContent,
  Input,
  Paper,
  InputBase,
  NativeSelect,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
} from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Link, useParams } from "react-router-dom";
import LinearWithValueLabel from "../components/LinearWithValueLabel";
import { useAlert } from "react-alert";
import gratitudeImage from "../assets/gratitudeImage.png";
import CircularProgress from "@material-ui/core/CircularProgress";
import moment from "moment";
import defaultAvatarLogo from "../assets/Default Avatar logo.svg";
import defaultCharityPicture from "../assets/defaultCharityPicture.jpg";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    height: 40,
    width: 400,
    backgroundColor: "#EAECEF",
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText("#EA3F79"),
    backgroundColor: "#EA3F79",
    "&:hover": {
      backgroundColor: "#EA3F79",
    },
  },
}))(Button);

const ColorButton2 = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText("#EA3F79"),
    backgroundColor: "#DA2425",
    "&:hover": {
      backgroundColor: "#FC2223",
    },
  },
}))(Button);

export default function CampaignPage({
  web3,
  accounts,
  charityContract,
  donationContract,
  isAuthed,
  addressType,
}) {
  const campaignId = useParams();

  const classes = useStyles();
  const alert = useAlert();

  var getCampaign = async (campaignId) => {
    var campaign = {};
    campaign.campaignId = campaignId;
    campaign.campaignName = await charityContract.methods
      .getCampaignName(campaignId)
      .call();
    campaign.campaignDescription = await charityContract.methods
      .getCampaignDescription(campaignId)
      .call();
    campaign.campaignPictureURL = await charityContract.methods
      .getCampaignPictureURL(campaignId)
      .call();
    campaign.campaignTargetDonation = await charityContract.methods
      .getCampaignTargetDonation(campaignId)
      .call();
    campaign.campaignTargetDonation = parseInt(
      campaign.campaignTargetDonation,
      10
    );
    campaign.campaignCurrentDonation = await charityContract.methods
      .getCampaignCurrentDonation(campaignId)
      .call();
    campaign.campaignCurrentDonation = parseInt(
      campaign.campaignCurrentDonation,
      10
    );
    campaign.campaignNoOfDonors = await charityContract.methods
      .getCampaignNoOfDonors(campaignId)
      .call();
    campaign.campaignNoOfDonors = parseInt(campaign.campaignNoOfDonors, 10);
    campaign.campaignStartDate = await charityContract.methods
      .getCampaignStartDate(campaignId)
      .call();
    campaign.campaignEndDate = await charityContract.methods
      .getCampaignEndDate(campaignId)
      .call();
    campaign.campaignStatus = await charityContract.methods
      .getCampaignStatus(campaignId)
      .call();
    campaign.charityId = await charityContract.methods
      .getCampaignCharity(campaignId)
      .call();
    campaign.charityId = parseInt(campaign.charityId, 10);
    campaign.charityName = await charityContract.methods
      .getCharityName(campaign.charityId)
      .call();
    campaign.charityPictureURL = await charityContract.methods
      .getCharityPictureURL(campaign.charityId)
      .call();
    campaign.charityOwner = await charityContract.methods
      .getCharityOwner(campaign.charityId)
      .call();
    return campaign;
  };

  useEffect(() => {
    (async () => {
      let campaign = await getCampaign(campaignId.id);
      setCampaign(campaign);
      console.log(campaign);
      console.log(accounts[0]);
    })();
  }, []);

  const [campaign, setCampaign] = useState();

  const [donationAmount, setDonationAmount] = useState("");
  const [donationUnit, setDonationUnit] = useState("ether");

  const [donationDialogOpen, setDonationDialogOpen] = useState(false);
  const [gratitudeDialogOpen, setGratitudeDialogOpen] = useState(false);

  const [loadingDialogOpen, setLoadingDialogOpen] = useState(false);
  const [endCampaignDialogOpen, setEndCampaignDialogOpen] = useState(false);

  function handleEndCampaignOpen() {
    setEndCampaignDialogOpen(true);
  }

  function handleEndCampaignClose() {
    setEndCampaignDialogOpen(false);
  }

  function handleDonationDialogOpen() {
    setDonationDialogOpen(true);
  }

  function handleDonationDialogClose() {
    setDonationDialogOpen(false);
  }

  function handleGratitudeDialogOpen() {
    setGratitudeDialogOpen(true);
  }

  function handleGratitudeDialogClose() {
    setDonationAmount("");
    setDonationUnit("ether");
    setGratitudeDialogOpen(false);
  }

  function handleLoadingDialogOpen() {
    setLoadingDialogOpen(true);
  }

  function handleLoadingDialogClose() {
    setLoadingDialogOpen(false);
  }

  function onDonateClick() {
    if (donationAmount == undefined || donationAmount == "") {
      alert.show("Please enter a valid donation amount");
    } else {
      handleDonationDialogOpen();
    }
  }

  function convertToWei() {
    let amount = donationAmount;

    if (donationUnit === "ether") {
      amount *= 1000000000000000000;
    } else if (donationUnit === "milliether") {
      amount *= 1000000000000000;
    } else if (donationUnit === "microether") {
      amount *= 1000000000000;
    } else if (donationUnit === "Gwei") {
      amount *= 1000000000;
    } else if (donationUnit === "Mwei") {
      amount *= 1000000;
    } else if (donationUnit === "Kwei") {
      amount *= 1000;
    } else if (donationUnit === "wei") {
      amount *= 1;
    }
    return amount;
  }

  function onConfirmDonation() {
    handleLoadingDialogOpen();
    let amount = convertToWei();
    donationContract.methods
      .donate(campaignId.id, amount.toString())
      .send({
        from: web3.currentProvider.selectedAddress,
        value: amount.toString(),
      })
      .on("receipt", (receipt) => {
        (async () => {
          let campaign = await getCampaign(campaignId.id);
          setCampaign(campaign);
          handleLoadingDialogClose();
          handleDonationDialogClose();
          handleGratitudeDialogOpen();
        })();
      })
      .on("error", (error) => {
        console.log(error.message);
        handleLoadingDialogClose();
        handleDonationDialogClose();
        alert.show("something went wrong");
      });
  }

  function handleConfirmEndCampaign() {
    handleLoadingDialogOpen();
    charityContract.methods
      .endCampaign(campaignId.id)
      .send({
        from: web3.currentProvider.selectedAddress,
      })
      .on("receipt", (receipt) => {
        (async () => {
          let campaign = await getCampaign(campaignId.id);
          setCampaign(campaign);
          handleLoadingDialogClose();
          handleEndCampaignClose();
        })();
      })
      .on("error", (error) => {
        handleLoadingDialogClose();
        handleEndCampaignClose();
        alert.show("something went wrong");
        console.log(error.message);
      });
  }

  function renderGratitudeDialog() {
    return (
      <Dialog open={gratitudeDialogOpen} onClose={handleGratitudeDialogClose}>
        <DialogContent
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img src={gratitudeImage} />
          <DialogContentText style={{ textAlign: "center", marginTop: "18px" }}>
            You have donated{" "}
            <b>
              {donationAmount} {donationUnit}
            </b>{" "}
            to <b>{campaign.campaignName}</b>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    );
  }

  function renderDonationDialog() {
    return (
      <Dialog
        open={donationDialogOpen}
        onClose={handleDonationDialogClose}
        aria-labelledby="confirm-donation-dialog-title"
        aria-describedby="confirm-donation-dialog-description"
      >
        <DialogTitle id="confirm-donation-dialog-title">
          Confirm Donation?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-donation-dialog-description">
            You will be donating{" "}
            <b>
              {donationAmount} {donationUnit}
            </b>{" "}
            to <b>{campaign.campaignName}</b> by <b>{campaign.charityName}</b>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            style={{ outline: "none" }}
            onClick={handleDonationDialogClose}
          >
            Cancel
          </Button>
          <ColorButton
            style={{ outline: "none" }}
            color="primary"
            variant="contained"
            onClick={onConfirmDonation}
          >
            Confirm
          </ColorButton>
        </DialogActions>
      </Dialog>
    );
  }

  function renderEndCampaignDialog() {
    return (
      <Dialog open={endCampaignDialogOpen} onClose={handleEndCampaignClose}>
        <DialogTitle>Confirm End Campaign?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Campaign will be permanently ended
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button style={{ outline: "none" }} onClick={handleEndCampaignClose}>
            Cancel
          </Button>
          <ColorButton
            style={{ outline: "none" }}
            color="primary"
            variant="contained"
            onClick={handleConfirmEndCampaign}
          >
            Confirm
          </ColorButton>
        </DialogActions>
      </Dialog>
    );
  }

  function renderCampaignState() {
    if (campaign.campaignStatus === "0") {
      return (
        <h5 style={{ textAlign: "center", color: "#0ACB1D", margin: 0 }}>
          CAMPAIGN ONGOING
        </h5>
      );
    } else {
      return (
        <h5 style={{ textAlign: "center", color: "#D2BE03", margin: 0 }}>
          CAMPAIGN ENDED
        </h5>
      );
    }
  }

  function renderLoadingDialog() {
    return (
      <Dialog open={loadingDialogOpen}>
        <DialogTitle id="confirm-donation-dialog-title">
          Transaction in progress
        </DialogTitle>
        <DialogContent>
          <Grid
            item
            xs={12}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingBottom: "10px",
            }}
          >
            <CircularProgress />
          </Grid>
        </DialogContent>
      </Dialog>
    );
  }

  function renderEndCampaignButton() {
    if (
      (campaign.charityOwner == accounts[0] || addressType === "CONTRACT") &&
      campaign.campaignStatus === "0"
    ) {
      return (
        <ColorButton2
          style={{
            width: "150px",
            alignSelf: "center",
            marginTop: "8px",
          }}
          variant="contained"
          color="primary"
          onClick={handleEndCampaignOpen}
        >
          END CAMPAIGN
        </ColorButton2>
      );
    }
  }

  return campaign != undefined ? (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#F8FAFD",
        paddingTop: "20px",
        paddingLeft: "28px",
        paddingRight: "28px",
        paddingBottom: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignSelf: "center",
          backgroundColor: "white",
          width: "100%",
          paddingTop: "18px",
          paddingBottom: "18px",
          paddingLeft: "38px",
          paddingRight: "38px",
          borderRadius: "18px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "60%",
          }}
        >
          <div style={{ maxWidth: "100%", overflow: "hidden" }}>
            <img
              src={campaign.campaignPictureURL || defaultCharityPicture}
              style={{ width: "38vw", maxHeight: "60vh", objectFit: "contain" }}
            />
          </div>
          <h5
            style={{
              fontWeight: "bold",
              textAlign: "left",
              marginTop: "38px",
              marginBottom: "18px",
            }}
          >
            Our Campaign Story
          </h5>
          <p style={{ textAlign: "left" }}>{campaign.campaignDescription}</p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: "3%",
            flexGrow: 1,
          }}
        >
          <h3 style={{ textAlign: "left" }}>{campaign.campaignName}</h3>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Link
              to={"/CharityPage/" + campaign.charityId}
              style={{
                textDecoration: "none",
                color: "#3B21CB",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginRight: "1%",
              }}
            >
              <Avatar src={campaign.charityPictureURL || defaultAvatarLogo} />
            </Link>
            <Link
              to={"/CharityPage/" + campaign.charityId}
              style={{
                textDecoration: "none",
                color: "#3B21CB",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {campaign.charityName}
            </Link>
          </div>
          {renderEndCampaignButton()}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginTop: "8px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "start",
              }}
            >
              <h3 style={{ margin: "0", textAlign: "left" }}>
                {campaign.campaignCurrentDonation} wei
              </h3>
              <p style={{ margin: "0", textAlign: "left" }}>
                raised from {campaign.campaignNoOfDonors} donors
              </p>
            </div>
            <div style={{ flexGrow: "1" }}>{renderCampaignState()}</div>
          </div>
          <LinearWithValueLabel
            progress={Math.floor(
              (100 * campaign.campaignCurrentDonation) /
                campaign.campaignTargetDonation
            )}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <div>
              <b>
                {Math.floor(
                  (100 * campaign.campaignCurrentDonation) /
                    campaign.campaignTargetDonation
                )}
                %
              </b>{" "}
              of <b>{campaign.campaignTargetDonation}</b> wei
            </div>
            <div>
              <b>
                {moment(campaign.campaignEndDate, "YYYYMMDD").diff(
                  moment(),
                  "days"
                )}
              </b>{" "}
              more days
            </div>
          </div>
          {campaign.campaignStatus === "0" ? (
            <Card
              style={{ marginTop: "28px", width: "100%", alignSelf: "center" }}
            >
              <CardContent
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <h5 style={{ color: "#3B21CB" }}>Donate Today</h5>
                <Paper
                  style={{ alignSelf: "center", marginTop: "10px" }}
                  className={classes.root}
                >
                  <InputBase
                    className={classes.input}
                    type="number"
                    placeholder="Enter donation amount"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                  />
                  <NativeSelect
                    value={donationUnit}
                    onChange={(e) => setDonationUnit(e.target.value)}
                    inputProps={{ "aria-label": "donationUnit" }}
                  >
                    <option value="ether">ether</option>
                    <option value="milliether">milliether</option>
                    <option value="microether">microether</option>
                    <option value="Gwei">Gwei</option>
                    <option value="Mwei">Mwei</option>
                    <option value="Kwei">Kwei</option>
                    <option value="wei">wei</option>
                  </NativeSelect>
                </Paper>
                <ColorButton
                  style={{
                    marginTop: "18px",
                    width: "150px",
                    alignSelf: "center",
                  }}
                  variant="contained"
                  color="primary"
                  onClick={onDonateClick}
                >
                  DONATE
                </ColorButton>
              </CardContent>
            </Card>
          ) : (
            ""
          )}
        </div>
      </div>
      {renderDonationDialog()}
      {renderGratitudeDialog()}
      {renderLoadingDialog()}
      {renderEndCampaignDialog()}
    </div>
  ) : (
    <Grid item xs={12}>
      <CircularProgress />
    </Grid>
  );
}
