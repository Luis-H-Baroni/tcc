import { Test, TestingModule } from '@nestjs/testing';
import { MecDigitalDiplomaService } from '../../../src/mec-digital-diploma/mec-digital-diploma.service';

describe('MecDigitalDiplomaService', () => {
  let service: MecDigitalDiplomaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MecDigitalDiplomaService],
    }).compile();

    service = module.get<MecDigitalDiplomaService>(MecDigitalDiplomaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
