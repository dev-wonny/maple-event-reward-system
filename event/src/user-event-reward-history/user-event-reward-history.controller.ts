import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserEventRewardHistoryService } from './user-event-reward-history.service';
import { CreateUserEventRewardHistoryDto } from './dto/create-user-event-reward-history.dto';
import { UserEventRewardHistoryResponseDto } from './dto/user-event-reward-history-response.dto';

@ApiTags('user-event-reward-history')
@Controller('user-event-reward-history')
export class UserEventRewardHistoryController {
  constructor(
    private readonly userEventRewardHistoryService: UserEventRewardHistoryService,
  ) {}

  @Post()
  @ApiOperation({ summary: '보상 지급 기록 생성' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '보상 지급 기록이 성공적으로 생성되었습니다.',
    type: UserEventRewardHistoryResponseDto,
  })
  async create(
    @Body() createUserEventRewardHistoryDto: CreateUserEventRewardHistoryDto,
  ): Promise<UserEventRewardHistoryResponseDto> {
    return this.userEventRewardHistoryService.create(
      createUserEventRewardHistoryDto,
    );
  }

  @Get()
  @ApiOperation({ summary: '모든 보상 지급 기록 조회' })
  @ApiQuery({
    name: 'eventId',
    required: false,
    description: '이벤트 ID로 필터링',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description:
      'deliveredAt 시작 날짜로 필터링 (ISO 형식: YYYY-MM-DDTHH:mm:ssZ)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description:
      'deliveredAt 종료 날짜로 필터링 (ISO 형식: YYYY-MM-DDTHH:mm:ssZ)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '모든 보상 지급 기록 목록',
    type: [UserEventRewardHistoryResponseDto],
  })
  async findAll(
    @Query('eventId') eventId?: string,
    @Query('startDate') startDateStr?: string,
    @Query('endDate') endDateStr?: string,
  ): Promise<UserEventRewardHistoryResponseDto[]> {
    // 날짜 범위 필터링
    if (startDateStr && endDateStr) {
      const startDate = new Date(startDateStr);
      const endDate = new Date(endDateStr);
      return this.userEventRewardHistoryService.findAllByDateRange(
        startDate,
        endDate,
      );
    }

    // 이벤트 ID 필터링
    if (eventId) {
      return this.userEventRewardHistoryService.findAllByEventId(eventId);
    }

    // 필터링 없이 모든 기록 조회
    return this.userEventRewardHistoryService.findAll();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: '사용자별 보상 지급 기록 조회' })
  @ApiParam({
    name: 'userId',
    description: '사용자 ID',
    example: 'user-123',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '사용자의 모든 보상 지급 기록을 반환합니다.',
    type: [UserEventRewardHistoryResponseDto],
  })
  async findAllByUserId(
    @Param('userId') userId: string,
  ): Promise<UserEventRewardHistoryResponseDto[]> {
    return this.userEventRewardHistoryService.findAllByUserId(userId);
  }

  @Get('user/:userId/event/:eventId')
  @ApiOperation({ summary: '특정 이벤트에 대한 사용자의 보상 지급 기록 조회' })
  @ApiParam({
    name: 'userId',
    description: '사용자 ID',
    example: 'user-123',
  })
  @ApiParam({
    name: 'eventId',
    description: '이벤트 ID',
    example: 'event-001',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '특정 이벤트에 대한 사용자의 보상 지급 기록을 반환합니다.',
    type: [UserEventRewardHistoryResponseDto],
  })
  async findAllByUserIdAndEventId(
    @Param('userId') userId: string,
    @Param('eventId') eventId: string,
  ): Promise<UserEventRewardHistoryResponseDto[]> {
    return this.userEventRewardHistoryService.findAllByUserIdAndEventId(
      userId,
      eventId,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: '특정 보상 지급 기록 조회' })
  @ApiParam({
    name: 'id',
    description: '보상 지급 기록 ID',
    example: '60d21b4667d0d8992e610c85',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '특정 보상 지급 기록 정보를 반환합니다.',
    type: UserEventRewardHistoryResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '보상 지급 기록을 찾을 수 없습니다.',
  })
  async findById(
    @Param('id') id: string,
  ): Promise<UserEventRewardHistoryResponseDto> {
    return this.userEventRewardHistoryService.findById(id);
  }
}
