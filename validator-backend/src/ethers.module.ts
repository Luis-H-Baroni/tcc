import { Module, Global } from '@nestjs/common'
import { ethers } from 'ethers'
import contractArtifact from '../artifacts/contracts/Validator.sol/Validator.json'

@Global()
@Module({
  providers: [
    {
      provide: 'ETHERS_PROVIDER',
      useFactory: () => {
        return new ethers.JsonRpcProvider('http://localhost:8545')
      },
    },
    {
      provide: 'ETHERS_WALLET',
      useFactory: (provider: ethers.JsonRpcProvider) => {
        return new ethers.Wallet(
          '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
          provider,
        )
      },
      inject: ['ETHERS_PROVIDER'],
    },
    {
      provide: 'ETHERS_CONTRACT',
      useFactory: (provider: ethers.JsonRpcProvider) => {
        return new ethers.Contract(
          '0x5FbDB2315678afecb367f032d93F642f64180aa3',
          contractArtifact.abi,
          provider,
        )
      },
      inject: ['ETHERS_PROVIDER'],
    },
  ],
  exports: ['ETHERS_PROVIDER', 'ETHERS_WALLET', 'ETHERS_CONTRACT'],
})
export class EthersModule {}
