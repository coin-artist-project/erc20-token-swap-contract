// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ERC20TokenSwap {
    using SafeMath for uint256;

    IERC20 public fromERC20;
    IERC20 public toERC20;

    uint256 public tokenSwapMultiplier;
    uint256 public tokenSwapDividend;

    event TokenSwap(
    	address indexed owner,
    	address fromERC20,
    	address toERC20,
    	uint256 oldBalance,
    	uint256 newBalance
    );

	constructor(
		address _fromERC20,
		address _toERC20,
		uint256 _tokenSwapMultiplier,
		uint256 _tokenSwapDividend
	)
		public
	{
		fromERC20 = IERC20(_fromERC20);
		toERC20 = IERC20(_toERC20);
		tokenSwapMultiplier = _tokenSwapMultiplier;
		tokenSwapDividend = _tokenSwapDividend;
	}

	function swap() external {
		// Send and lock the old tokens to this contract
		uint256 oldBalance = fromERC20.balanceOf(msg.sender);
		require(oldBalance > 0, "No tokens to transfer");

		fromERC20.transferFrom(msg.sender, address(this), oldBalance);

		// Send new ones to the caller
		uint256 newBalance = oldBalance.mul(tokenSwapMultiplier).div(tokenSwapDividend);
		require(newBalance <= toERC20.balanceOf(address(this)), "Not enough tokens for swap");

		toERC20.transfer(msg.sender, newBalance);

		emit TokenSwap(msg.sender, address(fromERC20), address(toERC20), oldBalance, newBalance);
	}
}
