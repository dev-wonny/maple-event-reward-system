import { RewardType } from '../../../../libs/common/enums/reward-type.enum';

/**
 * Reward DTO 인터페이스
 * 보상 데이터 전송 시 사용되는 인터페이스
 */
export interface RewardDto {
  type: RewardType;
  quantity: number;
  itemId?: string;
  description?: string;
}
