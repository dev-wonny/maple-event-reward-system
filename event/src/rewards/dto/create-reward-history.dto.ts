import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { RewardDeliveryType, RewardStatus } from '../../../../libs/common';
import { CreateRewardDto } from './create-reward.dto';

export class CreateRewardHistoryDto {
  @ApiProperty({
    description: '사용자 ID',
    example: 'user123',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: '이벤트 ID',
    example: '60d21b4667d0d8992e610c85',
  })
  @IsMongoId()
  eventId: string;

  @ApiProperty({
    description: '보상 목록',
    type: [CreateRewardDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRewardDto)
  reward: CreateRewardDto[];

  @ApiProperty({
    description: '수령 일시',
    example: new Date().toISOString(),
  })
  @IsDate()
  @Type(() => Date)
  claimedAt: Date;

  @ApiProperty({
    description: '지급 방식',
    enum: RewardDeliveryType,
    example: RewardDeliveryType.MANUAL_CLAIM,
  })
  @IsEnum(RewardDeliveryType)
  deliveryType: RewardDeliveryType;

  @ApiProperty({
    description: '보상 상태',
    enum: RewardStatus,
    example: RewardStatus.PENDING,
    default: RewardStatus.PENDING,
  })
  @IsEnum(RewardStatus)
  status: RewardStatus = RewardStatus.PENDING;

  @ApiProperty({
    description: '실패 이유 (실패 시에만 사용)',
    example: '이미 수령한 보상입니다',
    required: false,
  })
  @IsOptional()
  @IsString()
  reason?: string;
}
