import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class UserEventRewardHistory extends Document {
  @ApiProperty({ description: '유저 ID', example: 'user-123' })
  @Prop({ required: true })
  userId: string;

  @ApiProperty({ description: '이벤트 ID', example: 'event-001' })
  @Prop({ required: true })
  eventId: string;

  @ApiProperty({ description: '보상 ID', example: 'reward-abc123' })
  @Prop({ required: true })
  rewardId: string;

  @ApiProperty({ description: '보상 수량', example: 10 })
  @Prop({ required: true })
  quantity: number;

  @ApiProperty({
    description: '아이템 ID (선택)',
    example: 'item-001',
    required: false,
  })
  @Prop()
  itemId?: string;

  @ApiProperty({
    description: '유저가 보상 요청한 날짜',
    example: '2025-01-01T12:00:00Z',
  })
  @Prop()
  requestedAt?: Date;

  @ApiProperty({
    description: '보상이 실제 지급된 시간',
    example: '2025-01-01T12:01:30Z',
  })
  @Prop()
  deliveredAt: Date;

  @ApiProperty({ description: '생성 시간' })
  createdAt: Date;

  @ApiProperty({ description: '수정 시간' })
  updatedAt: Date;
}

export type UserEventRewardHistoryDocument = UserEventRewardHistory & Document;

export const UserEventRewardHistorySchema = SchemaFactory.createForClass(
  UserEventRewardHistory,
);

// 인덱스 최적화
UserEventRewardHistorySchema.index({ userId: 1, eventId: 1 });
UserEventRewardHistorySchema.index({ deliveredAt: 1 });
