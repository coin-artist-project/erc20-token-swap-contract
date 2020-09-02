/*global artifacts, assert, before, contract, it, web3*/

const expectThrow = require('./helpers/expectThrow.js');

const ERC20TokenSwap = artifacts.require('./ERC20TokenSwap.sol');
const ERC20Token = artifacts.require('./ERC20Token.sol');

contract('Token Swap checks', async (accounts) => {
  let oldErc20Token;
  let newErc20Token;
  let erc20TokenSwap;

  const owner = accounts[0];
  const address = accounts[1];

  before(async () => {
    oldErc20Token = await ERC20Token.new("Old","OLD");
    newErc20Token = await ERC20Token.new("New","NEW");
    let oldAddress = oldErc20Token.address;
    let newAddress = newErc20Token.address;
    erc20TokenSwap = await ERC20TokenSwap.new(oldAddress, newAddress, 10, 1);
  });

  it('should disallow receiving tokens if there are not enough in the contract', async () => {
    let oldOwnerTokenBalance = await oldErc20Token.balanceOf(owner);
    assert(oldOwnerTokenBalance.eq(web3.utils.toBN(web3.utils.toWei("100", "ether"))));
 
    let newSwapTokenBalance = await newErc20Token.balanceOf(erc20TokenSwap.address);
    assert(newSwapTokenBalance.eq(web3.utils.toBN(web3.utils.toWei("0", "ether"))));

    await oldErc20Token.approve(erc20TokenSwap.address, oldOwnerTokenBalance, {from:owner});
    () => expectThrow(
      erc20TokenSwap.swap({from:owner})
    )
  });

  it('should allow someone to send new tokens to swap contract', async () => {
    let swapTokenBalance = await newErc20Token.balanceOf(erc20TokenSwap.address);
    assert(swapTokenBalance.eq(web3.utils.toBN(0)));
    let result = await newErc20Token.mint(erc20TokenSwap.address, web3.utils.toWei("1000", "ether"), {from:owner});
    let newSwapTokenBalance = await newErc20Token.balanceOf(erc20TokenSwap.address);
    assert(newSwapTokenBalance.eq(web3.utils.toBN(web3.utils.toWei("1000", "ether"))));
  });

  it('should allow someone to swap all their tokens for the new one in the correct amounts', async () => {
    let oldOwnerTokenBalance = await oldErc20Token.balanceOf(owner);
    assert(oldOwnerTokenBalance.eq(web3.utils.toBN(web3.utils.toWei("100", "ether"))));
    let newOwnerTokenBalance = await newErc20Token.balanceOf(owner);
    assert(newOwnerTokenBalance.eq(web3.utils.toBN(web3.utils.toWei("100", "ether"))));

    let newSwapTokenBalance = await newErc20Token.balanceOf(erc20TokenSwap.address);
    assert(newSwapTokenBalance.eq(web3.utils.toBN(web3.utils.toWei("1000", "ether"))));
    let oldSwapTokenBalance = await oldErc20Token.balanceOf(erc20TokenSwap.address);
    assert(oldSwapTokenBalance.eq(web3.utils.toBN(web3.utils.toWei("0", "ether"))));

    await oldErc20Token.approve(erc20TokenSwap.address, oldOwnerTokenBalance, {from:owner});
    let result = await erc20TokenSwap.swap({from:owner});

    oldOwnerTokenBalance = await oldErc20Token.balanceOf(owner);
    assert(oldOwnerTokenBalance.eq(web3.utils.toBN(web3.utils.toWei("0", "ether"))));
    newOwnerTokenBalance = await newErc20Token.balanceOf(owner);
    assert(newOwnerTokenBalance.eq(web3.utils.toBN(web3.utils.toWei("1100", "ether"))));

    newSwapTokenBalance = await newErc20Token.balanceOf(erc20TokenSwap.address);
    assert(newSwapTokenBalance.eq(web3.utils.toBN(web3.utils.toWei("0", "ether"))));
    oldSwapTokenBalance = await oldErc20Token.balanceOf(erc20TokenSwap.address);
    assert(oldSwapTokenBalance.eq(web3.utils.toBN(web3.utils.toWei("100", "ether"))));

  });

  it('should disallow receiving tokens if you have none of the old', async () => {
    let oldOwnerTokenBalance = await oldErc20Token.balanceOf(owner);
    assert(oldOwnerTokenBalance.eq(web3.utils.toBN(web3.utils.toWei("0", "ether"))));
    await oldErc20Token.approve(erc20TokenSwap.address, oldOwnerTokenBalance, {from:owner});
    () => expectThrow(
      erc20TokenSwap.swap({from:owner})
    )
  });

});
