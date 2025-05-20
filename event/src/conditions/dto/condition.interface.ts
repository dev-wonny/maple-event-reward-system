import { EventCategory } from '../../../../libs/common/enums/event-category.enum';
import { ConditionSubType } from '../../../../libs/common/enums/condition-subtype.enum';

/**
 * Condition DTO 인터페이스
 * 조건 데이터 전송 시 사용되는 인터페이스
 */
export interface ConditionDto {
  category: EventCategory;
  subType: ConditionSubType;
  target?: string;
  description?: string;
}
