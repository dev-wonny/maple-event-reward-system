import { Document } from 'mongoose';
import { RewardDeliveryType, RewardType } from '../../../../libs/common';

export interface IReward extends Document {
  /**
   * 보상 타입 (아이템, 메소, 포인트)
   */
  type: RewardType;

  /**
   * 보상 수량
   */
  quantity: number;

  /**
   * 보상 지급 방식 (즉시, 수동 수령, 예약)
   */
  rewardDeliveryType: RewardDeliveryType;

  /**
   * 아이템 ID (타입이 아이템인 경우에만 필수)
   */
  itemId?: string;

  /**
   * 생성 일시 (KST)
   */
  createdAt: Date;

  /**
   * 수정 일시 (KST)
   */
  updatedAt: Date;
}
