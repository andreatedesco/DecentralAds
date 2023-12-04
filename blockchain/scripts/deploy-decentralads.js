const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  
  const signers = await ethers.getSigners();
  var signer = signers[0]; 

  // ================================================ //

  const deployAdsGatewayContracts = false;
  const deployIPFSManagerContract = false;
  const deployLotteryManagerContract = false;
  const deployPriceFeedManagerContract = false;
  const deployAdsManagerContracts = false;

  const updateIPFSManager = false;
  const updatePriceFeedManager = false;

  const addAdsFactory = false;
  const getAdsFactories = false;

  const addAdv = false;
  const buyAdv = false;
  const getAdv = false;

  const addLottery = false;
  const buyTicket = false;
  const claimAd = false;

  const updateAd = false;

  const updateIPFSSource = false;

  const testPriceFeed = false;

  // ================================================ //

  // fuji
  var adsGatewayAddress = "0x094Ad3B7aC5554F652Fe7b6F7715a9369cDd0f9b";
  var adsIPFSManagerAddress = "0x3455c15A32a8b9BCF8a1004B6e50F5577B74E74a";
  var adsLotteryManagerAddress = "0x4E32c44974E87Ded81bd99Ec1DBA1Ec8CF0b0b68";
  var adsPriceFeedManagerAddres = "0x5c453312E5A0d9Fd0D829F064A26DaacE25f70fF";
  var adsManagerAddress = "0x020721c22F23fD8b824Fbb0D57d347933aFb3914";

  var adsFactoryAddress = "0x5f40A5B3d486432f51718E5aCc2668B987d44dA5";
  
  // ================================================ //

  var Factory;
  var Contract;
  var Transaction;

  // ================================================ //

  console.log("=== START ===");

  if(deployAdsGatewayContracts){
    Factory = await hre.ethers.getContractFactory("AdsGateway");
    Contract = await Factory.connect(signer).deploy();
    adsGatewayAddress = (await Contract.deployed()).address;
    console.log("AdsGateway deployed to:", adsGatewayAddress);
  }

  if(deployIPFSManagerContract) {
    Factory = await hre.ethers.getContractFactory("IPFSManager");
    Contract = await Factory.connect(signer).deploy();
    adsIPFSManagerAddress = (await Contract.deployed()).address;
    console.log("IPFSManager deployed to:", adsIPFSManagerAddress);
  }

  if(deployLotteryManagerContract){
    Factory = await hre.ethers.getContractFactory("LotteryManager");
    Contract = await Factory.connect(signer).deploy();
    adsLotteryManagerAddress = (await Contract.deployed()).address;
    console.log("LotteryManager deployed to:", adsLotteryManagerAddress);
  }

  if(deployPriceFeedManagerContract){
    Factory = await hre.ethers.getContractFactory("PriceFeedManager");
    Contract = await Factory.connect(signer).deploy();
    adsPriceFeedManagerAddres = (await Contract.deployed()).address;
    console.log("PriceFeedManager deployed to:", adsPriceFeedManagerAddres);

  }

  if(deployAdsManagerContracts){
    Factory = await hre.ethers.getContractFactory("AdsManager");
    Contract = await Factory.connect(signer).deploy(adsIPFSManagerAddress, adsLotteryManagerAddress, adsPriceFeedManagerAddres);
    adsManagerAddress = (await Contract.deployed()).address;
    console.log("AdsManager deployed to:", adsManagerAddress);

    Factory = await hre.ethers.getContractFactory("IPFSManager");
    Contract = await Factory.attach(adsIPFSManagerAddress);
    Transaction = await Contract.updateAdsManager(adsManagerAddress);
    console.log("updateAdsManager to IPFSManager");

    Factory = await hre.ethers.getContractFactory("LotteryManager");
    Contract = await Factory.attach(adsLotteryManagerAddress);
    Transaction = await Contract.updateAdsManager(adsManagerAddress);
    console.log("updateAdsManager to LotteryManager");
  }

  if(updateIPFSManager){
    Factory = await hre.ethers.getContractFactory("AdsManager");
    Contract = await Factory.attach(adsManagerAddress);
    Transaction = await Contract.updateIPFSManager(adsIPFSManagerAddress);
    console.log("Update IPFSManager");
  }

  if(updatePriceFeedManager){
    Factory = await hre.ethers.getContractFactory("AdsManager");
    Contract = await Factory.attach(adsManagerAddress);
    Transaction = await Contract.updatePriceFeedManager(adsPriceFeedManagerAddres);
    console.log("Update PriceFeedManager");
  }

  if(addAdsFactory){
    if(deployAdsManagerContracts) wait(5000);

    Factory = await hre.ethers.getContractFactory("AdsManager");
    Contract = await Factory.attach(adsManagerAddress);

    var name = "Name";
    var symbol = "NNN";
    var description = "Description";
    var logo = "https://www.onchainconsole.com/TemplateData/logo.png";
    var banner = "https://www.onchainconsole.com/TemplateData/logo.png";
    var link = "https://www.onchainconsole.com/";
    var royalty = 200;

    Transaction = await Contract.createFactory(name, symbol, description, logo, banner, link, royalty);
    console.log("Added Factory");
  }

  if(getAdsFactories){
    if(addAdsFactory) wait(5000);

    Factory = await hre.ethers.getContractFactory("AdsManager");
    Contract = await Factory.attach(adsManagerAddress);
    // Transaction = await Contract.currentSupply();
    adsFactoryAddress = await Contract.getFactories(0, 1);
    console.log("Get Ads Factories: [ " + adsFactoryAddress + " ]");

    Factory = await hre.ethers.getContractFactory("AdsFactory");
    Contract = await Factory.attach(adsFactoryAddress[0]);
    Transaction = await Contract.contractURI();

    console.log("Get Ads Factories Uri: " + Transaction);
  }

  if(addAdv){
    Factory = await hre.ethers.getContractFactory("AdsFactory");
    Contract = await Factory.attach(adsFactoryAddress);

    var price = 0;
    var width = 1000;
    var height = 2000;

    Transaction = await Contract.addAd(price, width, height, 0, "0x0000000000000000000000000000000000000000");
    console.log("Added Adv");
  }

  if(buyAdv){
    if(addAdv) wait(5000);

    var id = 0;
    var name =  "Name #" + id;
    var description = "Descrption #" + id;
    var image = "https://www.tilesonchain.com/assets/images/creatorTile.png";
    var url = "https://www.onchainconsole.com";

    Factory = await hre.ethers.getContractFactory("AdsFactory");
    Contract = await Factory.attach(adsFactoryAddress);
    Transaction = await Contract.mintAd(id, name, description, image, url);
    console.log("Minted Adv");
  }

  if(getAdv){
    if(buyAdv) wait(5000);

    var id = 0;
    Factory = await hre.ethers.getContractFactory("AdsFactory");
    Contract = await Factory.attach(adsFactoryAddress);
    Transaction = await Contract.tokenURI(id);
    console.log("Uri #"+ id + ": " + Transaction);
  }

  if(addLottery){
    Factory = await hre.ethers.getContractFactory("AdsFactory");
    Contract = await Factory.attach(adsFactoryAddress);

    var price = 0;
    var width = 10;
    var height = 20;
    var ticketAmount = 3;

    Transaction = await Contract.addAd(price, width, height, ticketAmount, "0x0000000000000000000000000000000000000000");
    console.log("Added Lottery");
  }

  if(buyTicket){
    if(addLottery) wait(5000);

    var id = 1;

    Factory = await hre.ethers.getContractFactory("AdsFactory");
    Contract = await Factory.attach(adsFactoryAddress);
    Transaction = await Contract.buyTicket(id);
    console.log("Buy Ticket");
  }

  if(claimAd){

    var id = 1;
    var name =  "CIAO CIAO #" + id;
    var description = "Descrption #" + id;
    var image = "https://www.tilesonchain.com/assets/images/creatorTile.png";
    var url = "https://www.onchainconsole.com";

    Factory = await hre.ethers.getContractFactory("AdsFactory");
    Contract = await Factory.attach(adsFactoryAddress);
    Transaction = await Contract.mintAd(id, name, description, image, url);
    console.log("Claimed Adv");
  }

  if(updateAd){
    var id = 0;
    var name =  "ad";
    var description = "Descrption #" + id;
    var image = "https://jyammagames.com/wp-content/uploads/2021/02/COWZUUKA-LOGODEF-1024x486.png";
    var url = "https://www.onchainconsole.com";

    Factory = await hre.ethers.getContractFactory("AdsFactory");
    Contract = await Factory.attach(adsFactoryAddress);
    Transaction = await Contract.updateAd(id, name, description, image, url);
    console.log("Updated Adv");
  }

  if(updateIPFSSource){
    const source = fs
      .readFileSync(path.resolve("scripts", "func-loadonipfs.js"))
      .toString();

    Factory = await hre.ethers.getContractFactory("IPFSManager");
    Contract = await Factory.attach(adsIPFSManagerAddress);
    Transaction = await Contract.updateSource(false, source);
    console.log("Update IPFSManager");
  }

  if(testPriceFeed){
    Factory = await hre.ethers.getContractFactory("PriceFeed");
    Contract = await Factory.attach(adsPriceFeedManagerAddres);

    const usdAmount = "1000000000000000000";

    Transaction = await Contract.getCoinPrice(usdAmount);
    console.log("Token Price: " + Transaction);
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
