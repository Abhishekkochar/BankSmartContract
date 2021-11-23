require('babel-polyfill');
require('babel-register');
require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider'); //@truffle/hdwallet-provider
const private_Keys = ['0xc60b9f510739b61e4701519c55676adffed4774b789dd90a3c299372f861c19b',
'0x493d88132d500d482fb0cffb36a6776dc5dab12dbb9ee4d78a0c33a1afac3c64',
'0x3f95e21cbeba933b53ed48db72ebe9ccf2622d0a806b8a37bbaeda56d957ec92',
'0x8578a7dc69b4ff16b1fd6e8c2d6a1d6ecdffbc3abba5b633af51b9d17375e40c'
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
