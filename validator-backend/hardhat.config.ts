import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'

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
  },
}

export default config
