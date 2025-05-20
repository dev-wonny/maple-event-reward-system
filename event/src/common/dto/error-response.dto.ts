import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
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
