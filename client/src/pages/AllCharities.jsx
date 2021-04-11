import React from "react";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";

import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TabPanel from "../components/TabPanel";
import { Link } from 'react-router-dom';


const useStyles = makeStyles({
  root: {
    maxWidth: 100,
  },
  media: {
    height: 200,
    filter: "brightness(60%)",
  },
});

class AllCharities extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      charities: "",
      owner: false,
      selectedCharityId: '',
      valueOfTab: 0,
      isLoading: true
    };
    this.handleChange = this.handleChange.bind(this)

  }

  handleChange(event, value) {
    console.log(value)
    this.setState({ valueOfTab: value});
  };

  componentDidMount = async() => {
    var verifiedCharities = [];
      var pendingCharities = [];
      var rejectedCharities = [];
      const charityContract = this.props.charityContract;
      const accounts = this.props.accounts;
      const owner = await charityContract.methods.getContractOwner().call();
      if (accounts[0] === owner) {
          this.setState({owner: true})
      }
      
      const length = await charityContract.methods.getNoOfCharities().call();
      for (var i = 0; i < length; i++) {
        var charity = {};
        charity.id = i;
        charity.name = await charityContract.methods.getCharityName(i).call();
        charity.name = charity.name
        charity.description = await charityContract.methods.getCharityDescription(i).call();
        charity.description = charity.description
        charity.pictureURL = await charityContract.methods.getCharityPictureURL(i).call();
        charity.pictureURL = charity.pictureURL
        charity.status = await charityContract.methods.getCharityStatus(i).call();
        if (charity.status === '0') {
          charity.id = i;
          pendingCharities.push(charity);
        }
        if (charity.status === '1') {
          charity.id = i;
          verifiedCharities.push(charity);
        }
        if (charity.status === '2') {
          charity.id = i;
          rejectedCharities.push(charity);
        }
      
    };
      var verifiedCharitiesCards = verifiedCharities.map((charity) => {
        const classes = useStyles;
        return (
          <Grid key={charity.id} item xs={4}>
            <Link to={{
            pathname:  `/CharityPage/${charity.id}`,
            state: { id: charity.id}
          }}>
            <Card className={classes.root}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="200"
                  className={classes.media}
                  image={charity.pictureURL}
                  title="charity avatar"
                />
                <CardContent>
                  <Typography gutterBottom component="p">
                    {charity.name}
                  </Typography>
                  <Typography
                    color="textSecondary"
                    component="p"
                  >
                    {charity.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
            </Link>
          </Grid>
        );
      });
      
      var pendingCharitiesCards = pendingCharities.map((charity) => {
        const classes = useStyles;
        return (
          <Grid key={charity.id} item xs={4}>
            <Link to={{
            pathname:  `/CharityPage/${charity.id}`,
            state: { id: charity.id}
          }}>
            <Card className={classes.root}>
              <CardActionArea>
              <CardMedia
                  component="img"
                  height="200"
                  className={classes.media}
                  image={charity.pictureURL}
                  title="charity avatar"
                />
                <CardContent>
                  <Typography gutterBottom component="p">
                    {charity.name}
                  </Typography>
                  <Typography
                    color="textSecondary"
                    component="p"
                  >
                    {charity.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
            </Link>
          </Grid>
        );
      });

      var rejectedCharitiesCards = rejectedCharities.map((charity) => {
        const classes = useStyles;
        return (
          <Grid key={charity.id} item xs={4}>
            <Link to={{
            pathname:  `/CharityPage/${charity.id}`,
            state: { id: charity.id}
          }}>
            <Card className={classes.root}>
              <CardActionArea>
              <CardMedia
                  component="img"
                  height="200"
                  className={classes.media}
                  image={charity.pictureURL}
                  title="charity avatar"
                />
                <CardContent>
                  <Typography gutterBottom component="p">
                    {charity.name}
                  </Typography>
                  <Typography
                    color="textSecondary"
                    component="p"
                  >
                    {charity.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
            </Link>
          </Grid>
        );
      });
      this.setState({
        verifiedCharities: verifiedCharitiesCards,
        pendingCharities: pendingCharitiesCards,
        rejectedCharities: rejectedCharitiesCards,
        isLoading: false
      });

  }

  render() {
    var view = () => {
      if (this.state.owner === true) {
        return (
          <Grid item xs={10}>
            <Tabs value={this.state.valueOfTab} onChange={this.handleChange} indicatorColor="primary" textColor="primary">
              <Tab label="Verified" />
              <Tab label="Pending" />
              <Tab label="Rejected" />
            </Tabs>
            <TabPanel value={this.state.valueOfTab} index={0}>
              <Grid container spacing={3}>
              {this.state.isLoading ? (
              <Grid item xs={12}>
                <CircularProgress />
              </Grid>
            ) : (this.state.verifiedCharities)}             
             </Grid>
            </TabPanel>
            <TabPanel value={this.state.valueOfTab} index={1}>
            <Grid container spacing={3}>
              {this.state.isLoading ? (
              <Grid item xs={12}>
                <CircularProgress />
              </Grid>
            ) : (this.state.pendingCharities)}             
             </Grid>
            </TabPanel>
            <TabPanel value={this.state.valueOfTab} index={2}>
            <Grid container spacing={3}>
              {this.state.isLoading ? (
              <Grid item xs={12}>
                <CircularProgress />
              </Grid>
            ) : (this.state.rejectedCharities)}             
             </Grid>
            </TabPanel>
          </Grid>
        );
      } else {
        return (
          <Grid item xs={10}>
            <Tabs value={this.state.valueOfTab} indicatorColor="primary" textColor="primary">
              <Tab label="Verified Charities" />
            </Tabs>
            <TabPanel value={this.state.valueOfTab} index={0}>
            <Grid container spacing={3}>
              {this.state.isLoading ? (
              <Grid item xs={12}>
                <CircularProgress />
              </Grid>
            ) : (this.state.verifiedCharities)}             
             </Grid>
            </TabPanel>
          </Grid>
        );
      };
    }

    return (
      <Grid container spacing={2} justify="center">
        <Grid item xs={10}>
          <Box textAlign="left" fontWeight="fontWeightBold" fontSize={26}>
            All Charities
          </Box>
        </Grid>
        {view()}

      </Grid>
    );
  }
}

export default AllCharities;
