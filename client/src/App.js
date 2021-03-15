import React, { Component } from "react";
import { Switch, Route, useLocation } from "react-router-dom";
import getWeb3 from "./getWeb3";

import "./App.css";
import ErrorPage from "./pages/ErrorPage";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";

import Charity from "./contracts/Charity.json";
import Donation from "./contracts/Donation.json";

class App extends Component {
  state = {
    web3: null,
    accounts: null,
    charityContract: null,
    donationContract: null,
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

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

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({
        web3,
        accounts,
        charityContract: charityInstance,
        donationContract: donationInstance,
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contracts. Check console for details.`
      );
      console.error(error);
    }
  };

  render() {
    /*return (
      <div className="App">
      {!this.state.web3 || this.state.isError === true 
        ? <ErrorPage />
        : <HomePage web3={this.state.web3} accounts={this.state.accounts} charityContract={this.state.charityContract} donationContract={this.state.donationContract}/>}
    </div>
    );*/
    return (
      <div className="App">
        <Navbar />
        <Switch>
          <Route exact path="/" component={HomePage} />
        </Switch>
      </div>
    );
  }
}

export default App;
