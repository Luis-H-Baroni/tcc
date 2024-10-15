import { Controller, Get, Response, UseGuards } from '@nestjs/common'
import { join } from 'path'
import { AuthGuard } from '../auth/auth.guard'

import { VerifiedInstitutionsService } from '../verified-institutions/verified-institutions.service'
import { getAdminDashboardTemplate } from 'src/views/admin-dashboard'

@Controller('admin')
export class AdminPanelController {
  constructor(
    private readonly verifiedInstitutionsService: VerifiedInstitutionsService,
  ) {}

  @Get()
  getAdminPage(@Response() res) {
    res.sendFile(join(__dirname, 'public', 'admin-panel.html')) // Caminho para o arquivo HTML
  }

  @Get('dashboard')
  @UseGuards(AuthGuard)
  async getAdminDashboard() {
    const verifiedInstitutions = await this.verifiedInstitutionsService.findAll()
    console.log(verifiedInstitutions)

    return getAdminDashboardTemplate(verifiedInstitutions)
  }
}
