import { UserStatusEnum } from '../base/base.enum';

export class UserInformation {
  uuid: string;
  fullName: string;
  status: UserStatusEnum;
  iat: bigint;
  exp: bigint;
}
