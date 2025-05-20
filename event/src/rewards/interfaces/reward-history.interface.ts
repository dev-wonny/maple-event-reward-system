import { Document } from 'mongoose';
import { RewardDeliveryType, RewardStatus } from '../../../../libs/common';
import { IReward } from './reward.interface';

export interface IRewardHistory extends Document {
  /**
   * 사용자 ID
   */
  userId: string;

  /**
   * 이벤트 ID
   */
  eventId: string;

  /**
   * 보상 목록
   */
  reward: IReward[];

  /**
   * 수령 일시
   */
  claimedAt: Date;

  /**
   * 지급 방식
   */
  deliveryType: RewardDeliveryType;

  /**
   * 보상 상태 (대기중, 성공, 실패)
   */
  status: RewardStatus;

  /**
   * 실패 이유 (실패 시에만 사용)
   */
  reason?: string;

  /**
   * 생성 일시 (KST)
   */
  createdAt: Date;

  /**
   * 수정 일시 (KST)
   */
  updatedAt: Date;
}
