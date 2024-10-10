import { Module } from '@nestjs/common'
import { MecDigitalDiplomaController } from './mec-digital-diploma.controller'
import { MecDigitalDiplomaService } from './mec-digital-diploma.service'

@Module({
  controllers: [MecDigitalDiplomaController],
  providers: [MecDigitalDiplomaService],
  exports: [MecDigitalDiplomaService],
})
export class MecDigitalDiplomaModule {}
