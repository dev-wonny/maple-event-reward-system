import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TriggerType } from '../../../../libs/common/enums/trigger-type.enum';
import { RewardDeliveryType } from '../../../../libs/common/enums/reward-delivery-type.enum';

export class CreateUserEventRewardRequestDto {
  @ApiProperty({
    description: '유저 ID',
    example: 'user-123',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: '이벤트 ID',
    example: 'event-001',
  })
  @IsString()
  @IsNotEmpty()
  eventId: string;

  @ApiProperty({
    description: '트리거 타입',
    enum: TriggerType,
    example: TriggerType.MANUAL,
  })
  @IsEnum(TriggerType)
  @IsNotEmpty()
  trigger: TriggerType;

  @ApiProperty({
    description: '보상 전달 타입',
    enum: RewardDeliveryType,
    example: RewardDeliveryType.MANUAL_CLAIM,
  })
  @IsEnum(RewardDeliveryType)
  @IsNotEmpty()
  deliveryType: RewardDeliveryType;

  @ApiProperty({
    description: '유저가 보상을 요청한 시간',
    example: '2025-01-01T12:00:00Z',
    required: false,
  })
  @IsOptional()
  requestedAt?: Date;
}
