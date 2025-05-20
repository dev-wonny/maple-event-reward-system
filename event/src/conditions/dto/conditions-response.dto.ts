import { ApiProperty } from '@nestjs/swagger';
import { ConditionResponseDto } from './condition-response.dto';

export class ConditionsResponseDto {
  @ApiProperty({
    description: '조건 목록',
    type: [ConditionResponseDto],
  })
  conditions: ConditionResponseDto[];

  @ApiProperty({
    description: '총 조건 수',
    example: 10,
  })
  total: number;

  constructor(conditions: ConditionResponseDto[], total: number) {
    this.conditions = conditions;
    this.total = total;
  }
}
