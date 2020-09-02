const ERC20TokenSwap = artifacts.require('./ERC20TokenSwap.sol');

const _old = "0xB29D2F5152B7d01B994E1773Fe003F2e333fb4fF";
const _new = "0x87b008e57f640d94ee44fd893f0323af933f9195";
const _mul = 10;
const _div = 1;

// eslint-disable-next-line func-names
module.exports = async (deployer) => {
	// Deploy the contract
	await deployer.deploy(ERC20TokenSwap, _old, _new, _mul, _div);

	// Set original values
	const instance = await ERC20TokenSwap.deployed();
};
