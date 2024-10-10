import { Module } from '@nestjs/common'
import { TransactionsController } from './transactions.controller'
import { TransactionsService } from './transactions.service'
import { EthersModule } from 'src/ethers.module'
import { MecDigitalDiplomaModule } from 'src/modules/mec-digital-diploma/mec-digital-diploma.module'
import { BlockchainModule } from 'src/modules/blockchain/blockchain.module'

@Module({
  imports: [BlockchainModule, MecDigitalDiplomaModule],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
