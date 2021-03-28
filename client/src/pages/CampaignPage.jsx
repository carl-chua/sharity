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
} from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import LinearWithValueLabel from "../components/LinearWithValueLabel";
import { useAlert } from "react-alert";
import gratitudeImage from "../assets/gratitudeImage.png";

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

export default function CampaignPage() {
  const classes = useStyles();
  const alert = useAlert();
  const campaignExample = {
    currentDonation: 95474,
    targetDonation: 99999,
    noOfDonors: 848,
    startDate: 10,
    endDate: 30,
    campaignName: "Help the vulnerable in a crisis to survive this pandemic",
    charityName: "JL KAH for Samaritans of Singapore",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  };

  const [donationAmount, setDonationAmount] = useState("");
  const [donationUnit, setDonationUnit] = useState("ether");

  const [donationDialogOpen, setDonationDialogOpen] = useState(false);
  const [gratitudeDialogOpen, setGratitudeDialogOpen] = useState(false);

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

  function onDonateClick() {
    if (donationAmount == undefined || donationAmount == "") {
      alert.show("Please enter a valid donation amount");
    } else {
      handleDonationDialogOpen();
    }
  }

  function onConfirmDonation() {
    handleDonationDialogClose();
    handleGratitudeDialogOpen();
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
            to <b>{campaignExample.campaignName}</b>
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
            to <b>{campaignExample.campaignName}</b> by{" "}
            <b>{campaignExample.charityName}</b>
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

  function renderCampaignState() {
    return <h5 style={{ textAlign: "center", color: "#0ACB1D" }}>ONGOING</h5>;
  }

  return (
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
              src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              style={{ width: "100%", objectFit: "contain" }}
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
          <p style={{ textAlign: "left" }}>{campaignExample.description}</p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: "3%",
          }}
        >
          <h3 style={{ textAlign: "left" }}>{campaignExample.campaignName}</h3>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Link
              style={{
                textDecoration: "none",
                color: "#3B21CB",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginRight: "1%",
              }}
            >
              <Avatar src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />
            </Link>
            <Link
              style={{
                textDecoration: "none",
                color: "#3B21CB",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {campaignExample.charityName}
            </Link>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginTop: "3%",
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
                ${campaignExample.currentDonation}
              </h3>
              <p style={{ margin: "0", textAlign: "left" }}>
                raised from {campaignExample.noOfDonors} donors
              </p>
            </div>
            <div style={{ flexGrow: "1" }}>{renderCampaignState()}</div>
          </div>
          <LinearWithValueLabel
            progress={Math.floor(
              (100 * campaignExample.currentDonation) /
                campaignExample.targetDonation
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
                  (100 * campaignExample.currentDonation) /
                    campaignExample.targetDonation
                )}
                %
              </b>{" "}
              of <b>${campaignExample.targetDonation}</b>
            </div>
            <div>
              <b>{campaignExample.endDate - campaignExample.startDate}</b> more
              days
            </div>
          </div>
          <Card
            style={{ marginTop: "28px", width: "80%", alignSelf: "center" }}
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
        </div>
      </div>
      {renderDonationDialog()}
      {renderGratitudeDialog()}
    </div>
  );
}
