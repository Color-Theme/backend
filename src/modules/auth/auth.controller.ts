import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ChangePasswordDTO, LoginDTO } from '../../dto/auth.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AuthService } from './auth.service';
import { ApiKeyGuard } from './guards/api-key.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from '../../core/decorator/user.decorator';
import { UserInformation } from '../../core/interceptors';
import { Throttle } from '@nestjs/throttler'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async Login(@Body() request: LoginDTO) {
    if (request.accessToken) {
      return this.authService.LoginWithToken(request.accessToken);
    } else {
      return this.authService.LoginWithAccount(
        request.username,
        request.password,
      );
    }
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async ChangePassword(@Body() request: ChangePasswordDTO , @CurrentUser() currentUser : UserInformation) {
    return await this.authService.ChangePassword(request,currentUser)
  }
}
