// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/** @title MyToken
    @notice you can use this contract to get to know a simple token contract
    @dev all functions are implemented without any side effects
*/ 
contract MyToken {
    string public name = "MyToken";
    string public symbol = "MTK";
    uint8 public decimals = 18;
    uint256 public totalSupply = 1000000 * 10**uint256(decimals);
    
    mapping(address => uint256) public balanceOf;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    
    constructor() {
        balanceOf[msg.sender] = totalSupply;
    }
    
    /// @notice transfer the given amount to the address provided
    /// @param to the address which the tokens are send to
    /// @param value amount of tokens which has to be sent
    /// @return bool status of transaction whether it is true or false
    function transfer(address to, uint256 value) public returns (bool) {
        require(to != address(0), "invalid address");
        require(balanceOf[msg.sender] >= value, "insufficient balance");
        
        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;
        
        emit Transfer(msg.sender, to, value);
        return true;
    }
}