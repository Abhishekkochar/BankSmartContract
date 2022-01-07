require('babel-polyfill');
require('babel-register');
require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider'); //@truffle/hdwallet-provider
const private_Keys = [
]

module.exports = {

  networks: {
     development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
     },
  },
  contracts_directory:'./src/contracts/',
  contracts_build_directory:'./src/abis/',
  // Configure your compilers
  compilers: {
    solc: {
      optimizer: {
          enabled: false,
          runs: 200
        },
    }
  },
};
