import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      // HTTP 요청의 Authorization 헤더에서 Bearer 토큰을 추출
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 만료된 토큰은 거부
      ignoreExpiration: false,
      // 토큰 검증에 사용할 비밀 키
      secretOrKey:
        configService.get<string>('JWT_SECRET') ||
        'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0',
    });
  }

  // 토큰이 유효하면 이 메서드가 호출됨
  async validate(payload: any) {
    // 페이로드에서 필요한 정보를 추출하여 반환
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
      nickname: payload.nickname,
    };
  }
}
