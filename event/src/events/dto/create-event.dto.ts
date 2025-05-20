import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { TriggerType } from '../../../../libs/common/enums/trigger-type.enum';
import { RewardDeliveryType } from '../../../../libs/common/enums/reward-delivery-type.enum';
import { EventCategory } from '../../../../libs/common/enums/event-category.enum';

export class CreateEventDto {
  @ApiProperty({
    description: '이벤트 ID',
    example: 'event-001',
  })
  @IsString()
  @IsNotEmpty()
  eventId: string;

  @ApiProperty({
    description: '이벤트 제목',
    example: '7일 출석 이벤트',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: '이벤트 카테고리',
    enum: EventCategory,
    example: EventCategory.ATTENDANCE,
  })
  @IsEnum(EventCategory)
  @IsNotEmpty()
  category: EventCategory;

  @ApiProperty({
    description: '이벤트 조건 ID 목록',
    example: ['60d21b4667d0d8992e610c85', '60d21b4667d0d8992e610c86'],
    type: [String],
  })
  @IsArray()
  @IsMongoId({ each: true })
  @IsNotEmpty()
  conditionIds: string[];

  @ApiProperty({
    description: '이벤트 보상 ID 목록',
    example: ['60d21b4667d0d8992e610c87', '60d21b4667d0d8992e610c88'],
    type: [String],
  })
  @IsArray()
  @IsMongoId({ each: true })
  @IsNotEmpty()
  rewardIds: string[];

  @ApiProperty({
    description: '이벤트 트리거 유형',
    enum: TriggerType,
    default: TriggerType.MANUAL,
  })
  @IsEnum(TriggerType)
  @IsOptional()
  trigger?: TriggerType;

  @ApiProperty({
    description: '보상 전달 유형',
    enum: RewardDeliveryType,
    default: RewardDeliveryType.MANUAL_CLAIM,
  })
  @IsEnum(RewardDeliveryType)
  @IsOptional()
  deliveryType?: RewardDeliveryType;

  @ApiProperty({
    description: '이벤트 시작 시간',
    example: '2025-01-01T00:00:00Z',
  })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  startAt: Date;

  @ApiProperty({
    description: '이벤트 종료 시간',
    example: '2025-01-31T23:59:59Z',
  })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  endAt: Date;

  @ApiProperty({
    description: '이벤트 활성화 여부',
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
