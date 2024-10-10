import { Module } from '@nestjs/common'
import { RecordsController } from './records.controller'
import { RecordsService } from './records.service'
import { BlockchainModule } from 'src/modules/blockchain/blockchain.module'

@Module({
  imports: [BlockchainModule],
  controllers: [RecordsController],
  providers: [RecordsService],
})
export class RecordsModule {}
