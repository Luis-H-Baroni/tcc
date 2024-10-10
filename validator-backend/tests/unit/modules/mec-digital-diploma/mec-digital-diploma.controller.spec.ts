import { Test, TestingModule } from '@nestjs/testing'
import { MecDigitalDiplomaController } from 'src/modules/mec-digital-diploma/mec-digital-diploma.controller'
import { MecDigitalDiplomaService } from 'src/modules/mec-digital-diploma/mec-digital-diploma.service'

describe('MecDigitalDiplomaController', () => {
  let controller: MecDigitalDiplomaController
  let mecDigitalDiplomaService: MecDigitalDiplomaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MecDigitalDiplomaService],
      controllers: [MecDigitalDiplomaController],
    }).compile()

    controller = module.get<MecDigitalDiplomaController>(MecDigitalDiplomaController)
    mecDigitalDiplomaService = module.get<MecDigitalDiplomaService>(
      MecDigitalDiplomaService,
    )
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('verifyDiploma', () => {
    it('should verify the diploma', async () => {
      const mockDiploma = 'mockedDiploma'
      const mockResult = 'mockedResult' as any

      jest.spyOn(mecDigitalDiplomaService, 'verifyDiploma').mockResolvedValue(mockResult)

      const result = await controller.verifyDiploma(mockDiploma)

      expect(result).toBe(mockResult)
      expect(mecDigitalDiplomaService.verifyDiploma).toHaveBeenCalledWith(mockDiploma)
    })

    it('should throw an error', async () => {
      const mockDiploma = 'mockedDiploma'
      const mockError = new Error('mockedError')

      jest.spyOn(mecDigitalDiplomaService, 'verifyDiploma').mockRejectedValue(mockError)

      expect(controller.verifyDiploma(mockDiploma)).rejects.toThrowError(mockError)
    })
  })
})
