const {Web3} = require('web3');

const { abi: MyTokenAbi, bytecode: MyTokenBytecode } = require('./artifacts/contracts/MyToken.sol/MyToken.json');
const { abi: TokenSaleAbi,  bytecode: TokenSaleBytecode  } = require('./artifacts/contracts/TokenSale.sol/TokenSale.json');

const web3 = new Web3("http://localhost:8545"); 

async function deploy() {
  const accounts = await web3.eth.getAccounts();

  // Deploy MyToken contract
  const MyTokenContract = new web3.eth.Contract(MyTokenAbi);
  const myToken = await MyTokenContract.deploy({ data: MyTokenBytecode }).send({ from: accounts[0], gas: 5000000 });

  console.log('MyToken contract deployed at address:', myToken.options.address);

  // Deploy TokenSale contract
  const TokenSaleContract = new web3.eth.Contract(TokenSaleAbi);
  const tokenPrice = web3.utils.toWei('0.01', 'ether'); // Set the token price
  const initialTokenSupply = web3.utils.toWei('1000000', 'ether'); // Set the initial token supply
  const tokenSale = await TokenSaleContract.deploy({
    data: TokenSaleBytecode,
    arguments: [myToken.options.address, tokenPrice, initialTokenSupply],
  }).send({ from: accounts[0], gas: 5000000 });

  console.log('TokenSale contract deployed at address:', tokenSale.options.address);

  return { myToken, tokenSale };
}

async function purchaseTokens(tokenSale, buyer) {
  const etherAmount = web3.utils.toWei('0.02', 'ether'); // Set the amount of Ether to purchase tokens
  const tokenAmount = web3.utils.toBN(etherAmount).mul(web3.utils.toBN(await tokenSale.methods.tokenPrice().call()))
    .div(web3.utils.toBN(10).pow(web3.utils.toBN(18)));

  await tokenSale.methods.purchaseTokens().send({ from: buyer, value: etherAmount });
  return tokenAmount;
}

async function main() {
  const { myToken, tokenSale } = await deploy();

  const accounts = await web3.eth.getAccounts();
  const buyer = accounts[1]; 

  const tokensPurchased = await purchaseTokens(tokenSale, buyer);
  console.log(`Tokens purchased: ${web3.utils.fromWei(tokensPurchased, 'ether')} MyToken`);

  const buyerBalance = await myToken.methods.balanceOf(buyer).call();
  console.log(`Buyer's MyToken balance: ${web3.utils.fromWei(buyerBalance, 'ether')} MyToken`);

  const tokensLeftForSale = await tokenSale.methods.checkTokensLeftForSale().call();
  console.log(`Tokens left for sale: ${web3.utils.fromWei(tokensLeftForSale, 'ether')} MyToken`);
}

try {
    main();
} catch (error) {
    console.error("error occured ",error)
}