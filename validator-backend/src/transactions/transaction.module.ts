import { Module } from '@nestjs/common'
import { TransactionController } from './transaction.controller'
import { TransactionService } from './transaction.service'
import { EthersModule } from 'src/ethers.module'
import { MecDigitalDiplomaModule } from 'src/mec-digital-diploma/mec-digital-diploma.module'

@Module({
  imports: [EthersModule, MecDigitalDiplomaModule],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
