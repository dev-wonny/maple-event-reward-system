import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../../libs/common/enums/role.enum';

export class CreateUserDto {
  @ApiProperty({
    description: '사용자 ID',
    example: 'user123',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: '이메일',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: '닉네임',
    example: '테스트유저',
  })
  @IsString()
  nickName: string;

  @ApiProperty({
    description: '비밀번호',
    example: 'password123',
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: '역할',
    enum: Role,
    example: Role.USER,
  })
  @IsEnum(Role)
  role: Role;

  @ApiProperty({
    description: '차단 여부',
    required: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isBlocked?: boolean;

  @ApiProperty({
    description: '마지막 로그인 시간',
    required: false,
  })
  @IsDate()
  @IsOptional()
  lastLoginAt?: Date;

  @ApiProperty({
    description: '로그인 횟수',
    required: false,
    default: 0,
  })
  @IsNumber()
  @IsOptional()
  loginCount?: number;

  @ApiProperty({
    description: '초대한 사용자',
    required: false,
  })
  @IsString()
  @IsOptional()
  invitedBy?: string;

  @ApiProperty({
    description: '로그인 일수',
    required: false,
    default: 0,
  })
  @IsNumber()
  @IsOptional()
  loginDays?: number;
}
