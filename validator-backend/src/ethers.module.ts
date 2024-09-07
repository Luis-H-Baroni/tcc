import { Module, Global } from '@nestjs/common'
import { ethers } from 'ethers'
import contractArtifact from '../artifacts/contracts/Validator.sol/Validator.json'
import { ConfigService } from '@nestjs/config'

@Global()
@Module({
  providers: [
    {
      provide: 'ETHERS_PROVIDER',
      useFactory: (configService: ConfigService) => {
        const url = configService.get('provider.rpcProviderUrl')
        return new ethers.JsonRpcProvider(url)
      },
      inject: [ConfigService],
    },
    {
      provide: 'ETHERS_WALLET',
      useFactory: (
        provider: ethers.JsonRpcProvider,
        configService: ConfigService,
      ) => {
        const privateKey = configService.get('wallet.privateKey')
        return new ethers.Wallet(privateKey, provider)
      },
      inject: ['ETHERS_PROVIDER', ConfigService],
    },
    {
      provide: 'ETHERS_CONTRACT',
      useFactory: (
        provider: ethers.JsonRpcProvider,
        configService: ConfigService,
      ) => {
        const contractAddress = configService.get('contract.address')
        return new ethers.Contract(
          contractAddress,
          contractArtifact.abi,
          provider,
        )
      },
      inject: ['ETHERS_PROVIDER', ConfigService],
    },
  ],
  exports: ['ETHERS_PROVIDER', 'ETHERS_WALLET', 'ETHERS_CONTRACT'],
})
export class EthersModule {}
