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
import { ConditionsService } from './conditions.service';
import { CreateConditionDto } from './dto/create-condition.dto';
import { UpdateConditionDto } from './dto/update-condition.dto';
import { ConditionResponseDto } from './dto/condition-response.dto';
import { ConditionsResponseDto } from './dto/conditions-response.dto';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { ErrorResponseSwaggerDto } from '../common/dto/error-response-swagger.dto';

@ApiTags('conditions')
@Controller('conditions')
@UseFilters(HttpExceptionFilter)
export class ConditionsController {
  constructor(private readonly conditionsService: ConditionsService) {}

  @Post()
  @ApiOperation({ summary: '조건 생성' })
  @ApiResponse({
    status: 201,
    description: '조건이 성공적으로 생성됨',
    type: ConditionResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청',
    type: ErrorResponseSwaggerDto,
  })
  async create(
    @Body() createConditionDto: CreateConditionDto,
  ): Promise<ConditionResponseDto> {
    return this.conditionsService.create(createConditionDto);
  }

  @Get()
  @ApiOperation({ summary: '모든 조건 조회' })
  @ApiResponse({
    status: 200,
    description: '모든 조건 목록',
    type: ConditionsResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: '서버 오류',
    type: ErrorResponseSwaggerDto,
  })
  async findAll(): Promise<ConditionsResponseDto> {
    const conditions = await this.conditionsService.findAll();
    return new ConditionsResponseDto(conditions, conditions.length);
  }

  @Get(':id')
  @ApiOperation({ summary: '특정 조건 조회' })
  @ApiParam({ name: 'id', description: '조건 ID' })
  @ApiResponse({
    status: 200,
    description: '조건 정보',
    type: ConditionResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '조건을 찾을 수 없음',
    type: ErrorResponseSwaggerDto,
  })
  async findOne(@Param('id') id: string): Promise<ConditionResponseDto> {
    return this.conditionsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: '조건 업데이트' })
  @ApiParam({ name: 'id', description: '조건 ID' })
  @ApiResponse({
    status: 200,
    description: '업데이트된 조건 정보',
    type: ConditionResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '조건을 찾을 수 없음',
    type: ErrorResponseSwaggerDto,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청',
    type: ErrorResponseSwaggerDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateConditionDto: UpdateConditionDto,
  ): Promise<ConditionResponseDto> {
    return this.conditionsService.update(id, updateConditionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '조건 삭제' })
  @ApiParam({ name: 'id', description: '조건 ID' })
  @ApiResponse({
    status: 200,
    description: '삭제된 조건 정보',
    type: ConditionResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '조건을 찾을 수 없음',
    type: ErrorResponseSwaggerDto,
  })
  async remove(@Param('id') id: string): Promise<ConditionResponseDto> {
    return this.conditionsService.remove(id);
  }
}
