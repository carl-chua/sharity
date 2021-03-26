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
      console.log(props)
    super(props);
    this.state = {
      charities: "",
      owner: false,
      redirect: null
    };
    this.redirectCharity = this.redirectCharity.bind(this)

  }

  redirectCharity(id) {
    this.setState({ redirect: "/Charity", selectedCharityId: id});
  }

  componentDidMount() {
    console.log(this.props.charityContract)
    const getCharities = async () => {
      const charityContract = this.props.charityContract;
      const accounts = this.props.accounts;
      const owner = await charityContract.methods.contractOwner().call();
      if (accounts[0] === owner) {
          this.setState({owner: true})
      }
      var verifiedCharities = [];
      var pendingCharities = [];
      var rejectedCharities = [];
      const length = await charityContract.methods.getNoOfCharities().call();
      for (var i = 0; i < length; i++) {
        const charity = await charityContract.methods.charities(i).call();
        if (charity.charityStatus === 0) {
          charity.id = i;
          pendingCharities.push(charity);
        }
        if (charity.charityStatus === 1) {
          charity.id = i;
          verifiedCharities.push(charity);
        }
        if (charity.charityStatus === 2) {
          charity.id = i;
          rejectedCharities.push(charity);
        }
      }

      var verifiedCharitiesCards = verifiedCharities.map((charity) => {
        const classes = useStyles;
        return (
          <Grid key={charity.id} item xs={4}>
            <Card className={classes.root}>
              <CardActionArea>
                <CardMedia
                  className={classes.media}
                  image={charity.pictureURL}
                  title="charity avatar"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {charity.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    {charity.description}
                  </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" onclick={this.redirectCharity(charity.id)} >View More</Button>
                </CardActions>
              </CardActionArea>
            </Card>
          </Grid>
        );
      });
      
      var pendingCharitiesCards = pendingCharities.map((charity) => {
        const classes = useStyles;
        return (
          <Grid key={charity.id} item xs={4}>
            <Card className={classes.root}>
              <CardActionArea>
                <CardMedia
                  className={classes.media}
                  image={charity.pictureURL}
                  title="charity avatar"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {charity.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    {charity.description}
                  </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" onclick={this.redirectCharity(charity.id)} >View More</Button>
                </CardActions>
              </CardActionArea>
            </Card>
          </Grid>
        );
      });

      var rejectedCharitiesCards = rejectedCharities.map((charity) => {
        const classes = useStyles;
        return (
          <Grid key={charity.id} item xs={4}>
            <Card className={classes.root}>
              <CardActionArea>
                <CardMedia
                  className={classes.media}
                  image={charity.pictureURL}
                  title="charity avatar"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {charity.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    {charity.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        );
      });

      this.setState({
        verifiedCharities: verifiedCharitiesCards,
        pendingCharities: pendingCharitiesCards,
        rejectedCharities: rejectedCharitiesCards,
      });
    };

    getCharities();
  }

  render() {
    if (this.state.redirect) {
        return <Redirect to={{
            pathname: "/Charity",
            state: { charityId: this.state.charityId }
          }}/>
    }
    var view = () => {
      if (this.state.owner === true) {
        return (
          <Grid item xs={10}>
            <Tabs value={0} indicatorColor="primary" textColor="primary">
              <Tab label="Verified" />
              <Tab label="Pending" />
              <Tab label="Rejected" />
            </Tabs>
            <TabPanel value={0} index={0}>
              <Grid container spacing={3}>
                {this.state.verifiedCharities}
              </Grid>
            </TabPanel>
            <TabPanel value={0} index={1}>
              <Grid container spacing={3}>
                {this.state.pendingCharities}
              </Grid>
            </TabPanel>
            <TabPanel value={0} index={2}>
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
      }
    };

    return (
      <Grid container spacing={2} justify="center">
        <Grid item xs={10}>
          <Box textAlign="left" fontWeight="fontWeightBold" fontSize={26}>
            All Charities
          </Box>
        </Grid>
        {view}
      </Grid>
    );
  }
}

export default AllCharities;
