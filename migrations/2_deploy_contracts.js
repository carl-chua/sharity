var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var Charity = artifacts.require("./Charity.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
};

module.exports = function(deployer) {
	deployer.deploy(Charity);
}
