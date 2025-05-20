import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { ProxyService } from '../proxy/proxy.service';
import { CreateUserDto, UpdateUserDto, UserRole } from '../dto/auth.dto';
import { of } from 'rxjs';

// 모의 객체 생성
const mockProxyService = {
  sendToAuthService: jest.fn(),
};

describe('UsersController', () => {
  let controller: UsersController;
  let proxyService: ProxyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: ProxyService,
          useValue: mockProxyService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    proxyService = module.get<ProxyService>(ProxyService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('컨트롤러가 정의되어 있어야 함', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('사용자 생성 요청을 Auth 서비스로 전달해야 함', (done) => {
      // 준비
      const createUserDto: CreateUserDto = {
        userId: 'newuser',
        email: 'test@example.com',
        nickName: '테스트유저',
        password: 'password123',
        role: UserRole.USER,
      };
      const expectedResponse = { 
        userId: 'newuser', 
        email: 'test@example.com',
        nickName: '테스트유저',
        role: UserRole.USER
      };
      
      mockProxyService.sendToAuthService.mockReturnValue(of(expectedResponse));

      // 실행 및 검증
      controller.create(createUserDto).subscribe(result => {
        expect(proxyService.sendToAuthService).toHaveBeenCalledWith('create', createUserDto);
        expect(result).toEqual(expectedResponse);
        done();
      });
    });
  });

  describe('findAll', () => {
    it('모든 사용자 목록 조회 요청을 Auth 서비스로 전달해야 함', (done) => {
      // 준비
      const expectedResponse = [
        { userId: 'user1', email: 'user1@example.com' },
        { userId: 'user2', email: 'user2@example.com' }
      ];
      
      mockProxyService.sendToAuthService.mockReturnValue(of(expectedResponse));

      // 실행 및 검증
      controller.findAll().subscribe(result => {
        expect(proxyService.sendToAuthService).toHaveBeenCalledWith('findAll', {});
        expect(result).toEqual(expectedResponse);
        done();
      });
    });
  });

  describe('findOne', () => {
    it('특정 사용자 조회 요청을 Auth 서비스로 전달해야 함', (done) => {
      // 준비
      const userId = 'user1';
      const expectedResponse = { 
        userId: 'user1', 
        email: 'user1@example.com',
        nickName: '사용자1',
        role: UserRole.USER
      };
      
      mockProxyService.sendToAuthService.mockReturnValue(of(expectedResponse));

      // 실행 및 검증
      controller.findOne(userId).subscribe(result => {
        expect(proxyService.sendToAuthService).toHaveBeenCalledWith('findOne', { id: userId });
        expect(result).toEqual(expectedResponse);
        done();
      });
    });
  });

  describe('update', () => {
    it('사용자 정보 수정 요청을 Auth 서비스로 전달해야 함', (done) => {
      // 준비
      const userId = 'user1';
      const updateUserDto: UpdateUserDto = {
        nickName: '수정된 닉네임',
        email: 'updated@example.com'
      };
      const expectedResponse = { 
        userId: 'user1', 
        nickName: '수정된 닉네임',
        email: 'updated@example.com'
      };
      
      mockProxyService.sendToAuthService.mockReturnValue(of(expectedResponse));

      // 실행 및 검증
      controller.update(userId, updateUserDto).subscribe(result => {
        expect(proxyService.sendToAuthService).toHaveBeenCalledWith('update', { 
          id: userId, 
          ...updateUserDto 
        });
        expect(result).toEqual(expectedResponse);
        done();
      });
    });
  });

  describe('remove', () => {
    it('사용자 삭제 요청을 Auth 서비스로 전달해야 함', (done) => {
      // 준비
      const userId = 'user1';
      const expectedResponse = { success: true, userId: 'user1' };
      
      mockProxyService.sendToAuthService.mockReturnValue(of(expectedResponse));

      // 실행 및 검증
      controller.remove(userId).subscribe(result => {
        expect(proxyService.sendToAuthService).toHaveBeenCalledWith('remove', { id: userId });
        expect(result).toEqual(expectedResponse);
        done();
      });
    });
  });
});
