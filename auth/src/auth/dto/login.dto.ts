import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: '사용자 ID',
    example: 'user123',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: '비밀번호',
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
