import { Module } from '@nestjs/common'
import { TransactionsModule } from './transactions/transactions.module'
import { ConfigModule } from '@nestjs/config'
import { MecDigitalDiplomaModule } from './mec-digital-diploma/mec-digital-diploma.module'
import { BlockchainModule } from './blockchain/blockchain.module'
import { RecordsModule } from './records/records.module'
import configuration from './config/configuration'
import { VerifiedInstitutionsModule } from './verified-institutions/verified-institutions.module'
import { DatabaseConfigService } from './database/database-config.service'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [
    TransactionsModule,
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    MecDigitalDiplomaModule,
    BlockchainModule,
    RecordsModule,
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfigService,
      inject: [DatabaseConfigService],
    }),
    VerifiedInstitutionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
