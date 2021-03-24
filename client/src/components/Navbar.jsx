import React from "react";
import { InputBase, IconButton, Paper, Button } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import searchLogo from "../assets/Search logo.svg";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: 300,
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

export default function Navbar() {
  const classes = useStyles();

  function renderButtonsComponent() {
    return (
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
            marginRight: "18px",
          }}
        >
          All Charities
        </Link>
        <ColorButton
          style={{
            width: "210px",
            outline: "none",
          }}
          variant="contained"
          color="primary"
        >
          CONNECT TO A WALLET
        </ColorButton>
      </div>
    );
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
        <h3 style={{ fontStyle: "italic", fontSize: "28px" }}>Sharity</h3>
      </div>
      <div>{renderButtonsComponent()}</div>
    </div>
  );
}
