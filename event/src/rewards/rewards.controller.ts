import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseFilters,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RewardsService } from './rewards.service';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';
import { RewardResponseDto } from './dto/reward-response.dto';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { ErrorResponseSwaggerDto } from '../common/dto/error-response-swagger.dto';

@ApiTags('rewards')
@Controller('rewards')
@UseFilters(HttpExceptionFilter)
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Post()
  @ApiOperation({ summary: '보상 생성' })
  @ApiResponse({
    status: 201,
    description: '보상이 성공적으로 생성됨',
    type: RewardResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청',
    type: ErrorResponseSwaggerDto,
  })
  async create(
    @Body() createRewardDto: CreateRewardDto,
  ): Promise<RewardResponseDto> {
    return this.rewardsService.createReward(createRewardDto);
  }

  @Get()
  @ApiOperation({ summary: '모든 보상 조회' })
  @ApiResponse({
    status: 200,
    description: '모든 보상 목록',
    type: [RewardResponseDto],
  })
  async findAll(): Promise<RewardResponseDto[]> {
    return this.rewardsService.findAllRewards();
  }

  @Get(':id')
  @ApiOperation({ summary: '특정 보상 조회' })
  @ApiParam({ name: 'id', description: '보상 ID' })
  @ApiResponse({
    status: 200,
    description: '보상 정보',
    type: RewardResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '보상을 찾을 수 없음',
    type: ErrorResponseSwaggerDto,
  })
  async findOne(@Param('id') id: string): Promise<RewardResponseDto> {
    return this.rewardsService.findOneReward(id);
  }

  @Put(':id')
  @ApiOperation({ summary: '보상 업데이트' })
  @ApiParam({ name: 'id', description: '보상 ID' })
  @ApiResponse({
    status: 200,
    description: '업데이트된 보상 정보',
    type: RewardResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '보상을 찾을 수 없음',
    type: ErrorResponseSwaggerDto,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청',
    type: ErrorResponseSwaggerDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateRewardDto: UpdateRewardDto,
  ): Promise<RewardResponseDto> {
    return this.rewardsService.updateReward(id, updateRewardDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '보상 삭제' })
  @ApiParam({ name: 'id', description: '보상 ID' })
  @ApiResponse({
    status: 200,
    description: '삭제된 보상 정보',
    type: RewardResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '보상을 찾을 수 없음',
    type: ErrorResponseSwaggerDto,
  })
  async remove(@Param('id') id: string): Promise<RewardResponseDto> {
    return this.rewardsService.removeReward(id);
  }
}
