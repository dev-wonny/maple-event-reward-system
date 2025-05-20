import { ApiProperty } from '@nestjs/swagger';
import { RewardDeliveryType } from '../../../../libs/common/enums/reward-delivery-type.enum';
import { RewardStatus } from '../../../../libs/common/enums/reward-status.enum';
import { TriggerType } from '../../../../libs/common/enums/trigger-type.enum';
import { RewardType } from '../../../../libs/common/enums/reward-type.enum';

export class UserEventRewardRequestResponseDto {
  @ApiProperty({
    description: '요청 ID',
    example: '60d21b4667d0d8992e610c90',
  })
  id: string;

  @ApiProperty({
    description: '유저 ID',
    example: 'user-123',
  })
  userId: string;

  @ApiProperty({
    description: '이벤트 ID',
    example: 'event-001',
  })
  eventId: string;

  @ApiProperty({
    description: '트리거 타입',
    enum: TriggerType,
    example: TriggerType.MANUAL,
  })
  trigger: TriggerType;

  @ApiProperty({
    description: '보상 전달 타입',
    enum: RewardDeliveryType,
    example: RewardDeliveryType.MANUAL_CLAIM,
  })
  deliveryType: RewardDeliveryType;

  @ApiProperty({
    description: '보상 스냅샷 정보',
    example: {
      type: RewardType.ITEM,
      quantity: 1,
      itemId: 'item-001',
      description: '레어 아이템',
    },
  })
  rewardSnapshot: {
    type: RewardType;
    quantity: number;
    itemId?: string;
    description?: string;
  };

  @ApiProperty({
    description: '보상 상태',
    enum: RewardStatus,
    example: RewardStatus.PENDING,
  })
  status: RewardStatus;

  @ApiProperty({
    description: '유저가 보상을 요청한 시간',
    example: '2025-01-01T12:00:00Z',
  })
  requestedAt?: Date;

  @ApiProperty({
    description: '보상 처리 결과에 대한 이유 (실패 시 오류 메시지 등)',
    example: '이미 보상을 받았습니다.',
  })
  reason?: string;

  @ApiProperty({
    description: '생성 시간',
    example: '2025-01-01T12:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: '수정 시간',
    example: '2025-01-01T12:00:00Z',
  })
  updatedAt: Date;
}
