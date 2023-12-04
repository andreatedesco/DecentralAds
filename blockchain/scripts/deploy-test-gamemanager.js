const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  
  const signers = await ethers.getSigners();
  var signer = signers[0]; 

  // ================================================ //

  const deployGameManagerContract = false;
  const updateSource = false;
  const updateAdsFactory = false;
  
  const sendNFTsToGameManager = false;
  
  const sendRequest = false;

  // ================================================ //

  var GameManagerContractName = "GameManager";
  var gameManagerAddress = "0x9358aC5CE468301cD6a0B26B916f5320d7283F15";
  var adsFactoryAddress = "0xD8bdB0e3832607451e351Fd2CE8A805e2653598d";
  
  const source = fs
  .readFileSync(path.resolve("scripts", "func-getwinner.js"))
  .toString();

  // ================================================ //

  var Factory;
  var Contract;
  var Transaction;

  // ================================================ //

  console.log("=== START ===");

  if(deployGameManagerContract){
    Factory = await hre.ethers.getContractFactory(GameManagerContractName);
    Contract = await Factory.connect(signer).deploy(0);
    gameManagerAddress = (await Contract.deployed()).address;
    console.log("GameManager deployed to:", gameManagerAddress);
  }

  if(updateSource){
    Factory = await hre.ethers.getContractFactory(GameManagerContractName);
    Contract = await Factory.attach(gameManagerAddress);
    Transaction = await Contract.connect(signer).updateSource(source);
    console.log("updateSource");
  }

  if(updateAdsFactory){
    Factory = await hre.ethers.getContractFactory(GameManagerContractName);
    Contract = await Factory.attach(gameManagerAddress);
    Transaction = await Contract.connect(signer).updateFactory(adsFactoryAddress);
    console.log("updateAdsFactory");
  }

  if(sendNFTsToGameManager){
    Factory = await hre.ethers.getContractFactory("AdsFactory");
    Contract = await Factory.attach(adsFactoryAddress);

    for(i = 0; i < 4; ++i){
      Transaction = await Contract.connect(signer).transferFrom(signer.address, gameManagerAddress, i);
      console.log("Sended NFT: ", i);
    }
  }

  if(sendRequest){
    Factory = await hre.ethers.getContractFactory(GameManagerContractName);
    Contract = await Factory.attach(gameManagerAddress);
    Transaction = await Contract.connect(signer).sendRequest();
    console.log("sendRequest");
  }


  console.log("=== END ===");
}

function wait(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
      end = new Date().getTime();
   }
  }

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });