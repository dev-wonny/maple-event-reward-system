/**
 * 에러 응답을 위한 DTO
 * 모든 마이크로서비스에서 공통으로 사용
 */
export class ErrorResponseDto {
    /**
     * 에러 코드
     * @example CONDITION_NOT_FOUND
     */
    code: string;

    /**
     * 에러 메시지
     * @example 조건을 찾을 수 없습니다
     */
    message: string;

    /**
     * 에러 발생 시간
     * @example 2025-05-20T00:09:55.000Z
     */
    timestamp: string;
}
