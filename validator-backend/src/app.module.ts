import { Module } from '@nestjs/common'
import { TransactionsModule } from './modules/transactions/transactions.module'
import { ConfigModule } from '@nestjs/config'
import { MecDigitalDiplomaModule } from './modules/mec-digital-diploma/mec-digital-diploma.module'
import { BlockchainModule } from './modules/blockchain/blockchain.module'
import { RecordsModule } from './modules/records/records.module'
import configuration from './config/configuration'
import { VerifiedInstitutionsModule } from './modules/verified-institutions/verified-institutions.module'
import { DatabaseConfigService } from './database/database-config.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './modules/auth/auth.module'

@Module({
  imports: [
    TransactionsModule,
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    MecDigitalDiplomaModule,
    BlockchainModule,
    RecordsModule,
    VerifiedInstitutionsModule,
    AuthModule,
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfigService,
      inject: [DatabaseConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
