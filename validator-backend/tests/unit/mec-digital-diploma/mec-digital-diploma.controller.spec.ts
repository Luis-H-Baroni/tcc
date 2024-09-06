import { Test, TestingModule } from '@nestjs/testing';
import { MecDigitalDiplomaController } from './mec-digital-diploma.controller';

describe('MecDigitalDiplomaController', () => {
  let controller: MecDigitalDiplomaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MecDigitalDiplomaController],
    }).compile();

    controller = module.get<MecDigitalDiplomaController>(MecDigitalDiplomaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
