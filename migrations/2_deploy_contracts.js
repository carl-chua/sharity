const Charity = artifacts.require("Charity");
const Donation = artifacts.require("Donation");

module.exports = async function(deployer, network, accounts) {
	let deployAccount = accounts[0];
    let charity = await deployer.deploy(Charity, {from: deployAccount})
    await deployer.deploy(Donation, Charity.address, {from: deployAccount});

} 
