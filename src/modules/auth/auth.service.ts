import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { isEmpty } from 'class-validator';
import { MessageEnum, UserStatusEnum } from '../../core/base/base.enum';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { instanceToPlain } from 'class-transformer';
import { RequestContext } from 'nestjs-request-context';
import { UserService } from '../user/user.service';
import { UserRolePermissionService } from '../user-role-permission/user-role-permission.service';
import { decryptPayload, encryptPayload } from '../../core/helper/crypto';
import * as process from 'node:process';
import { UserInformation } from '../../core/interceptors';
import { ChangePasswordDTO } from '../../dto/auth.dto';

@Injectable()
export class AuthService {
  private secretKey = process.env.SECRET_KEY_PAYLOAD;

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly userRolePermissionService: UserRolePermissionService,
  ) {}

  async LoginWithToken(accessToken: string) {
    if (isEmpty(accessToken)) {
      throw new BadRequestException(MessageEnum.TOKEN_EMPTY);
    }

    let encryptPayload: any;
    try {
      encryptPayload = this.jwtService.verify(accessToken);
    } catch (error) {
      throw new UnauthorizedException(MessageEnum.TOKEN_INVALID);
    }

    const payload = decryptPayload(encryptPayload.data, this.secretKey);

    const user = await this.userService.findOneBy({
      uuid: payload.uuid,
      status: UserStatusEnum.ACTIVE,
    });

    if (!user) {
      throw new UnauthorizedException(MessageEnum.USER_NOT_FOUND);
    }

    return MessageEnum.LOGIN_SUCCESS;
  }

  async LoginWithAccount(username: string, password: string) {
    if (isEmpty(username) || isEmpty(password)) {
      throw new BadRequestException(MessageEnum.USERNAME_PASSWORD_EMPTY);
    }

    const user = await this.userService.findOneBy({
      username: username,
      status: UserStatusEnum.ACTIVE,
    });
    if (!user) {
      throw new BadRequestException(MessageEnum.USER_NOT_FOUND);
    }
    const compare = await bcrypt.compare(password, user.password);

    if (!compare) {
      throw new UnauthorizedException(MessageEnum.USERNAME_PASSWORD_WRONG);
    }

    const dataToken = {
      uuid: user.uuid,
      fullName: user.fullName,
      status: user.status,
    };

    const token = this.createToken(dataToken, this.jwtService);

    return token;
  }

  private createPayloadToken<T>(
    data: T,
    type: 'ACCESS' | 'REFRESH',
  ): Record<string, any> {
    const modifiedData = { ...data, type };
    return instanceToPlain<T>(modifiedData);
  }

  private createToken(data: any, jwtService: JwtService) {
    const plainAccessToken = this.createPayloadToken(data, 'ACCESS');
    const plainRefreshToken = this.createPayloadToken(data, 'REFRESH');
    const milliSecond = 1000;
    const encryptedAccessToken = encryptPayload(
      plainAccessToken,
      this.secretKey,
    );
    const encryptedRefreshToken = encryptPayload(
      plainRefreshToken,
      this.secretKey,
    );

    const accessToken = jwtService.sign(
      { id: data.uuid, data: encryptedAccessToken },
      { expiresIn: '1d' },
    );
    const refreshToken = jwtService.sign(
      { id: data.uuid, data: encryptedRefreshToken },
      { expiresIn: '1d' },
    );

    const expiredAccessToken = jwtService.verify(accessToken).exp * milliSecond;

    const expiredRefreshToken =
      jwtService.verify(accessToken).exp * milliSecond;

    return {
      accessToken,
      expiredAccessToken,
      refreshToken,
      expiredRefreshToken,
    };
  }

  async ValidateUser(uuid: string, fullName: string) {
    const user = await this.userService.findOneBy({
      fullName: fullName,
      uuid: uuid,
      status: UserStatusEnum.ACTIVE,
    });

    if (!user) {
      throw new UnauthorizedException(MessageEnum.USER_NOT_FOUND);
    }

    // const req: Request = RequestContext.currentContext.req;
    //
    // const urlMatch = req.url.match(/\/v1(\/[^?]+)/);
    //
    // const havePermission =
    //   await this.userRolePermissionService.checkPermissionOfUser({
    //     pathApi: urlMatch[1],
    //     userId: user.id,
    //   });
    //
    // if (!havePermission) {
    //   throw new UnauthorizedException(MessageEnum.NO_PERMISSION);
    // }

    const { id, password, ...result } = user;
    return result;
  }

  async ChangePassword(
    request: ChangePasswordDTO,
    currentUser: UserInformation,
  ) {
    const user = await this.userService.getOne({ uuid: currentUser.uuid });
    if (!user) {
      throw new BadRequestException(MessageEnum.USER_NOT_FOUND);
    }
    const isMatch = await bcrypt.compare(
      request.currentPassword,
      user.password,
    );
    if (!isMatch) {
      throw new BadRequestException(
        MessageEnum.PASSWORD_WRONG,
      );
    }
    const hashedPassword = await bcrypt.hash(request.newPassword, 10);

    await this.userService.update(
      { uuid: currentUser.uuid },
      { password: hashedPassword },
    );
    return MessageEnum.CHANGE_PASSWORD_SUCCESS
  }
}
