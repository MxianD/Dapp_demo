var Election = artifacts.require('./contracts/Election')

module.exports = function(deployer) {
    deployer.deploy(Election);
}