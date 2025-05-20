import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserEventRewardHistoryDto {
  @ApiProperty({ description: '유저 ID', example: 'user-123' })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({ description: '이벤트 ID', example: 'event-001' })
  @IsNotEmpty()
  @IsString()
  eventId: string;

  @ApiProperty({ description: '보상 ID', example: 'reward-abc123' })
  @IsNotEmpty()
  @IsString()
  rewardId: string;

  @ApiProperty({ description: '보상 수량', example: 10 })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty({
    description: '아이템 ID (선택)',
    example: 'item-001',
    required: false,
  })
  @IsOptional()
  @IsString()
  itemId?: string;

  @ApiProperty({
    description: '유저가 보상 요청한 날짜',
    example: '2025-01-01T12:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  requestedAt?: string;

  @ApiProperty({
    description: '보상이 실제 지급된 시간',
    example: '2025-01-01T12:01:30Z',
  })
  @IsOptional()
  @IsDateString()
  deliveredAt?: string;
}
