import { Module } from '@nestjs/common'
import { TransactionModule } from './transactions/transaction.module'
import { ConfigModule } from '@nestjs/config'
import { MecDigitalDiplomaModule } from './mec-digital-diploma/mec-digital-diploma.module'
import configuration from './config/configuration'

@Module({
  imports: [
    TransactionModule,
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    MecDigitalDiplomaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
