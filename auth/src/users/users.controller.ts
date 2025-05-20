import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: '사용자 생성',
    description: '새로운 사용자를 생성합니다',
  })
  @ApiResponse({ status: 201, description: '사용자 생성 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({
    summary: '모든 사용자 조회',
    description: '모든 사용자 목록을 조회합니다',
  })
  @ApiResponse({ status: 200, description: '사용자 목록 조회 성공' })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({
    summary: '특정 사용자 조회',
    description: 'ID로 특정 사용자를 조회합니다',
  })
  @ApiParam({ name: 'id', description: '사용자 ID' })
  @ApiResponse({ status: 200, description: '사용자 조회 성공' })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없음' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @ApiOperation({
    summary: '사용자 정보 수정',
    description: '특정 사용자의 정보를 수정합니다',
  })
  @ApiParam({ name: 'id', description: '사용자 ID' })
  @ApiResponse({ status: 200, description: '사용자 정보 수정 성공' })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없음' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiOperation({
    summary: '사용자 삭제',
    description: '특정 사용자를 삭제합니다',
  })
  @ApiParam({ name: 'id', description: '사용자 ID' })
  @ApiResponse({ status: 200, description: '사용자 삭제 성공' })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없음' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
