import { Module } from '@nestjs/common'
import { TransactionModule } from './transactions/transaction.module'

@Module({
  imports: [TransactionModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
