const ERC20Token = artifacts.require('./ERC20Token.sol');
const ERC20TokenSwap = artifacts.require('./ERC20TokenSwap.sol');

let _old = "0xB29D2F5152B7d01B994E1773Fe003F2e333fb4fF";
let _new = "0x87b008e57f640d94ee44fd893f0323af933f9195";
let _withdrawAddress = "0x56d76411919Ab8F86D0972b24a9986943193b306";

// eslint-disable-next-line func-names
module.exports = async (deployer, network) => {
	if (network.indexOf('rinkeby') !== -1) {
		await deployer.deploy(ERC20Token, "Old", "OLD");
		let oldInst = await ERC20Token.deployed();
		await deployer.deploy(ERC20Token, "New", "NEW");
		let newInst = await ERC20Token.deployed();
		_old = oldInst.address;
		_new = newInst.address;
		_withdrawAddress = "0x56d76411919Ab8F86D0972b24a9986943193b306";
	}

	// Deploy the contract
	await deployer.deploy(ERC20TokenSwap, _old, _new, _withdrawAddress);

	// Set original values
	const instance = await ERC20TokenSwap.deployed();
};
