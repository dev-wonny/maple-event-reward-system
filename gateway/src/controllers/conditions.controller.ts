import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { ProxyService } from '../proxy/proxy.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('conditions')
export class ConditionsController {
  constructor(private readonly proxyService: ProxyService) {}

  /**
   * 조건 생성
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createConditionDto: any, @Request() req) {
    return this.proxyService.sendToEventService('conditions/create', {
      ...createConditionDto,
      user: req.user
    });
  }

  /**
   * 모든 조건 목록 조회
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req) {
    return this.proxyService.sendToEventService('conditions/findAll', {
      user: req.user
    });
  }
}
