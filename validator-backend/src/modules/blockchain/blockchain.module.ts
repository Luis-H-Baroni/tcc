import { Module } from '@nestjs/common'
import { BlockchainService } from './blockchain.service'
import { EthersModule } from 'src/ethers.module'

@Module({
  imports: [EthersModule],
  providers: [BlockchainService],
  exports: [BlockchainService],
})
export class BlockchainModule {}
