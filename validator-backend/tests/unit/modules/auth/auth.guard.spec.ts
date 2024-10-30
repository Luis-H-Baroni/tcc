import { Test, TestingModule } from '@nestjs/testing'
import { UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'
import { AuthGuard } from 'src/modules/auth/auth.guard'

describe('AuthGuard', () => {
  let guard: AuthGuard
  let configService: ConfigService
  let jwtService: JwtService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthGuard, ConfigService, JwtService],
    }).compile()

    guard = module.get<AuthGuard>(AuthGuard)
    configService = module.get<ConfigService>(ConfigService)
    jwtService = module.get<JwtService>(JwtService)
  })

  describe('canActivate', () => {
    it('should return true if a valid token is provided in the Authorization header', async () => {
      const request = {
        headers: {
          authorization: 'Bearer validToken',
        },
      } as Request
      jest.spyOn(guard, 'extractTokenFromHeader' as any)
      jest.spyOn(configService, 'get').mockReturnValue('secret')
      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue({ sub: 1 })

      const result = await guard.canActivate({
        switchToHttp: () => ({ getRequest: () => request }),
      } as any)

      expect(result).toBe(true)
      expect(guard['extractTokenFromHeader']).toHaveBeenCalledWith(request)
      expect(configService.get).toHaveBeenCalledWith('jwt.secret')
      expect(jwtService.verifyAsync).toHaveBeenCalledWith('validToken', {
        secret: 'secret',
      })
      expect(request['user']).toEqual({ sub: 1 })
    })

    it('should throw UnauthorizedException if no token is provided in the Authorization header', async () => {
      const request = {
        headers: {},
      } as Request
      jest.spyOn(guard, 'extractTokenFromHeader' as any)

      await expect(
        guard.canActivate({ switchToHttp: () => ({ getRequest: () => request }) } as any),
      ).rejects.toThrow(UnauthorizedException)
      expect(guard['extractTokenFromHeader']).toHaveBeenCalledWith(request)
    })

    it('should throw UnauthorizedException if an invalid token is provided in the Authorization header', async () => {
      const request = {
        headers: {
          authorization: 'Bearer invalidToken',
        },
      } as Request
      jest.spyOn(guard, 'extractTokenFromHeader' as any)

      jest.spyOn(configService, 'get').mockReturnValue('secret')
      jest.spyOn(jwtService, 'verifyAsync').mockRejectedValue(new Error())

      await expect(
        guard.canActivate({ switchToHttp: () => ({ getRequest: () => request }) } as any),
      ).rejects.toThrow(UnauthorizedException)
      expect(guard['extractTokenFromHeader']).toHaveBeenCalledWith(request)
      expect(configService.get).toHaveBeenCalledWith('jwt.secret')
      expect(jwtService.verifyAsync).toHaveBeenCalledWith('invalidToken', {
        secret: 'secret',
      })
    })

    it('should throw UnauthorizedException if an invalid token type is provided in the Authorization header', async () => {
      const request = {
        headers: {
          authorization: 'InvalidType invalidToken',
        },
      } as Request
      jest.spyOn(guard, 'extractTokenFromHeader' as any)

      await expect(
        guard.canActivate({ switchToHttp: () => ({ getRequest: () => request }) } as any),
      ).rejects.toThrow(UnauthorizedException)
      expect(guard['extractTokenFromHeader']).toHaveBeenCalledWith(request)
    })

    it('should throw UnauthorizedException if no header is provided', async () => {
      const request = {
        headers: {},
      } as Request

      await expect(
        guard.canActivate({ switchToHttp: () => ({ getRequest: () => request }) } as any),
      ).rejects.toThrow(UnauthorizedException)
    })
  })
})
