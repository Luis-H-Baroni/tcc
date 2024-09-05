import { Module, Global } from '@nestjs/common'
import { ethers } from 'ethers'
import contractArtifact from '../artifacts/contracts/Validator.sol/Validator.json'

@Global()
@Module({
  providers: [
    {
      provide: 'ETHERS_PROVIDER',
      useFactory: () => {
        return new ethers.JsonRpcProvider(
          'https://rpc-amoy.polygon.technology/',
        )
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
          '0x9FE216ACEc9Af5b5617626eBe3BC0a8393347c86',
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
