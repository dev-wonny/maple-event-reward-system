import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ProxyService } from '../proxy/proxy.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateUserDto, LoginDto } from '../dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly proxyService: ProxyService) {}

  /**
   * 사용자 로그인 및 JWT 토큰 발급
   */
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    // 로그인 요청을 Auth 서비스로 전달 (인증 없이 접근 가능)
    return this.proxyService.sendToAuthService('login', loginDto);
  }

  /**
   * 새로운 사용자 등록
   */
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    // 회원가입 요청을 Auth 서비스로 전달 (인증 없이 접근 가능)
    return this.proxyService.sendToAuthService('signup', createUserDto);
  }

  /**
   * JWT 기반 사용자 정보 조회 (인증 필요)
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile() {
    // GET 요청을 사용하여 Auth 서비스의 /auth/me 엔드포인트 호출
    // JWT 토큰은 헤더를 통해 자동으로 전달됨
    return this.proxyService.getFromAuthService('me');
  }
}
