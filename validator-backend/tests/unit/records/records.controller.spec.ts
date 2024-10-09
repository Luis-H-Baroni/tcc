import { Test, TestingModule } from '@nestjs/testing'
import { RecordsController } from 'src/records/records.controller'
import { RecordsService } from 'src/records/records.service'
import { BlockchainService } from 'src/blockchain/blockchain.service'

describe('RecordsController', () => {
  let controller: RecordsController
  let recordsService: RecordsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecordsController],
      providers: [
        RecordsService,
        BlockchainService,
        BlockchainService,
        { provide: 'ETHERS_PROVIDER', useValue: {} },
        { provide: 'ETHERS_CONTRACT', useValue: {} },
        { provide: 'ETHERS_WALLET', useValue: {} },
      ],
    }).compile()

    controller = module.get<RecordsController>(RecordsController)
    recordsService = module.get<RecordsService>(RecordsService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('getRecord', () => {
    it('should return a record', async () => {
      const mockRecords = [
        {
          hash: 'mockedHash',
          exists: true,
          publicKey: 'mockKey',
          status: 0n,
          mecConformityStatus: 0n,
        },
      ]
      const documentHash = 'mockedDocumentHash'

      jest.spyOn(recordsService, 'getRecords').mockResolvedValue(mockRecords)

      const result = await controller.getRecords(documentHash)

      expect(recordsService.getRecords).toHaveBeenCalledWith(documentHash)
      expect(result).toContain('<label>Registros Encontrados</label>')
      expect(result).toContain('<span id="valid">VÁLIDO</span>')
      expect(result).toContain('<span id="valid">CONFORME</span>')
      expect(result).toContain('mockedHash')
      expect(result).toContain('mockKey')
    })

    it('should return a record not found', async () => {
      const mockRecords = []
      const documentHash = 'mockedDocumentHash'

      jest.spyOn(recordsService, 'getRecords').mockResolvedValue(mockRecords)

      const result = await controller.getRecords(documentHash)

      expect(recordsService.getRecords).toHaveBeenCalledWith(documentHash)
      expect(result).toContain('<label>Registro Não Encontrado</label>')
      expect(result).toContain('mockedDocumentHash')
    })

    it('should return a record with invalid status', async () => {
      const mockRecords = [
        {
          hash: 'mockedHash',
          exists: true,
          publicKey: 'mockKey',
          status: 1n,
          mecConformityStatus: 0n,
        },
      ]
      const documentHash = 'mockedDocumentHash'

      jest.spyOn(recordsService, 'getRecords').mockResolvedValue(mockRecords)

      const result = await controller.getRecords(documentHash)

      expect(recordsService.getRecords).toHaveBeenCalledWith(documentHash)
      expect(result).toContain('<label>Registros Encontrados</label>')
      expect(result).toContain('<span id="invalid">INVÁLIDO</span>')
      expect(result).toContain('<span id="valid">CONFORME</span>')
      expect(result).toContain('mockedHash')
      expect(result).toContain('mockKey')
    })

    it('should return a record with invalid mecConformityStatus', async () => {
      const mockRecords = [
        {
          hash: 'mockedHash',
          exists: true,
          publicKey: 'mockKey',
          status: 0n,
          mecConformityStatus: 1n,
        },
      ]
      const documentHash = 'mockedDocumentHash'

      jest.spyOn(recordsService, 'getRecords').mockResolvedValue(mockRecords)

      const result = await controller.getRecords(documentHash)

      expect(recordsService.getRecords).toHaveBeenCalledWith(documentHash)
      expect(result).toContain('<label>Registros Encontrados</label>')
      expect(result).toContain('<span id="valid">VÁLIDO</span>')
      expect(result).toContain('<span id="invalid">NÃO CONFORME</span>')
      expect(result).toContain('mockedHash')
      expect(result).toContain('mockKey')
    })

    it('should throw an error', async () => {
      const error = new Error('mockedError')
      const documentHash = 'mockedDocumentHash'

      jest.spyOn(recordsService, 'getRecords').mockRejectedValue(error)

      await expect(controller.getRecords(documentHash)).rejects.toThrowError(
        'mockedError',
      )
    })
  })

  describe('verifyOwnership', () => {
    it('should return ownership form', async () => {
      const publicKey = 'mockedPublicKey'
      const documentHash = 'mockedDocumentHash'

      jest.spyOn(recordsService, 'verifyOwnership').mockResolvedValue(true)

      const result = await controller.verifyOwnership(documentHash, publicKey)

      expect(recordsService.verifyOwnership).toHaveBeenCalledWith(documentHash, publicKey)
      expect(result).toContain('<label>Atualizar Status</label>')
      expect(result).toContain('mockedDocumentHash')
      expect(result).toContain('mockedPublicKey')
    })

    it('should not return ownership form', async () => {
      const publicKey = 'mockedPublicKey'
      const documentHash = 'mockedDocumentHash'

      jest.spyOn(recordsService, 'verifyOwnership').mockResolvedValue(false)

      const result = await controller.verifyOwnership(documentHash, publicKey)

      expect(recordsService.verifyOwnership).toHaveBeenCalledWith(documentHash, publicKey)
      expect(result).toContain(
        '<label>Registro não Encontrado para sua Chave Pública</label>',
      )
      expect(result).toContain('mockedDocumentHash')
      expect(result).toContain('mockedPublicKey')
    })

    it('should throw an error', async () => {
      const error = new Error('mockedError')
      const publicKey = 'mockedPublicKey'
      const documentHash = 'mockedDocumentHash'

      jest.spyOn(recordsService, 'verifyOwnership').mockRejectedValue(error)

      await expect(
        controller.verifyOwnership(documentHash, publicKey),
      ).rejects.toThrowError('mockedError')
    })
  })
})
