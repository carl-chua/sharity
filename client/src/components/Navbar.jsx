import React, { useState, useEffect } from "react";
import {
  InputBase,
  IconButton,
  Paper,
  Button,
  Avatar,
} from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import searchLogo from "../assets/Search logo.svg";
import defaultAvatarLogo from "../assets/Default Avatar logo.svg";
import { Link, useHistory } from "react-router-dom";
import MetaMaskOnboarding from "@metamask/onboarding";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    height: 30,
    width: 250,
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
    color: theme.palette.getContrastText("#3B21CB"),
    backgroundColor: "#3B21CB",
    "&:hover": {
      backgroundColor: "#260eab",
    },
  },
}))(Button);

export default function Navbar({
  web3,
  accounts,
  charityContract,
  donationContract,
  isAuthed,
  addressType,
}) {
  const history = useHistory();
  const classes = useStyles();
  const forwarderOrigin = "http://localhost:3000";
  const onboarding = new MetaMaskOnboarding({ forwarderOrigin });

  //const [metamaskInstalled, setMetamaskInstalled] = useState(false);

  /*useEffect(() => {
    const { ethereum } = window;
    setMetamaskInstalled(Boolean(ethereum && ethereum.isMetaMask));
  }, []);*/

  const [charity, setCharity] = useState();

  useEffect(() => {
    if (addressType === "CHARITYOWNER") {
      (async () => {
        // I need the charity ID and the verified status
        let charity = {};
        charity.id = await charityContract.methods
          .getCharityIdByAddress(web3.currentProvider.selectedAddress)
          .call();
        charity.profilePicture = await charityContract.methods
          .getCharityPictureURLByAddress(web3.currentProvider.selectedAddress)
          .call();
        charity.charityStatus = await charityContract.methods
          .getCharityStatusByAddress(web3.currentProvider.selectedAddress)
          .call();

        setCharity(charity);
      })();
    }
  }, [addressType]);

  /*function handleClickInstallMetaMask() {
    onboarding.startOnboarding();
  }*/

  function renderButtonsComponent() {
    if (addressType === "DONOR") {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Link
            to="/AllCharities"
            style={{
              textDecoration: "none",
              color: "#3B21CB",
              marginRight: "18px",
            }}
          >
            All Charities
          </Link>
          <Link
            to="/RegisterCharity"
            style={{
              textDecoration: "none",
              color: "#3B21CB",
              marginRight: "18px",
            }}
          >
            Register Charity
          </Link>
          <Link
            to="/TransactionHistory"
            style={{
              textDecoration: "none",
              color: "#3B21CB",
            }}
          >
            My Donations
          </Link>
        </div>
      );
    } else if (addressType === "CHARITYOWNER") {
      if (charity == undefined) {
        return "";
      } else if (charity.charityStatus === "0") {
        // Unverified
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Link
              to="/AllCharities"
              style={{
                textDecoration: "none",
                color: "#3B21CB",
                marginRight: "18px",
              }}
            >
              All Charities
            </Link>
            <Link
              to="/TransactionHistory"
              style={{
                textDecoration: "none",
                color: "#3B21CB",
                marginRight: "18px",
              }}
            >
              My Donations
            </Link>
            <Link
              onClick={() => {
                history.push(`/CharityPage/${charity.id}`);
                window.location.reload();
              }}
            >
              <Avatar src={charity.profilePicture || defaultAvatarLogo} />
            </Link>
          </div>
        );
      } else if (charity.charityStatus === "1") {
        // Verified
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Link
              to="/AllCharities"
              style={{
                textDecoration: "none",
                color: "#3B21CB",
                marginRight: "18px",
              }}
            >
              All Charities
            </Link>
            <Link
              to="/CreateCampaign"
              style={{
                textDecoration: "none",
                color: "#3B21CB",
                marginRight: "18px",
              }}
            >
              Create Campaign
            </Link>
            <Link
              to="/TransactionHistory"
              style={{
                textDecoration: "none",
                color: "#3B21CB",
                marginRight: "18px",
              }}
            >
              My Donations
            </Link>
            <Link
              onClick={() => {
                history.push(`/CharityPage/${charity.id}`);
                window.location.reload();
              }}
            >
              <Avatar src={charity.profilePicture || defaultAvatarLogo} />
            </Link>
          </div>
        );
      } else if (charity.charityStatus === "2") {
        // Rejected (same as donor)
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Link
              to="/AllCharities"
              style={{
                textDecoration: "none",
                color: "#3B21CB",
                marginRight: "18px",
              }}
            >
              All Charities
            </Link>
            <Link
              to="/RegisterCharity"
              style={{
                textDecoration: "none",
                color: "#3B21CB",
                marginRight: "18px",
              }}
            >
              Register Charity
            </Link>
            <Link
              to="/TransactionHistory"
              style={{
                textDecoration: "none",
                color: "#3B21CB",
              }}
            >
              My Donations
            </Link>
          </div>
        );
      }
    } else if (addressType === "CONTRACT") {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Link
            to="/AllCharities"
            style={{
              textDecoration: "none",
              color: "#3B21CB",
              marginRight: "18px",
            }}
          >
            All Charities
          </Link>
          <Link
            to="/TransactionHistory"
            style={{
              textDecoration: "none",
              color: "#3B21CB",
            }}
          >
            My Donations
          </Link>
        </div>
      );
    }
  }

  return (
    <div
      style={{
        height: "45px",
        paddingTop: "8px",
        paddingBottom: "8px",
        paddingLeft: "25px",
        paddingRight: "25px",
        backgroundColor: "#FFFFFF",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "35%",
        }}
      >
        <div>
          <Paper component="form" className={classes.root}>
            <IconButton
              style={{ outline: "none" }}
              className={classes.iconButton}
              aria-label="search"
            >
              <img src={searchLogo} alt="searchLogo" />
            </IconButton>
            <InputBase className={classes.input} placeholder="Search" />
          </Paper>
        </div>
        <Link to="/" style={{ color: "inherit", textDecoration: "inherit" }}>
          <h3 style={{ fontStyle: "italic", fontSize: "28px" }}>Sharity</h3>
        </Link>
      </div>
      <div>{renderButtonsComponent()}</div>
    </div>
  );
}
