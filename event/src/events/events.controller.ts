import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { EventResponseDto } from './dto/event-response.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiOperation({ summary: '새 이벤트 생성' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '이벤트가 성공적으로 생성되었습니다.',
    type: EventResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: '이미 존재하는 이벤트 ID입니다.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '유효하지 않은 조건 ID 또는 보상 ID입니다.',
  })
  async create(
    @Body() createEventDto: CreateEventDto,
  ): Promise<EventResponseDto> {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  @ApiOperation({ summary: '모든 이벤트 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '모든 이벤트 목록을 반환합니다.',
    type: [EventResponseDto],
  })
  async findAll(): Promise<EventResponseDto[]> {
    return this.eventsService.findAll();
  }

  @Get(':eventId')
  @ApiOperation({ summary: '특정 이벤트 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '특정 이벤트 정보를 반환합니다.',
    type: EventResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '이벤트를 찾을 수 없습니다.',
  })
  async findOne(@Param('eventId') eventId: string): Promise<EventResponseDto> {
    return this.eventsService.findOne(eventId);
  }

  @Put(':eventId')
  @ApiOperation({ summary: '이벤트 전체 업데이트' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '이벤트가 성공적으로 업데이트되었습니다.',
    type: EventResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '이벤트를 찾을 수 없습니다.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '유효하지 않은 조건 ID 또는 보상 ID입니다.',
  })
  async update(
    @Param('eventId') eventId: string,
    @Body() updateEventDto: CreateEventDto,
  ): Promise<EventResponseDto> {
    return this.eventsService.update(eventId, updateEventDto);
  }

  @Patch(':eventId')
  @ApiOperation({ summary: '이벤트 부분 업데이트' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '이벤트가 성공적으로 부분 업데이트되었습니다.',
    type: EventResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '이벤트를 찾을 수 없습니다.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '유효하지 않은 조건 ID 또는 보상 ID입니다.',
  })
  async partialUpdate(
    @Param('eventId') eventId: string,
    @Body() updateEventDto: UpdateEventDto,
  ): Promise<EventResponseDto> {
    return this.eventsService.partialUpdate(eventId, updateEventDto);
  }

  @Delete(':eventId')
  @ApiOperation({ summary: '이벤트 삭제' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '이벤트가 성공적으로 삭제되었습니다.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '이벤트를 찾을 수 없습니다.',
  })
  async remove(@Param('eventId') eventId: string): Promise<void> {
    return this.eventsService.remove(eventId);
  }

  @Patch(':eventId/activate')
  @ApiOperation({ summary: '이벤트 활성화' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '이벤트가 성공적으로 활성화되었습니다.',
    type: EventResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '이벤트를 찾을 수 없습니다.',
  })
  async activate(@Param('eventId') eventId: string): Promise<EventResponseDto> {
    return this.eventsService.updateStatus(eventId, true);
  }

  @Patch(':eventId/deactivate')
  @ApiOperation({ summary: '이벤트 비활성화' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '이벤트가 성공적으로 비활성화되었습니다.',
    type: EventResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '이벤트를 찾을 수 없습니다.',
  })
  async deactivate(
    @Param('eventId') eventId: string,
  ): Promise<EventResponseDto> {
    return this.eventsService.updateStatus(eventId, false);
  }
}
