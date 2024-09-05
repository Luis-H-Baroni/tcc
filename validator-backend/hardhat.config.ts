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
      accounts: [
        '63e09604c0edb1475c79ede29d8275563e610df5eced17f7cc0327f1c4482958',
      ],
    },
  },
}

export default config
