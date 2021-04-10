import React, { Component } from "react";
import { Switch, Route, useLocation } from "react-router-dom";
import getWeb3 from "./getWeb3";

import "./App.css";
import ErrorPage from "./pages/ErrorPage";
import HomePage from "./pages/HomePage";
import RegisterCharity from "./pages/RegisterCharity";
import CreateCampaign from "./pages/CreateCampaign";
import AllCharities from "./pages/AllCharities";
import CharityPage from "./pages/CharityPage";
import TransactionHistory from "./pages/TransactionHistory";
import CampaignPage from "./pages/CampaignPage";

import Navbar from "./components/Navbar";

import Charity from "./contracts/Charity.json";
import Donation from "./contracts/Donation.json";

class App extends Component {
  constructor(props) {
    super(props);

    this.refreshNavbar = this.refreshNavbar.bind(this);
  }
  state = {
    web3: null,
    accounts: null,
    charityContract: null,
    donationContract: null,
    addressType: null,
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      // This checks whether you are logged in.
      const web3 = await getWeb3();

      console.log(web3);

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetworkCharity = Charity.networks[networkId];
      const charityInstance = new web3.eth.Contract(
        Charity.abi,
        deployedNetworkCharity && deployedNetworkCharity.address
      );

      const deployedNetworkDonation = Donation.networks[networkId];
      const donationInstance = new web3.eth.Contract(
        Donation.abi,
        deployedNetworkDonation && deployedNetworkDonation.address
      );

      let addressType = await charityInstance.methods
        .checkAddressType(web3.currentProvider.selectedAddress)
        .call();

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({
        web3,
        accounts,
        charityContract: charityInstance,
        donationContract: donationInstance,
        addressType: addressType,
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contracts. Check console for details.`
      );
      console.error(error);
    }
  };

  refreshNavbar = async () => {
    let addressType = await this.state.charityContract.methods
      .checkAddressType(this.state.web3.currentProvider.selectedAddress)
      .call();
    this.setState({
      addressType: addressType,
    });
  };

  render() {
    return (
      <div className="App">
        {!this.state.web3 || this.state.isError === true ? (
          <ErrorPage />
        ) : (
          <div>
            <Navbar
              web3={this.state.web3}
              accounts={this.state.accounts}
              charityContract={this.state.charityContract}
              donationContract={this.state.donationContract}
              isAuthed={true}
              addressType={this.state.addressType}
            />
            <Switch>
              <Route
                exact
                path="/"
                render={(props) => (
                  <HomePage
                    web3={this.state.web3}
                    accounts={this.state.accounts}
                    charityContract={this.state.charityContract}
                    donationContract={this.state.donationContract}
                    isAuthed={true}
                  />
                )}
              />
              <Route
                exact
                path="/RegisterCharity"
                render={(props) => (
                  <RegisterCharity
                    web3={this.state.web3}
                    accounts={this.state.accounts}
                    charityContract={this.state.charityContract}
                    donationContract={this.state.donationContract}
                    isAuthed={true}
                    refreshNavbar={this.refreshNavbar}
                  />
                )}
              />
              <Route
                exact
                path="/CreateCampaign"
                render={(props) => (
                  <CreateCampaign
                    web3={this.state.web3}
                    accounts={this.state.accounts}
                    charityContract={this.state.charityContract}
                    donationContract={this.state.donationContract}
                    isAuthed={true}
                  />
                )}
              />
              <Route
                exact
                path="/AllCharities"
                render={(props) => (
                  <AllCharities
                    web3={this.state.web3}
                    accounts={this.state.accounts}
                    charityContract={this.state.charityContract}
                    donationContract={this.state.donationContract}
                    isAuthed={true}
                  />
                )}
              />
              {/*<Route
                exact
                path="/CharityPage"
                render={(props) => (
                  <CharityPage
                    web3={this.state.web3}
                    accounts={this.state.accounts}
                    charityContract={this.state.charityContract}
                    donationContract={this.state.donationContract}
                    isAuthed={true}
                  />
                )}
                />*/}
              <Route
                exact
                path="/CharityPage/:id"
                render={(props) => (
                  <CharityPage
                    web3={this.state.web3}
                    accounts={this.state.accounts}
                    charityContract={this.state.charityContract}
                    donationContract={this.state.donationContract}
                    isAuthed={true}
                  />
                )}
              />

              <Route
                exact
                path="/TransactionHistory"
                render={(props) => (
                  <TransactionHistory
                    web3={this.state.web3}
                    accounts={this.state.accounts}
                    charityContract={this.state.charityContract}
                    donationContract={this.state.donationContract}
                    isAuthed={true}
                  />
                )}
              />

              <Route
                exact
                path="/CampaignPage/:id"
                render={() => (
                  <CampaignPage
                    web3={this.state.web3}
                    accounts={this.state.accounts}
                    charityContract={this.state.charityContract}
                    donationContract={this.state.donationContract}
                    isAuthed={true}
                    addressType={this.state.addressType}
                  />
                )}
              />
            </Switch>
          </div>
        )}
      </div>
    );
  }
}

export default App;
