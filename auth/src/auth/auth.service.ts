import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/schemas/user.schema';
import { UserResponseDto } from './dto/user-response.dto';
import { LoginResponseDto } from './dto/login-response.dto';

// User 데이터를 위한 인터페이스 정의
interface UserDocument {
  _id: any;
  userId: string;
  email: string;
  nickName: string;
  password: string;
  role: string;
  isBlocked: boolean;
  lastLoginAt?: Date;
  loginCount: number;
  invitedBy?: string;
  loginDays: number;
  createdAt?: Date;
  updatedAt?: Date;

  [key: string]: any; // 기타 가능한 필드를 위한 인덱스 시그니처
}

// JWT 페이로드 인터페이스 정의
interface JwtPayload {
  sub: string; // userId
  email: string;
  role: string;
  nickname: string;
}

/**
 * 사용자 데이터에서 비밀번호를 제외한 응답 DTO로 변환하는 헬퍼 함수
 */
function mapToUserResponse(user: UserDocument): UserResponseDto {
  // 비밀번호 필드 제외
  const { password, ...userResponse } = user;
  return userResponse as UserResponseDto;
}

/**
 * 사용자 데이터에서 JWT 토큰 페이로드를 생성하는 헬퍼 함수
 */
function createJwtPayload(user: User): JwtPayload {
  return {
    sub: user.userId,
    email: user.email,
    role: user.role,
    nickname: user.nickName,
  };
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(userId: string, password: string): Promise<User> {
    const user = await this.usersService.findByUserId(userId);
    if (!user) {
      throw new UnauthorizedException('사용자 ID를 찾을 수 없습니다');
    }

    // bcrypt를 사용하여 비밀번호 검증
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다');
    }

    return user;
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.validateUser(loginDto.userId, loginDto.password);

    // 로그인 카운트 증가
    await this.usersService.incrementLoginCount(user.userId);

    // JWT 페이로드 생성
    const payload = createJwtPayload(user);

    // 헬퍼 함수를 사용하여 UserResponseDto로 변환
    // const userResponse = mapToUserResponse(user as unknown as UserDocument);

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(createUserDto: CreateUserDto): Promise<LoginResponseDto> {
    try {
      // 이미 존재하는 사용자 ID인지 확인
      const existingUserById = await this.usersService.findByUserId(
        createUserDto.userId,
      );
      if (existingUserById) {
        throw new ConflictException('User ID already exists');
      }

      // 이미 존재하는 이메일인지 확인
      const existingUserByEmail = await this.usersService.findByEmail(
        createUserDto.email,
      );
      if (existingUserByEmail) {
        throw new ConflictException('Email already exists');
      }

      // 비밀번호 유효성 검사 (예: 최소 길이, 복잡성 등)
      if (createUserDto.password.length < 8) {
        throw new BadRequestException(
          'Password must be at least 8 characters long',
        );
      }

      // bcrypt를 사용하여 비밀번호 해싱
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const newUser = {
        ...createUserDto,
        password: hashedPassword,
      };

      const createdUser = await this.usersService.create(newUser);

      // JWT 페이로드 생성
      const payload = createJwtPayload(createdUser);

      // 로그인과 동일한 형식의 응답 반환
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      // MongoDB 중복 키 오류 처리 (E11000)
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        throw new ConflictException(`${field} already exists`);
      }
      // 그 외 오류는 그대로 전달
      throw error;
    }
  }

  async getProfile(userId: string): Promise<UserResponseDto> {
    const user = await this.usersService.findByUserId(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // 헬퍼 함수를 사용하여 UserResponseDto로 변환
    return mapToUserResponse(user as unknown as UserDocument);
  }
}
