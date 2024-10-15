import { Injectable } from '@nestjs/common'
import { VerifiedInstitutionsService } from '../verified-institutions/verified-institutions.service'

@Injectable()
export class AdminPanelService {
  constructor(private verifiedInstitutionsService: VerifiedInstitutionsService) {}

  async getAdminDashboard() {}
}
