import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';
import { TriggerType } from '../../../../libs/common/enums/trigger-type.enum';
import { RewardDeliveryType } from '../../../../libs/common/enums/reward-delivery-type.enum';
import { EventCategory } from '../../../../libs/common/enums/event-category.enum';

export class UpdateEventDto {
  @ApiProperty({
    description: '이벤트 제목',
    example: '7일 출석 이벤트',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: '이벤트 카테고리',
    enum: EventCategory,
    example: EventCategory.ATTENDANCE,
    required: false,
  })
  @IsEnum(EventCategory)
  @IsOptional()
  category?: EventCategory;

  @ApiProperty({
    description: '이벤트 조건 ID 목록',
    example: ['60d21b4667d0d8992e610c85', '60d21b4667d0d8992e610c86'],
    type: [String],
    required: false,
  })
  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  conditionIds?: string[];

  @ApiProperty({
    description: '이벤트 보상 ID 목록',
    example: ['60d21b4667d0d8992e610c87', '60d21b4667d0d8992e610c88'],
    type: [String],
    required: false,
  })
  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  rewardIds?: string[];

  @ApiProperty({
    description: '이벤트 트리거 유형',
    enum: TriggerType,
    default: TriggerType.MANUAL,
    required: false,
  })
  @IsEnum(TriggerType)
  @IsOptional()
  trigger?: TriggerType;

  @ApiProperty({
    description: '보상 전달 유형',
    enum: RewardDeliveryType,
    default: RewardDeliveryType.MANUAL_CLAIM,
    required: false,
  })
  @IsEnum(RewardDeliveryType)
  @IsOptional()
  deliveryType?: RewardDeliveryType;

  @ApiProperty({
    description: '이벤트 시작 시간',
    example: '2025-01-01T00:00:00Z',
    required: false,
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  startAt?: Date;

  @ApiProperty({
    description: '이벤트 종료 시간',
    example: '2025-01-31T23:59:59Z',
    required: false,
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endAt?: Date;

  @ApiProperty({
    description: '이벤트 활성화 여부',
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
