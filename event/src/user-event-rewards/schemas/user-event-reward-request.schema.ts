import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { RewardDeliveryType } from '../../../../libs/common/enums/reward-delivery-type.enum';
import { RewardStatus } from '../../../../libs/common/enums/reward-status.enum';
import { TriggerType } from '../../../../libs/common/enums/trigger-type.enum';
import { RewardType } from '../../../../libs/common/enums/reward-type.enum';

export class RewardSnapshot {
  @ApiProperty({
    description: '보상 타입',
    enum: RewardType,
    example: RewardType.ITEM,
  })
  @Prop({ type: String, enum: Object.values(RewardType) })
  type: string;

  @ApiProperty({
    description: '보상 수량',
    example: 1,
  })
  @Prop({ type: Number })
  quantity: number;

  @ApiProperty({
    description: '아이템 ID',
    example: 'item-001',
  })
  @Prop({ type: String })
  itemId?: string;

  @ApiProperty({
    description: '보상 설명',
    example: '레어 아이템',
  })
  @Prop({ type: String })
  description?: string;
}

@Schema({ timestamps: true })
export class UserEventRewardRequest extends Document {
  @ApiProperty({
    description: '유저 ID',
    example: 'user-123',
  })
  @Prop({ required: true })
  userId: string;

  @ApiProperty({
    description: '이벤트 ID',
    example: 'event-001',
  })
  @Prop({ required: true })
  eventId: string;

  @ApiProperty({
    description: '트리거 타입',
    enum: TriggerType,
    example: TriggerType.MANUAL,
  })
  @Prop({ required: true, enum: TriggerType })
  trigger: TriggerType;

  @ApiProperty({
    description: '보상 전달 타입',
    enum: RewardDeliveryType,
    example: RewardDeliveryType.MANUAL_CLAIM,
  })
  @Prop({ required: true, enum: RewardDeliveryType })
  deliveryType: RewardDeliveryType;

  // 당시의 reward 정보 snapshot
  @ApiProperty({
    description: '보상 스냅샷 정보',
    example: {
      type: RewardType.ITEM,
      quantity: 1,
      itemId: 'item-001',
      description: '레어 아이템',
    },
  })
  @Prop({ type: RewardSnapshot })
  rewardSnapshot: RewardSnapshot;

  @ApiProperty({
    description: '보상 상태',
    enum: RewardStatus,
    example: RewardStatus.PENDING,
  })
  @Prop({
    type: String,
    enum: Object.values(RewardStatus),
    required: true,
    default: RewardStatus.PENDING,
  })
  status: RewardStatus;

  @ApiProperty({
    description: '유저가 보상을 요청한 시간',
    example: '2025-01-01T12:00:00Z',
  })
  @Prop({ type: Date }) // 유저가 요청 클릭한 시점 (optional)
  requestedAt?: Date;

  @ApiProperty({
    description: '보상 처리 결과에 대한 이유 (실패 시 오류 메시지 등)',
    example: '이미 보상을 받았습니다.',
  })
  @Prop({ type: String })
  reason?: string;
}

export const UserEventRewardRequestSchema = SchemaFactory.createForClass(
  UserEventRewardRequest,
);

// 중복 요청 방지를 위한 인덱스 설정
UserEventRewardRequestSchema.index({ userId: 1, eventId: 1 }, { unique: true });
UserEventRewardRequestSchema.index({ status: 1 });
UserEventRewardRequestSchema.index({ createdAt: 1 });
