import { Test, TestingModule } from '@nestjs/testing'
import { MecDigitalDiplomaService } from 'src/mec-digital-diploma/mec-digital-diploma.service'

describe('MecDigitalDiplomaService', () => {
  let service: MecDigitalDiplomaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MecDigitalDiplomaService],
    }).compile()

    service = module.get<MecDigitalDiplomaService>(MecDigitalDiplomaService)
  })

  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ rates: { CAD: 1.42 } }),
    }),
  ) as any

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('verifyDiploma', () => {
    it('should verify the diploma', async () => {
      const mockDiploma = { buffer: 'mockedBuffer', originalname: 'mockedOriginalName' }
      const mockResult = 'mockedResult' as any

      jest.spyOn(service, 'verifyDiploma').mockResolvedValue(mockResult)
      const result = await service.verifyDiploma(mockDiploma)

      expect(result).toBe(mockResult)
      expect(service.verifyDiploma).toHaveBeenCalledWith(mockDiploma)
    })

    it('should throw an error', async () => {
      const mockDiploma = 'mockedDiploma'
      const mockError = new Error('mockedError')

      jest.spyOn(service, 'verifyDiploma').mockRejectedValue(mockError)

      try {
        await service.verifyDiploma(mockDiploma)
      } catch (error) {
        expect(error).toBe(mockError)
      }
    })
  })
})
