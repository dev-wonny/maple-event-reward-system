import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { RewardType } from '../../../../libs/common';

@Schema({ timestamps: true })
export class Reward extends Document {
  @Prop({
    type: String,
    enum: Object.values(RewardType),
    required: true,
  })
  type: RewardType;

  @Prop({ type: Number, required: true })
  quantity: number;

  @Prop({ type: String, required: false })
  itemId?: string;

  @Prop({ type: String, required: false })
  description?: string;

  @Prop({
    type: Date,
    default: () =>
      new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' })),
  })
  createdAt: Date;

  @Prop({
    type: Date,
    default: () =>
      new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' })),
  })
  updatedAt: Date;
}

export const RewardSchema = SchemaFactory.createForClass(Reward);

// 저장 전 검증 미들웨어 추가
RewardSchema.pre('save', function (next) {
  const reward = this as Reward;

  // type이 'item'인 경우 itemId가 필수
  if (reward.type === RewardType.ITEM && !reward.itemId) {
    const error = new Error('아이템 타입의 보상은 itemId가 필수입니다');
    return next(error);
  }

  next();
});
