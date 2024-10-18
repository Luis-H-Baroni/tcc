import { Module } from '@nestjs/common'
import { VerifiedInstitutionsController } from './verified-institutions.controller'
import { VerifiedInstitutionsService } from './verified-institutions.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { VerifiedInstitution } from './verified-institutions.entity'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [TypeOrmModule.forFeature([VerifiedInstitution]), AuthModule],
  controllers: [VerifiedInstitutionsController],
  providers: [VerifiedInstitutionsService],
  exports: [VerifiedInstitutionsService],
})
export class VerifiedInstitutionsModule {}
