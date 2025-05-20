import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, Request } from '@nestjs/common';
import { ProxyService } from '../proxy/proxy.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateUserDto, UpdateUserDto } from '../dto/auth.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly proxyService: ProxyService) {}

  /**
   * 새로운 사용자를 생성합니다
   */
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.proxyService.sendToAuthService('create', createUserDto);
  }

  /**
   * 모든 사용자 목록을 조회합니다
   */
  @Get()
  findAll() {
    return this.proxyService.sendToAuthService('findAll', {});
  }

  /**
   * ID로 특정 사용자를 조회합니다
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.proxyService.sendToAuthService('findOne', { id });
  }

  /**
   * 특정 사용자의 정보를 수정합니다
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.proxyService.sendToAuthService('update', { id, ...updateUserDto });
  }

  /**
   * 특정 사용자를 삭제합니다
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.proxyService.sendToAuthService('remove', { id });
  }
}
