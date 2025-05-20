import { Injectable, Inject, Optional } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class ProxyService {
  private readonly authServiceUrl: string;
  private readonly eventServiceUrl: string;

  constructor(
    private readonly configService: ConfigService,
    @Optional() @Inject(REQUEST) private readonly request?: Request,
  ) {
    this.authServiceUrl =
      this.configService.get<string>('AUTH_SERVICE_URL') || 'http://auth:3000';
    this.eventServiceUrl =
      this.configService.get<string>('EVENT_SERVICE_URL') ||
      'http://event:3000';
  }

  // JWT 토큰 추출 메서드
  private getAuthorizationHeader(): Record<string, string> {
    if (this.request?.headers?.authorization) {
      // Bearer 접두사를 유지하여 전달
      return { Authorization: this.request.headers.authorization };
    }
    return {};
  }

  // Auth 서비스로 POST 요청 전달
  async sendToAuthService(endpoint: string, data: any): Promise<any> {
    try {
      const headers = this.getAuthorizationHeader();
      const response = await axios.post(
        `${this.authServiceUrl}/auth/${endpoint}`,
        data,
        { headers },
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        // 서버에서 응답이 왔지만 에러 상태 코드인 경우
        throw error.response.data;
      }
      throw error;
    }
  }

  // Auth 서비스로 GET 요청 전달
  async getFromAuthService(endpoint: string): Promise<any> {
    try {
      const headers = this.getAuthorizationHeader();
      const response = await axios.get(
        `${this.authServiceUrl}/auth/${endpoint}`,
        { headers },
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        // 서버에서 응답이 왔지만 에러 상태 코드인 경우
        throw error.response.data;
      }
      throw error;
    }
  }

  // Event 서비스로 POST 요청 전달
  async sendToEventService(endpoint: string, data: any): Promise<any> {
    try {
      const headers = this.getAuthorizationHeader();
      const response = await axios.post(
        `${this.eventServiceUrl}/${endpoint}`,
        data,
        { headers },
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        // 서버에서 응답이 왔지만 에러 상태 코드인 경우
        throw error.response.data;
      }
      throw error;
    }
  }

  // Event 서비스로 GET 요청 전달
  async getFromEventService(endpoint: string): Promise<any> {
    try {
      const headers = this.getAuthorizationHeader();
      const response = await axios.get(
        `${this.eventServiceUrl}/${endpoint}`,
        { headers },
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        // 서버에서 응답이 왔지만 에러 상태 코드인 경우
        throw error.response.data;
      }
      throw error;
    }
  }
}
