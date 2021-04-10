import { ethers } from "ethers";

import React from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";
import firebase from "firebase";
import FileUploader from "react-firebase-file-uploader";

class RegisterCharity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      charityId: 0,
      name: "",
      description: "",
      contact: "",
      address: "",
      isUploading: false,
      progress: 0,
      avatarURL: "",
      message: "",
      isLoading: false,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount = async () => {
    console.log(this.props.charityContract);
    const id = await this.props.charityContract.methods
      .getNoOfCharities()
      .call();
    this.setState({ charityId: id });
  };

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  }

  handleSubmit = (e) => {
    this.setState({ isLoading: true });

    e.preventDefault();
    console.log(this.state);
    try {
      this.props.charityContract.methods
        .registerCharity(
          this.state.name,
          this.state.address,
          this.state.contact,
          this.state.description,
          this.state.avatarURL
        )
        .send({ from: this.props.accounts[0], value: this.props.web3.utils.toWei("0.5", 'ether')})
        .on("receipt", (receipt) => {
          console.log(receipt);
          var newId = parseInt(this.state.charityId) + 1;
          console.log(newId);
          this.setState({
            charityId: newId,
            name: "",
            description: "",
            contact: "",
            address: "",
            avatarURL: "",
          });
          console.log(this.state);
          this.props.refreshNavbar();
          this.setState({ isLoading: false });

          alert(
            "Registration successful, please wait for Sharity to verify your registration"
          );
          window.location.reload(false);
        })
        .on("error", (error) => {
          console.log(error.message);
          this.setState({
            name: "",
            description: "",
            contact: "",
            address: "",
            avatarURL: "",
          });
          console.log(this.state);
          this.setState({ isLoading: false });

          alert(
            "Registration unsuccessful, please register again. Error Occured: " +
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

    return (
      <div>
        <Container
          component="main"
          maxWidth="xs"
          style={{ marginTop: "30px", backgroundColor: "white" }}
        >
          <CssBaseline />
          <div className={style.paper}>
            <Typography component="h1" variant="h5">
              Register Your Charity
            </Typography>
            <form
              className={style.form}
              noValidate
              onSubmit={this.handleSubmit}
              style={{ marginTop: "30px" }}
            >
              <Grid container spacing={2}>
                <label>Upload Avatar:</label>
                {this.state.isUploading && (
                  <p>Progress: {this.state.progress}</p>
                )}
                {this.state.avatarURL && <img src={this.state.avatarURL} />}
                <FileUploader
                  accept="image/*"
                  name="avatar"
                  filename={"charity" + this.state.charityId + ".png"}
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
                    label="Charity Name"
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
                    name="contact"
                    label="Contact Number"
                    id="contact"
                    value={this.state.contact}
                    onChange={this.handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="address"
                    label="Address"
                    id="address"
                    value={this.state.address}
                    onChange={this.handleInputChange}
                  />
                </Grid>
              </Grid>
              {this.state.isLoading ? (
                <Grid item xs={12}>
                  <CircularProgress />
                </Grid>
              ) : (
                <span></span>
              )}
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
              <Typography>
                Please note that 0.5 ether will be transferred as the nonrefundable registration fee. After submission, please wait for alert to come out.
              </Typography>
            </form>
          </div>
        </Container>
      </div>
    );
  }
}

export default RegisterCharity;
