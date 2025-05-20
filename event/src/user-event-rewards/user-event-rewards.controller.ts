import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserEventRewardsService } from './user-event-rewards.service';
import { CreateUserEventRewardRequestDto } from './dto/create-user-event-reward-request.dto';
import { UserEventRewardRequestResponseDto } from './dto/user-event-reward-request-response.dto';
import { UpdateUserEventRewardStatusDto } from './dto/update-user-event-reward-status.dto';
import { RewardStatus } from '../common/enums/reward-status.enum';

@ApiTags('user-event-rewards')
@Controller('user-event-rewards')
export class UserEventRewardsController {
  constructor(
    private readonly userEventRewardsService: UserEventRewardsService,
  ) {}

  @Post()
  @ApiOperation({ summary: '보상 요청 생성' })
  async create(
    @Body() createUserEventRewardRequestDto: CreateUserEventRewardRequestDto,
  ): Promise<UserEventRewardRequestResponseDto> {
    return this.userEventRewardsService.create(createUserEventRewardRequestDto);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: '사용자별 보상 요청 목록 조회' })
  @ApiParam({
    name: 'userId',
    description: '사용자 ID',
    example: 'user-123',
  })
  async findAllByUserId(
    @Param('userId') userId: string,
  ): Promise<UserEventRewardRequestResponseDto[]> {
    return this.userEventRewardsService.findAllByUserId(userId);
  }

  @Get('user/:userId/event/:eventId')
  @ApiOperation({ summary: '사용자의 특정 이벤트 보상 요청 조회' })
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
  async findAllByUserIdAndEventId(
    @Param('userId') userId: string,
    @Param('eventId') eventId: string,
  ): Promise<UserEventRewardRequestResponseDto[]> {
    return this.userEventRewardsService.findAllByUserIdAndEventId(
      userId,
      eventId,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: '보상 요청 상세 조회' })
  @ApiParam({
    name: 'id',
    description: '보상 요청 ID',
    example: '60d21b4667d0d8992e610c85',
  })
  async findById(
    @Param('id') id: string,
  ): Promise<UserEventRewardRequestResponseDto> {
    return this.userEventRewardsService.findById(id);
  }

  @Get()
  @ApiOperation({ summary: '모든 보상 요청 조회 (관리자용)' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: RewardStatus,
    description: '보상 상태로 필터링 (PENDING, SUCCESS, FAILED)',
  })
  @ApiQuery({
    name: 'eventId',
    required: false,
    description: '이벤트 ID로 필터링',
  })
  async findAll(
    @Query('status') status?: RewardStatus,
    @Query('eventId') eventId?: string,
  ): Promise<UserEventRewardRequestResponseDto[]> {
    if (eventId && status) {
      return this.userEventRewardsService.findAllByEventIdAndStatus(eventId, status);
    } else if (eventId) {
      return this.userEventRewardsService.findAllByEventId(eventId);
    } else if (status) {
      return this.userEventRewardsService.findAllByStatus(status);
    } else {
      return this.userEventRewardsService.findAll();
    }
  }

  @Patch(':id/status')
  @ApiOperation({ summary: '보상 요청 상태 업데이트' })
  @ApiParam({
    name: 'id',
    description: '보상 요청 ID',
    example: '60d21b4667d0d8992e610c85',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '보상 요청 상태가 성공적으로 업데이트되었습니다.',
    type: UserEventRewardRequestResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '보상 요청을 찾을 수 없습니다.',
  })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateUserEventRewardStatusDto,
  ): Promise<UserEventRewardRequestResponseDto> {
    return this.userEventRewardsService.updateStatus(id, updateStatusDto);
  }
}
