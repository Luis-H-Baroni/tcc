import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

const config: HardhatUserConfig = {
  solidity: '0.8.24',
  networks: {
    localhost: {
      url: 'http://0.0.0.0:8545',
    },
    testnet: {
      url: 'https://rpc-amoy.polygon.technology/',
      chainId: 80002,
      accounts: [process.env.WALLET_PRIVATE_KEY],
    },
    mainnet: {
      url: 'https://polygon-rpc.com/',
      chainId: 137,
      accounts: [process.env.WALLET_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: process.env.POLYGON_API_KEY,
  },
}

export default config
