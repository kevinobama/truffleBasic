
const MyContract = artifacts.require("Hellofalco");

module.exports = async function (deployer, network, accounts) {
    // deployment steps
    await deployer.deploy(MyContract);
};