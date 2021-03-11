const path = require("path");
require("dotenv").config({path: "./.env"});
const HDWalletProvider = require("@truffle/hdwallet-provider");
const MNEMONIC = 'birth laundry beyond tomorrow toward pond chef crawl tiger path road moment';

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      port: 7545,
      host: "127.0.0.1",
      network_id: 5777
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(MNEMONIC, "https://ropsten.infura.io/v3/0b84a21e72fe499f9015ef8a509ce690", 0)
      },
      network_id: 3
    }
  },
  compilers: {
    solc: {
      version: "0.5.0"
    }
  }
};
