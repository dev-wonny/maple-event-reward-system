import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserResponseDto } from './dto/user-response.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '로그인',
    description: '사용자 로그인 및 JWT 토큰 발급',
  })
  @ApiResponse({
    status: 200,
    description: '로그인 성공',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto);
  }

  @ApiOperation({ summary: '회원가입', description: '새로운 사용자 등록' })
  @ApiResponse({
    status: 201,
    description: '회원가입 성공',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @Post('signup')
  async signup(
    @Body() createUserDto: CreateUserDto,
  ): Promise<LoginResponseDto> {
    return this.authService.signup(createUserDto);
  }

  @ApiOperation({
    summary: '내 정보 조회',
    description: 'JWT 기반 사용자 정보 조회 (인증 필요)',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 정보 조회 성공',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: '인증 실패 - 유효한 JWT 토큰 필요' })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req): Promise<UserResponseDto> {
    return this.authService.getProfile(req.user.userId);
  }
}
