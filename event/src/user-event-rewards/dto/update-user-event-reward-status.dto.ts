import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RewardStatus } from '../../../../libs/common/enums/reward-status.enum';

export class UpdateUserEventRewardStatusDto {
  @ApiProperty({
    description: '보상 상태',
    enum: RewardStatus,
    example: RewardStatus.SUCCESS,
  })
  @IsNotEmpty()
  @IsEnum(RewardStatus)
  status: RewardStatus;

  @ApiProperty({
    description: '상태 변경 이유 (선택 사항)',
    example: '보상 지급 완료',
    required: false,
  })
  @IsOptional()
  @IsString()
  reason?: string;
}
