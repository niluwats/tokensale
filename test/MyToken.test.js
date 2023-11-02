const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyToken", function () {
  it('should transfer the right amount of tokens to an account', async function () {
    const mytoken=await ethers.deployContract("MyToken");
    await mytoken.waitForDeployment();
    const [sender, receiver] = await ethers.getSigners();

    const transferAmount = 1000;
    await expect(mytoken.transfer(receiver.address, transferAmount)).to.changeTokenBalances(
        mytoken,
        [sender.address, receiver.address],
        [-transferAmount, transferAmount]
      );
  });

});