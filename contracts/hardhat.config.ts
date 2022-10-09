import { HardhatUserConfig } from 'hardhat/config'
require("@nomiclabs/hardhat-etherscan");

import '@nomicfoundation/hardhat-toolbox'

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.12"
      },
    ]
  },
  networks: {
    hardhat:{
      // accounts: [
      //   {privateKey: "0b0f343df9ee2c17c308e904bf9363d35af0e03ed4495a1970a7b96db7468734" , balance:"10000000000000000000000"}
      // ],
      forking:{
        url: "",
        // blockNumber : 7600000
      }
    },
    mumbai: {
      url: '',
      chainId: 137,
    },
    goerli: {
      url: "",
      accounts:[""]
    }

  },
  // etherscan: {
  //   apiKey: "CVXMSMWUVZJ25452TSTZ8U4R8IKQ123QEZ"
  // },
}

export default config
