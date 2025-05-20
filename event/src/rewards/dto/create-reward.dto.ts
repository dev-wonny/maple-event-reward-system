import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';
import { RewardType } from '../../../../libs/common';

export class CreateRewardDto {
  @ApiProperty({
    description: '보상 타입',
    enum: RewardType,
    example: RewardType.ITEM,
  })
  @IsEnum(RewardType)
  type: RewardType;

  @ApiProperty({
    description: '보상 수량',
    example: 1,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({
    description: '아이템 ID (타입이 아이템인 경우에만 필수)',
    example: '60d21b4667d0d8992e610c85',
    required: false,
  })
  @ValidateIf((o) => o.type === RewardType.ITEM)
  @IsString()
  itemId?: string;

  @ApiProperty({
    description: '보상 설명',
    example: '레어 아이템 보상',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
