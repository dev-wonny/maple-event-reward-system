import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export enum UserRole {
  USER = 'USER',
  OPERATOR = 'OPERATOR',
  AUDITOR = 'AUDITOR',
  ADMIN = 'ADMIN'
}

export class CreateUserDto {
  @IsString({ message: '사용자 ID는 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '사용자 ID는 필수 입력 항목입니다.' })
  userId: string;

  @IsEmail({}, { message: '유효한 이메일 주소를 입력해주세요.' })
  @IsNotEmpty({ message: '이메일은 필수 입력 항목입니다.' })
  email: string;

  @IsString({ message: '닉네임은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '닉네임은 필수 입력 항목입니다.' })
  nickName: string;

  @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '비밀번호는 필수 입력 항목입니다.' })
  @MinLength(6, { message: '비밀번호는 최소 6자 이상이어야 합니다.' })
  password: string;

  @IsEnum(UserRole, { message: '유효한 역할이 아닙니다.' })
  @IsNotEmpty({ message: '역할은 필수 입력 항목입니다.' })
  role: UserRole;

  @IsBoolean({ message: '차단 여부는 불리언 값이어야 합니다.' })
  @IsOptional()
  isBlocked?: boolean;

  @IsString({ message: '마지막 로그인 시간은 문자열이어야 합니다.' })
  @IsOptional()
  lastLoginAt?: string;

  @IsNumber({}, { message: '로그인 횟수는 숫자여야 합니다.' })
  @IsOptional()
  loginCount?: number;

  @IsString({ message: '초대한 사용자는 문자열이어야 합니다.' })
  @IsOptional()
  invitedBy?: string;

  @IsNumber({}, { message: '로그인 일수는 숫자여야 합니다.' })
  @IsOptional()
  loginDays?: number;
}

export class UpdateUserDto {
  @IsString({ message: '사용자 ID는 문자열이어야 합니다.' })
  @IsOptional()
  userId?: string;

  @IsEmail({}, { message: '유효한 이메일 주소를 입력해주세요.' })
  @IsOptional()
  email?: string;

  @IsString({ message: '닉네임은 문자열이어야 합니다.' })
  @IsOptional()
  nickName?: string;

  @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
  @IsOptional()
  @MinLength(6, { message: '비밀번호는 최소 6자 이상이어야 합니다.' })
  password?: string;

  @IsEnum(UserRole, { message: '유효한 역할이 아닙니다.' })
  @IsOptional()
  role?: UserRole;

  @IsBoolean({ message: '차단 여부는 불리언 값이어야 합니다.' })
  @IsOptional()
  isBlocked?: boolean;
}

export class LoginDto {
  @IsString({ message: '사용자 ID는 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '사용자 ID는 필수 입력 항목입니다.' })
  userId: string;

  @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '비밀번호는 필수 입력 항목입니다.' })
  password: string;
}

export class LoginResponseDto {
  @IsString({ message: '액세스 토큰은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '액세스 토큰은 필수 항목입니다.' })
  access_token: string;
}

export class UserResponseDto {
  @IsString()
  userId: string;

  @IsEmail()
  email: string;

  @IsString()
  nickName: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsBoolean()
  isBlocked: boolean;

  @IsString()
  lastLoginAt: string;

  @IsNumber()
  loginCount: number;

  @IsString()
  invitedBy: string;

  @IsNumber()
  loginDays: number;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;
}
