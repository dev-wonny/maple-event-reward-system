import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponseDto } from '../../../../libs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const errorResponse = exception.getResponse() as any;

    let errorCode = 'SERVER_ERROR';
    let errorMessage = '서버 오류가 발생했습니다';

    if (status === HttpStatus.NOT_FOUND) {
      errorCode = 'RESOURCE_NOT_FOUND';
      if (request.url.includes('/conditions/')) {
        errorCode = 'CONDITION_NOT_FOUND';
        errorMessage = '조건을 찾을 수 없습니다';
      }
    } else if (status === HttpStatus.BAD_REQUEST) {
      errorCode = 'INVALID_REQUEST';
      errorMessage = '잘못된 요청입니다';
    } else if (status === HttpStatus.UNAUTHORIZED) {
      errorCode = 'UNAUTHORIZED';
      errorMessage = '인증이 필요합니다';
    } else if (status === HttpStatus.FORBIDDEN) {
      errorCode = 'FORBIDDEN';
      errorMessage = '접근 권한이 없습니다';
    }

    // If the exception response contains a message, use it
    if (errorResponse && errorResponse.message) {
      if (typeof errorResponse.message === 'string') {
        errorMessage = errorResponse.message;
      } else if (Array.isArray(errorResponse.message)) {
        errorMessage = errorResponse.message[0];
      }
    }

    const errorResponseDto: ErrorResponseDto = {
      code: errorCode,
      message: errorMessage,
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(errorResponseDto);
  }
}
