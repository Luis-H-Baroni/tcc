import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'

const config: HardhatUserConfig = {
  solidity: '0.8.24',
  networks: {
    localhost: {
      url: 'http://0.0.0.0:8545',
    },
  },
}

export default config
