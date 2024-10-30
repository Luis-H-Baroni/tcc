import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from '../../../../src/modules/auth/auth.controller'
import { AuthService } from '../../../../src/modules/auth/auth.service'
import { AuthGuard } from '../../../../src/modules/auth/auth.guard'
import { JwtService } from '@nestjs/jwt'
import { Repository } from 'typeorm'
import { UsersService } from 'src/modules/users/users.service'

describe('AuthController', () => {
  let controller: AuthController
  let authService: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        JwtService,
        UsersService,
        { provide: 'UserRepository', useClass: Repository },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile()

    controller = module.get<AuthController>(AuthController)
    authService = module.get<AuthService>(AuthService)
  })

  describe('signIn', () => {
    it('should return the result of authService.signIn', () => {
      const signInDto = { username: 'test', password: 'password' }
      const expectedResult = { access_token: 'test token' } as any

      jest.spyOn(authService, 'signIn').mockReturnValue(expectedResult)

      const result = controller.signIn(signInDto)

      expect(result).toBe(expectedResult)
      expect(authService.signIn).toHaveBeenCalledWith(
        signInDto.username,
        signInDto.password,
      )
    })
  })
})
