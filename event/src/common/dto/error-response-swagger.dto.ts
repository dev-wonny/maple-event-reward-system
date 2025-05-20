import { ApiProperty } from '@nestjs/swagger';
import { ErrorResponseDto } from '../../../../libs/common';

/**
 * Swagger 문서화를 위한 ErrorResponseDto 래퍼
 * 실제 ErrorResponseDto는 libs/common에 있지만 Swagger 데코레이터가 필요하여 추가
 */
export class ErrorResponseSwaggerDto implements ErrorResponseDto {
  @ApiProperty({
    description: '에러 코드',
    example: 'CONDITION_NOT_FOUND',
  })
  code: string;

  @ApiProperty({
    description: '에러 메시지',
    example: '조건을 찾을 수 없습니다',
  })
  message: string;

  @ApiProperty({
    description: '에러 발생 시간',
    example: '2025-05-20T00:09:55.000Z',
  })
  timestamp: string;
}
