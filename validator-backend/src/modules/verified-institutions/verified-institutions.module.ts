import { Module } from '@nestjs/common'
import { VerifiedInstitutionsController } from './verified-institutions.controller'
import { VerifiedInstitutionsService } from './verified-institutions.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { VerifiedInstitution } from './verified-institutions.entity'

@Module({
  imports: [TypeOrmModule.forFeature([VerifiedInstitution])],
  controllers: [VerifiedInstitutionsController],
  providers: [VerifiedInstitutionsService],
})
export class VerifiedInstitutionsModule {}
