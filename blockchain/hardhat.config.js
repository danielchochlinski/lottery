require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
const { API_URL, PRIVATE_KEY } = process.env;

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: API_URL,
      gasPrice: 50000000000,

      accounts: [`${PRIVATE_KEY}`],
    },
  },
};
