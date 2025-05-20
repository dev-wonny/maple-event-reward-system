import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../../libs/common/enums/role.enum';

export class UserResponseDto {
  @ApiProperty({
    description: '사용자 ID',
    example: 'user123',
  })
  userId: string;

  @ApiProperty({
    description: '이메일',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: '닉네임',
    example: '테스트유저',
  })
  nickName: string;

  @ApiProperty({
    description: '역할',
    enum: Role,
    example: Role.USER,
  })
  role: Role;

  @ApiProperty({
    description: '차단 여부',
    default: false,
  })
  isBlocked?: boolean;

  @ApiProperty({
    description: '마지막 로그인 시간',
  })
  lastLoginAt?: Date;

  @ApiProperty({
    description: '로그인 횟수',
    default: 0,
  })
  loginCount?: number;

  @ApiProperty({
    description: '초대한 사용자',
  })
  invitedBy?: string;

  @ApiProperty({
    description: '로그인 일수',
    default: 0,
  })
  loginDays?: number;

  @ApiProperty({
    description: '생성 시간',
  })
  createdAt?: Date;

  @ApiProperty({
    description: '수정 시간',
  })
  updatedAt?: Date;
}
