// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./MyToken.sol"; 

/// @title TokenSale
/// @notice you can use this contract to get to know a simple token sale
/// @dev all functions are implemented without any side effects
contract TokenSale {
    address public owner;
    MyToken public token;
    uint256 public tokenPrice;
    uint256 public tokensAvailable;

    event TokensPurchased(address indexed buyer, uint256 amount);

    constructor(address _tokenAddress, uint256 _tokenPrice, uint256 _initialSupply) {
        owner = msg.sender;
        token = MyToken(_tokenAddress);
        tokenPrice = _tokenPrice;
        tokensAvailable = _initialSupply;
    }

    /// @notice convert the corresponsing amount of ETH and send the token amount to the function caller
    function purchaseTokens() external payable {
        require(msg.value > 0, "Ether amount must be greater than 0");

        uint256 tokenAmount = msg.value * 10**uint256(token.decimals()) / tokenPrice;

        require(tokensAvailable >= tokenAmount, "Not enough tokens available for purchase");

        tokensAvailable -= tokenAmount;

        token.transfer(msg.sender, tokenAmount);

        emit TokensPurchased(msg.sender, tokenAmount);
    }

    /// @notice get the amount of tokens left for sale
    /// @return uint256 amount of tokens
    function getTokensLeftForSale() public view returns (uint256) {
        return tokensAvailable;
    }

    /// @notice only owner can withdraw the ETH in the contract to the owner's address
    function withdrawEther() public {
        require(msg.sender == owner, "Only owner can withdraw Eth");
        uint256 balance = address(this).balance;
        payable(owner).transfer(balance);
    }
}