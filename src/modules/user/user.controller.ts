import {
  BadRequestException,
  Body,
  Controller,
  Get, Header,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  UserFilterDTO,
  GetUserByFilter,
  RegisterUserDTO, UpdateUserDTO,
} from '../../dto/user.dto';
import { MessageEnum, UserStatusEnum } from '../../core/base/base.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PageDto, PageOptionsDto } from '../../dto/pagination.dto';
import { User } from '../../entities/user.entity';
import { CurrentUser } from '../../core/decorator/user.decorator';
import { UserInformation } from '../../core/interceptors';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Post('create')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async CreateUser(@Body() request: RegisterUserDTO) {
    const existedUsers = await this.userService.getAllBy([
      {
        username: request.username,
        status: UserStatusEnum.ACTIVE,
      },
      {
        phone: request.phone,
        status: UserStatusEnum.ACTIVE,
      },
    ]);
    const duplicatePhone = existedUsers.find(
      (user) => user.phone === request.phone,
    );
    const duplicateUserName = existedUsers.find(
      (user) => user.username === request.username,
    );

    if (duplicatePhone) {
      throw new BadRequestException(MessageEnum.PHONE_NUMBER_DUPLICATE);
    } else if (duplicateUserName) {
      throw new BadRequestException(MessageEnum.USERNAME_DUPLICATE);
    }

    const hashPassword = await bcrypt.hash(request.password, 5);
    await this.userService.create({
      username: request.username,
      password: hashPassword,
      fullName: request.fullName,
      mail: request.mail,
      firstName: request.firstName,
      lastName: request.lastName,
      status: UserStatusEnum.ACTIVE,
      phone: request.phone,
    });
    return MessageEnum.CREATE_SUCCESS;
  }

  @Get('list')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async ListUsers(
    @Query() filter: UserFilterDTO,
    @Query() pagination: PageOptionsDto,
  ): Promise<PageDto<User>> {
    return await this.userService.Pagination(filter, pagination);
  }

  @Get('detail')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async GetDetailUser(@CurrentUser() currentUser : UserInformation): Promise<User> {

    return await this.userService.getUser(currentUser.uuid);
  }

  @Post('update')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async UpdateDetailUser(@Body() request: UpdateUserDTO , @CurrentUser() currentUser : UserInformation) {
    return await this.userService.updateUser(request);
  }
}
