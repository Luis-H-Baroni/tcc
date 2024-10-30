import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { User } from 'src/modules/users/users.entity'
import { UsersService } from 'src/modules/users/users.service'
import { Repository } from 'typeorm'

describe('UsersService', () => {
  let usersService: UsersService
  let usersRepository: Repository<User>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile()

    usersService = module.get<UsersService>(UsersService)
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User))
  })

  describe('create', () => {
    it('should create a new user', async () => {
      const user: User = { id: 1, username: 'john.doe', password: 'password' }
      jest.spyOn(usersRepository, 'save').mockResolvedValue(user)

      const result = await usersService.create(user)

      expect(usersRepository.save).toHaveBeenCalledWith(user)
      expect(result).toEqual(user)
    })
  })

  describe('update', () => {
    it('should update an existing user', async () => {
      const user: User = { id: 1, username: 'john.doe', password: 'password' }
      jest.spyOn(usersRepository, 'save').mockResolvedValue(user)

      const result = await usersService.update(user)

      expect(usersRepository.save).toHaveBeenCalledWith(user)
      expect(result).toEqual(user)
    })
  })

  describe('findAll', () => {
    it('should return all users', async () => {
      const users: User[] = [
        { id: 1, username: 'john.doe', password: 'password' },
        { id: 2, username: 'jane.doe', password: 'password' },
      ]
      jest.spyOn(usersRepository, 'find').mockResolvedValue(users)

      const result = await usersService.findAll()

      expect(usersRepository.find).toHaveBeenCalled()
      expect(result).toEqual(users)
    })
  })

  describe('findOneById', () => {
    it('should return a user by id', async () => {
      const user: User = { id: 1, username: 'john.doe', password: 'password' }
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(user)

      const result = await usersService.findOneById(1)

      expect(usersRepository.findOneBy).toHaveBeenCalledWith({ id: 1 })
      expect(result).toEqual(user)
    })
  })

  describe('findOneByUsername', () => {
    it('should return a user by username', async () => {
      const user: User = { id: 1, username: 'john.doe', password: 'password' }
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(user)

      const result = await usersService.findOneByUsername('john.doe')

      expect(usersRepository.findOneBy).toHaveBeenCalledWith({ username: 'john.doe' })
      expect(result).toEqual(user)
    })
  })

  describe('remove', () => {
    it('should remove a user by id', async () => {
      jest.spyOn(usersRepository, 'delete').mockResolvedValue(undefined)

      await usersService.remove(1)

      expect(usersRepository.delete).toHaveBeenCalledWith(1)
    })
  })
})
