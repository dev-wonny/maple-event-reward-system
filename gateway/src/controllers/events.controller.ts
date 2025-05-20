import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards, Request } from '@nestjs/common';
import { ProxyService } from '../proxy/proxy.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateEventDto, UpdateEventDto } from '../dto/event.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly proxyService: ProxyService) {}

  /**
   * 새 이벤트 생성
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createEventDto: CreateEventDto, @Request() req) {
    return this.proxyService.sendToEventService('create', { 
      ...createEventDto, 
      user: req.user 
    });
  }

  /**
   * 모든 이벤트 조회
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req) {
    return this.proxyService.sendToEventService('findAll', { user: req.user });
  }

  /**
   * 특정 이벤트 조회
   */
  @UseGuards(JwtAuthGuard)
  @Get(':eventId')
  findOne(@Param('eventId') eventId: string, @Request() req) {
    return this.proxyService.sendToEventService('findOne', { 
      id: eventId, 
      user: req.user 
    });
  }

  /**
   * 이벤트 전체 업데이트
   */
  @UseGuards(JwtAuthGuard)
  @Put(':eventId')
  update(@Param('eventId') eventId: string, @Body() createEventDto: CreateEventDto, @Request() req) {
    return this.proxyService.sendToEventService('update', {
      id: eventId,
      ...createEventDto,
      user: req.user
    });
  }

  /**
   * 이벤트 부분 업데이트
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':eventId')
  partialUpdate(@Param('eventId') eventId: string, @Body() updateEventDto: UpdateEventDto, @Request() req) {
    return this.proxyService.sendToEventService('partialUpdate', {
      id: eventId,
      ...updateEventDto,
      user: req.user
    });
  }

  /**
   * 이벤트 삭제
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':eventId')
  remove(@Param('eventId') eventId: string, @Request() req) {
    return this.proxyService.sendToEventService('remove', {
      id: eventId,
      user: req.user
    });
  }

  /**
   * 이벤트 활성화
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':eventId/activate')
  activate(@Param('eventId') eventId: string, @Request() req) {
    return this.proxyService.sendToEventService('activate', {
      id: eventId,
      user: req.user
    });
  }

  /**
   * 이벤트 비활성화
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':eventId/deactivate')
  deactivate(@Param('eventId') eventId: string, @Request() req) {
    return this.proxyService.sendToEventService('deactivate', {
      id: eventId,
      user: req.user
    });
  }
}
