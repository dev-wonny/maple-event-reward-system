import { ApiProperty } from '@nestjs/swagger';
import { EventCategory } from '../../../../libs/common/enums/event-category.enum';
import { TriggerType } from '../../../../libs/common/enums/trigger-type.enum';
import { RewardDeliveryType } from '../../../../libs/common/enums/reward-delivery-type.enum';
import { ConditionResponseDto } from '../../conditions/dto/condition-response.dto';
import { RewardResponseDto } from '../../rewards/dto/reward-response.dto';

export class EventResponseDto {
  @ApiProperty({
    description: '이벤트 ID',
    example: 'event-001',
  })
  eventId: string;

  @ApiProperty({
    description: '이벤트 제목',
    example: '7일 출석 이벤트',
  })
  title: string;

  @ApiProperty({
    description: '이벤트 카테고리',
    enum: EventCategory,
    example: EventCategory.ATTENDANCE,
  })
  category: string;

  @ApiProperty({
    description: '이벤트 조건 목록',
    type: [ConditionResponseDto],
  })
  conditions: ConditionResponseDto[];

  @ApiProperty({
    description: '이벤트 보상 목록',
    type: [RewardResponseDto],
  })
  rewards: RewardResponseDto[];

  @ApiProperty({
    description: '트리거 타입',
    enum: TriggerType,
    example: TriggerType.MANUAL,
  })
  trigger: string;

  @ApiProperty({
    description: '보상 전달 타입',
    enum: RewardDeliveryType,
    example: RewardDeliveryType.MANUAL_CLAIM,
  })
  deliveryType: string;

  @ApiProperty({
    description: '이벤트 시작 시간',
    example: '2025-01-01T00:00:00Z',
  })
  startAt: Date;

  @ApiProperty({
    description: '이벤트 종료 시간',
    example: '2025-01-31T23:59:59Z',
  })
  endAt: Date;

  @ApiProperty({
    description: '이벤트 활성화 여부',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: '생성 시간',
    example: '2025-05-20T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: '수정 시간',
    example: '2025-05-20T00:00:00.000Z',
  })
  updatedAt: Date;
}
