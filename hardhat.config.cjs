// hardhat.config.js
require('dotenv').config();
require('@nomiclabs/hardhat-ethers');

module.exports = {
  solidity: '0.8.27',
  networks: {
    aia: {
      url: process.env.AIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
