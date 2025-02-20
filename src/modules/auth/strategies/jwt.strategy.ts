import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { MessageEnum } from '../../../core/base/base.enum';
import { decryptPayload } from '../../../core/helper/crypto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-strategy') {
  private secretKey = process.env.SECRET_KEY_PAYLOAD
  constructor(private readonly authentication: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: process.env.SECRET_KEY_JWT,
    });
  }

  async validate(payload: any) {
    const currentTime = Math.floor(Date.now() / 1000);

    if (payload.exp && currentTime > payload.exp) {
      throw new UnauthorizedException(MessageEnum.TOKEN_EXPIRED);
    }
    const decrypt = decryptPayload(payload.data , this.secretKey)

    await this.authentication.ValidateUser(decrypt.uuid, decrypt.fullName);
    return payload;
  }
}
