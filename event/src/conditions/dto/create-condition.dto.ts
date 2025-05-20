import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EventCategory } from '../../../../libs/common/enums/event-category.enum';
import { ConditionSubType } from '../../../../libs/common/enums/condition-subtype.enum';

export class CreateConditionDto {
  @ApiProperty({
    description: '조건 카테고리',
    enum: EventCategory,
    example: EventCategory.ATTENDANCE,
  })
  @IsNotEmpty()
  @IsEnum(EventCategory)
  category: string;

  @ApiProperty({
    description: '조건 하위 타입',
    enum: ConditionSubType,
    example: ConditionSubType.TOTAL_DAYS,
  })
  @IsNotEmpty()
  @IsEnum(ConditionSubType)
  subType: string;

  @ApiProperty({
    description: '조건 기준값 (예: 3일, 아이템 ID 등)',
    example: '3',
    required: false,
  })
  @IsOptional()
  @IsString()
  target?: string;

  @ApiProperty({
    description: '조건 설명',
    example: '3일 연속 출석 시 보상 지급',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
