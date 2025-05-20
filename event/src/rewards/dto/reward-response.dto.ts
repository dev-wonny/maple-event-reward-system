import { ApiProperty } from '@nestjs/swagger';
import { RewardType } from '../../../../libs/common';

export class RewardResponseDto {
  @ApiProperty({
    description: '보상 ID',
    example: '60d21b4667d0d8992e610c85',
  })
  id: string;

  @ApiProperty({
    description: '보상 타입',
    enum: RewardType,
    example: RewardType.ITEM,
  })
  type: RewardType;

  @ApiProperty({
    description: '보상 수량',
    example: 1,
  })
  quantity: number;

  @ApiProperty({
    description: '아이템 ID (타입이 아이템인 경우에만 존재)',
    example: '60d21b4667d0d8992e610c85',
    required: false,
  })
  itemId?: string;

  @ApiProperty({
    description: '보상 설명',
    example: '레어 아이템 보상',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: '생성 일시',
    example: '2025-05-20T00:37:58.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: '수정 일시',
    example: '2025-05-20T00:37:58.000Z',
  })
  updatedAt: Date;

  constructor(partial: Partial<RewardResponseDto>) {
    Object.assign(this, partial);
  }
}
