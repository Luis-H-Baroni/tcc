import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

import { Request } from 'express'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)

    if (!token) {
      throw new UnauthorizedException()
    }

    const secret = this.configService.get('jwt.secret')
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: secret,
      })

      request['user'] = payload
    } catch {
      throw new UnauthorizedException()
    }
    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authorizationHeader = request.headers.authorization
    if (!authorizationHeader) return undefined

    const [type, token] = authorizationHeader.split(' ')
    return type === 'Bearer' ? token : undefined
  }
}
