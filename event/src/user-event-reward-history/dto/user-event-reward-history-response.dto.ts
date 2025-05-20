import { ApiProperty } from '@nestjs/swagger';

export class UserEventRewardHistoryResponseDto {
  @ApiProperty({ description: '보상 히스토리 ID' })
  id: string;

  @ApiProperty({ description: '유저 ID', example: 'user-123' })
  userId: string;

  @ApiProperty({ description: '이벤트 ID', example: 'event-001' })
  eventId: string;

  @ApiProperty({ description: '보상 ID', example: 'reward-abc123' })
  rewardId: string;

  @ApiProperty({ description: '보상 수량', example: 10 })
  quantity: number;

  @ApiProperty({
    description: '아이템 ID (선택)',
    example: 'item-001',
    required: false,
  })
  itemId?: string;

  @ApiProperty({
    description: '유저가 보상 요청한 날짜',
    example: '2025-01-01T12:00:00Z',
  })
  requestedAt?: Date;

  @ApiProperty({
    description: '보상이 실제 지급된 시간',
    example: '2025-01-01T12:01:30Z',
  })
  deliveredAt: Date;

  @ApiProperty({ description: '생성 시간' })
  createdAt: Date;

  @ApiProperty({ description: '수정 시간' })
  updatedAt: Date;
}
