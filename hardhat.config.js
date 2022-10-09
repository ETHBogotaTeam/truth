require("@nomicfoundation/hardhat-toolbox")

/** @type import('hardhat/config').HardhatUserConfig */

import { config as dotenvConfig } from "dotenv"

dotenvConfig({ path: resolve(__dirname, "./.env") })

module.exports = {
    solidity: "0.8.4",
    networks: {
        hardhat: {
            accounts: [
                {
                    privateKey: process.env.PRIVATE_KEY_1,
                    balance: "10000000000000000000000"
                },
                {
                    privateKey: process.env.PRIVATE_KEY_2,
                    balance: "10000000000000000000000"
                }
            ],
            forking: {
                url: process.env.GOERLI_URL,
                blockNumber: 7622092
            }
        },
        goerli: {
            url: process.env.GOERLI_URL,
            accounts: [process.env.PRIVATE_KEY, process.env.PRIVATE_KEY_1]
        }
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_KEY
    }
}
