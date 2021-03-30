import React from "react";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';

import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TabPanel from "../components/TabPanel";
import { Redirect } from "react-router-dom";
import { Link } from 'react-router-dom';


const useStyles = makeStyles({
  root: {
    maxWidth: 100,
  },
  media: {
    height: 140,
  },
});

class AllCharities extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      charities: "",
      owner: false,
      selectedCharityId: ''
    };
    this.redirectCharity = this.redirectCharity.bind(this)

  }

  redirectCharity(id) {
    this.setState({ redirect: "/Charity", selectedCharityId: id});
  }

  componentDidMount = async() => {
    var verifiedCharities = [];
      var pendingCharities = [];
      var rejectedCharities = [];

    const getCharities = async () => {
      const charityContract = this.props.charityContract;
      const accounts = this.props.accounts;
      const owner = await charityContract.methods.getContractOwner().call();
      if (accounts[0] === owner) {
          this.setState({owner: true})
          //console.log("owner")
      }
      
      const length = await charityContract.methods.getNoOfCharities().call();
      console.log("No of charities" + length)
      for (var i = 0; i < length; i++) {
        var charity = {};
        charity.id = i;
        charity.name = await charityContract.methods.getCharityName(i).call();
        charity.name = this.props.web3.utils.toUtf8(charity.name)
        charity.description = await charityContract.methods.getCharityDescription(i).call();
        charity.description = this.props.web3.utils.toUtf8(charity.description)
        charity.pictureURL = await charityContract.methods.getCharityPictureURL(i).call();
        charity.pictureURL = this.props.web3.utils.toUtf8(charity.pictureURL)
        charity.status = await charityContract.methods.getCharityStatus(i).call();
        console.log("status: " + charity.status)
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
      }
    };

    await getCharities();

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
        console.log(charity.pictureURL)
        return (
          <Grid key={charity.id} item xs={4}>
            <Link to={{
            pathname:  `/CharityPage/${charity.id}`,
            state: { id: charity.id}
          }}>
            <Card className={classes.root}>
              <CardActionArea>
                <CardMedia
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
      console.log(pendingCharities.length)
      console.log(pendingCharitiesCards)
      this.setState({
        verifiedCharities: verifiedCharitiesCards,
        pendingCharities: pendingCharitiesCards,
        rejectedCharities: rejectedCharitiesCards,
      });

  }

  render() {
    var view = () => {
      if (this.state.owner === true) {
        return (
          <Grid item xs={10}>
            <Tabs value={0} indicatorColor="primary" textColor="primary">
              <Tab label="Verified" />
              <Tab label="Pending" />
              <Tab label="Rejected" />
            </Tabs>
            <TabPanel value={1} index={0}>
              <Grid container spacing={3}>
                {this.state.verifiedCharities}
              </Grid>
            </TabPanel>
            <TabPanel value={2} index={1}>
              <Grid container spacing={3}>
                {this.state.pendingCharities}
              </Grid>
            </TabPanel>
            <TabPanel value={3} index={2}>
              <Grid container spacing={3}>
                {this.state.rejectedCharities}
              </Grid>
            </TabPanel>
          </Grid>
        );
      } else {
        return (
          <Grid item xs={10}>
            <Tabs value={0} indicatorColor="primary" textColor="primary">
              <Tab label="Verified Charities" />
            </Tabs>
            <TabPanel value={0} index={0}>
              <Grid container spacing={3}>
                {this.state.verifiedCharities}
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
        {this.state.verifiedCharities}
        {this.state.pendingCharities}
        {this.state.rejectedCharities}

      </Grid>
    );
  }
}

export default AllCharities;
