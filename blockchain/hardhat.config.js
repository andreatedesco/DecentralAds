require('dotenv').config();
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

const { 
  API_URL_MUMBAI, 
  API_URL_ZKEVMTESTNET,
  API_URL_FUJI,
  API_URL_AVATESTNET, 
  POLYGONSCAN_API_KEY, 
  ZKEVM_POLYGONSCAN_API_KEY, 
  FUJI_API_KEY, 
  AVATESTNET_API_KEY,
  PRIVATE_KEY 
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
    zkEVMTestnet: {
      url: API_URL_ZKEVMTESTNET,
      accounts: 
      [
        PRIVATE_KEY,
      ],
    },
    mumbai: {
      url: API_URL_MUMBAI,
      accounts: 
      [
        PRIVATE_KEY,
      ],
    },
    fuji: {
      url: API_URL_FUJI,
      accounts: 
      [
        PRIVATE_KEY,
      ],
    },
    avatestnet: {
      url: API_URL_AVATESTNET,
      accounts: 
      [
        PRIVATE_KEY,
      ],
    },
    avalancheFujiTestnet: {
      url: API_URL_FUJI,
      accounts: 
      [
        PRIVATE_KEY,
      ],
    },
    snowtrace: {
      url: API_URL_FUJI,
      accounts: 
      [
        PRIVATE_KEY,
      ],
    },
  },
  etherscan: {
    apiKey: {
        polygonMumbai: POLYGONSCAN_API_KEY,
        // zkEVMTestnet: ZKEVM_POLYGONSCAN_API_KEY,
        // fuji: FUJI_API_KEY,
        // avatestnet: AVATESTNET_API_KEY,
        avalancheFujiTestnet: FUJI_API_KEY,
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