import { Test, TestingModule } from '@nestjs/testing'

import { JwtService } from '@nestjs/jwt'
import { UnauthorizedException } from '@nestjs/common'
import { AuthService } from 'src/modules/auth/auth.service'
import { UsersService } from 'src/modules/users/users.service'
import { Repository } from 'typeorm'

describe('AuthService', () => {
  let service: AuthService
  let usersService: UsersService
  let jwtService: JwtService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        JwtService,
        { provide: 'UserRepository', useClass: Repository },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
    usersService = module.get<UsersService>(UsersService)
    jwtService = module.get<JwtService>(JwtService)
  })

  describe('signIn', () => {
    it('should return an access token when valid username and password are provided', async () => {
      // Arrange
      const username = 'testuser'
      const password = 'testpassword'
      const user = { id: 1, username, password }
      const expectedToken = 'testtoken'
      jest.spyOn(usersService, 'findOneByUsername').mockResolvedValue(user)
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(expectedToken)

      // Act
      const result = await service.signIn(username, password)

      // Assert
      expect(result.access_token).toBe(expectedToken)
      expect(usersService.findOneByUsername).toHaveBeenCalledWith(username)
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: user.id,
        username: user.username,
      })
    })

    it('should throw UnauthorizedException when invalid username or password are provided', async () => {
      // Arrange
      const username = 'testuser'
      const password = 'testpassword'
      const user = { id: 1, username, password: 'wrongpassword' }
      jest.spyOn(usersService, 'findOneByUsername').mockResolvedValue(user)

      // Act & Assert
      await expect(service.signIn(username, password)).rejects.toThrow(
        UnauthorizedException,
      )
      expect(usersService.findOneByUsername).toHaveBeenCalledWith(username)
    })
  })
})
