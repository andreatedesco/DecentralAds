require('dotenv').config();
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

const { 
  PRIVATE_KEY, 
  FUJI_API_URL,
  FUJI_API_KEY, 
} = process.env;

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    artifacts: "./src/artifacts",
  },
  networks: {
    snowtrace: {
      url: FUJI_API_URL,
      accounts: [PRIVATE_KEY],

      adsIPFSManager: "0xa2E386d7a0008CE873101d461699890F31bE6D88",
      adsLotteryManager: "0xB1D899966c6A5BB4c318A0D7750CE96eD83C0128",
      adsPriceFeedManager: "0xbC61427f46F928C2e94A39B5c024381d0A36314c",
      adsManager: "0x809Ac5D87560ef10dda69A9317688A4A61e8C56e",
      adsFactory: "0xDdaa6748e6a300F1BDfBB170497EA67FF956e6B7",
    },
  },
  etherscan: {
    apiKey: {
        snowtrace: FUJI_API_KEY,
    },
    customChains: [
      {
        network: "snowtrace",
        chainId: 43113,
        urls: {
          apiURL: "https://api.routescan.io/v2/network/testnet/evm/43113/etherscan",
          browserURL: "https://avalanche.testnet.routescan.io"
        }
      }
    ]
  }
};