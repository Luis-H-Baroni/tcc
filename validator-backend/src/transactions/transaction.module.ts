import { Module } from '@nestjs/common'
import { TransactionController } from './transaction.controller'
import { TransactionService } from './transaction.service'
import { EthersModule } from 'src/ethers.module'

@Module({
  imports: [EthersModule],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
