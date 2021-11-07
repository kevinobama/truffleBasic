const shopContract = artifacts.require("Shop");

module.exports = async function (deployer, network, accounts) {
    // deployment steps
    await deployer.deploy(shopContract);
};