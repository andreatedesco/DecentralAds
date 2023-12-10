const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  
  const signers = await ethers.getSigners();
  var signer = signers[0]; 

  // ================================================ //

  const deployGameManagerContract = true;
  const updateSource = false;
  const updateEndDate = false;
  const updateAdsFactory = false;
  
  const sendNFTsToGameManager = false;
  
  const sendRequest = false;

  // ================================================ //

  var gameManagerContractName = "GameManager";
  var gameManagerAddress = "0xC0caCB50ED1a94B91a56318775d9c3551059E4e8";
  var adsFactoryAddress = "0x63204446BFB5da74dbF3dF2c50Be86DaBE385359";
  
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
    Factory = await hre.ethers.getContractFactory(gameManagerContractName);
    Contract = await Factory.connect(signer).deploy(adsFactoryAddress);
    gameManagerAddress = (await Contract.deployed()).address;
    console.log("GameManager deployed to:", gameManagerAddress);
  }

  if(updateSource){
    Factory = await hre.ethers.getContractFactory(gameManagerContractName);
    Contract = await Factory.attach(gameManagerAddress);
    Transaction = await Contract.connect(signer).updateSource(source);
    console.log("updateSource");
  }

  if(updateEndDate){
    Factory = await hre.ethers.getContractFactory(gameManagerContractName);
    Contract = await Factory.attach(gameManagerAddress);
    Transaction = await Contract.connect(signer).updateEndDate(0);
    console.log("updateEndDate");
  }

  if(updateAdsFactory){
    Factory = await hre.ethers.getContractFactory(gameManagerContractName);
    Contract = await Factory.attach(gameManagerAddress);
    Transaction = await Contract.connect(signer).updateFactory(adsFactoryAddress);
    console.log("updateAdsFactory");
  }

  if(sendNFTsToGameManager){
    Factory = await hre.ethers.getContractFactory("AdsFactory");
    Contract = await Factory.attach(adsFactoryAddress);

    for(i = 0; i < 2; ++i){
      Transaction = await Contract.connect(signer).transferFrom(signer.address, gameManagerAddress, i);
      console.log("Sended NFT: ", i);
    }
  }

  if(sendRequest){
    Factory = await hre.ethers.getContractFactory(gameManagerContractName);
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