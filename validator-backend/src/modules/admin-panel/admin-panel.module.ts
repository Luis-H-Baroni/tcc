import { Module } from '@nestjs/common'
import { AdminPanelController } from './admin-panel.controller'
import { AuthModule } from '../auth/auth.module'
import { VerifiedInstitutionsModule } from '../verified-institutions/verified-institutions.module'

@Module({
  imports: [AuthModule, VerifiedInstitutionsModule],
  controllers: [AdminPanelController],
  providers: [],
})
export class AdminPanelModule {}
