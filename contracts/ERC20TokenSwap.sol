// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ERC20TokenSwap {
	IERC20 public fromERC20;
	IERC20 public toERC20;
	address payable withdrawAddress;

	event TokenSwap(
		address indexed owner,
		address fromERC20,
		address toERC20,
		uint256 balance
	);

	constructor(
		address _fromERC20,
		address _toERC20,
		address payable _withdrawAddress
	)
		public
	{
		fromERC20 = IERC20(_fromERC20);
		toERC20 = IERC20(_toERC20);
		withdrawAddress = _withdrawAddress;
	}

	function withdraw() external {
		require(msg.sender == withdrawAddress, "Not allowed withdraw address");
		toERC20.transfer(msg.sender, toERC20.balanceOf(address(this)));
	}

	function swap() external {
		// Send and lock the old tokens to this contract
		uint256 balance = fromERC20.balanceOf(msg.sender);
		require(balance > 0, "No tokens to transfer");

		fromERC20.transferFrom(msg.sender, address(this), balance);

		// Send new ones to the caller
		require(balance <= toERC20.balanceOf(address(this)), "Not enough tokens for swap");

		toERC20.transfer(msg.sender, balance);

		emit TokenSwap(msg.sender, address(fromERC20), address(toERC20), balance);
	}
}
