import React from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

import firebase from "firebase";
import FileUploader from "react-firebase-file-uploader";

class CreateCampaign extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      campaignId: 0,
      name: "",
      description: "",
      target: 0,
      startDate: String(new Date()),
      endDate: String(new Date()),
      isUploading: false,
      progress: 0,
      avatarURL: "",
      message: "",
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
  }

  componentDidMount = async() => {
    const id =  await this.props.charityContract.methods
        .getNoOfCampaigns()
        .call();
    this.setState({campaignId: id})
    console.log("AFTER mount ")
    console.log(this.state)
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  }

  handleStartDateChange(date) {
    this.setState({ startDate: date });
  }

  handleEndDateChange(date) {
    this.setState({ endDate: date });
  }

  getFileName() {
    return 'campaign' + this.state.campaignId + '.png'
  }

  handleSubmit = (e) => {
    e.preventDefault();
    console.log("SUBMIT ")
    console.log(this.state);
    try {
      var date = new Date(this.state.startDate);
      var parsedStartDate = parseInt(
        "" +
          date.getFullYear() +
          ("0" + (date.getMonth() + 1)).slice(-2) +
          date.getDate()
      );
      date = new Date(this.state.endDate);
      var parsedEndDate = parseInt(
        "" +
          date.getFullYear() +
          ("0" + (date.getMonth() + 1)).slice(-2) +
          date.getDate()
      );
      this.props.charityContract.methods
        .createCampaign(
          this.props.web3.utils.toHex(this.state.name),
          this.props.web3.utils.toHex(this.state.description),
          this.props.web3.utils.toHex(this.state.avatarURL),
          this.state.target,
          parsedStartDate,
          parsedEndDate
        )
        .send({ from: this.props.accounts[0] })
        .on("receipt", (receipt) => {
          console.log(receipt);
          var newId = this.state.campaignId + 1;
          this.setState({
            campaignId: newId,
            name: "",
            description: "",
            target: "",
            startDate: String(new Date()),
            endDate: String(new Date()),
            avatarURL: "",
          });
          alert(
            "Campaign creation successful, please view/edit details within the campaigns page"
          );
          window.location.reload(false);

        })
        .on("error", (error) => {
          this.setState({
            campaignId: this.state.campaignId,
            name: "",
            description: "",
            target: "",
            startDate: String(new Date()),
            endDate: String(new Date()),
            avatarURL: "",
          });
          alert(
            "Campaign creation unsuccessful, please create again. Error Occured: " +
              error.message
          );
          window.location.reload(false);

        });
    } catch (err) {
      console.log(err);
    }
  };

  handleUploadStart = () => this.setState({ isUploading: true, progress: 0 });
  handleProgress = (progress) => this.setState({ progress });
  handleUploadError = (error) => {
    this.setState({ isUploading: false });
    console.error(error);
  };
  handleUploadSuccess = (filename) => {
    this.setState({ avatarURL: filename, progress: 100, isUploading: false });
    firebase
      .storage()
      .ref("images")
      .child(filename)
      .getDownloadURL()
      .then((url) => this.setState({ avatarURL: url }));
    
  };

  render() {
    const useStyles = makeStyles((theme) => ({
      paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      },
      form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(3),
      },
      submit: {
        margin: theme.spacing(3, 0, 2),
      },
    }));
    const style = useStyles;
    console.log(this.state.campaignId)

    return (
      <Container
        component="main"
        maxWidth="xs"
        style={{ marginTop: "30px", backgroundColor: "white" }}
      >
        <CssBaseline />
        <div className={style.paper}>
          <Typography component="h1" variant="h5">
            Create a Campaign
          </Typography>
          <form
            className={style.form}
            noValidate
            onSubmit={this.handleSubmit}
            style={{ marginTop: "30px" }}
          >
            <Grid container spacing={2}>
              <label>Upload Campaign Picture:</label>
              {this.state.isUploading && <p>Progress: {this.state.progress}</p>}
              {this.state.avatarURL && <img src={this.state.avatarURL} />}
              <FileUploader
                accept="image/*"
                name="avatar"
                filename = {"campaign" + this.state.campaignId + ".png"}
                storageRef={firebase.storage().ref("images")}
                onUploadStart={this.handleUploadStart}
                onUploadError={this.handleUploadError}
                onUploadSuccess={this.handleUploadSuccess}
                onProgress={this.handleProgress}
              />
              <Grid item xs={12}>
                <TextField
                  name="name"
                  variant="outlined"
                  required
                  fullWidth
                  id="name"
                  value={this.state.name}
                  onChange={this.handleInputChange}
                  label="Campaign Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="description"
                  label="Description"
                  name="description"
                  value={this.state.description}
                  onChange={this.handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="target"
                  label="Target Amount to Raise"
                  id="target"
                  value={this.state.target}
                  onChange={this.handleInputChange}
                />
              </Grid>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid item xs={12} sm={6}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="normal"
                    id="startDate"
                    label="Start Date"
                    value={this.state.startDate}
                    onChange={this.handleStartDateChange}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="normal"
                    id="endDate"
                    label="End Date"
                    value={this.state.endDate}
                    onChange={this.handleEndDateChange}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </Grid>
              </MuiPickersUtilsProvider>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={style.submit}
              style={{ marginTop: "30px", marginBottom: "20px" }}
            >
              Submit
            </Button>
            <Typography>After submission, please wait for alert to come out.</Typography>
          </form>
        </div>
      </Container>
    );
  }
}

export default CreateCampaign;
