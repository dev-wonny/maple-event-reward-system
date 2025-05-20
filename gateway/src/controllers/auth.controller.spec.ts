import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { ProxyService } from '../proxy/proxy.service';
import { CreateUserDto, LoginDto, UserRole } from '../dto/auth.dto';
import { of } from 'rxjs';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// 모의 객체 생성
const mockProxyService = {
  sendToAuthService: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;
  let proxyService: ProxyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: ProxyService,
          useValue: mockProxyService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true }) // JWT 가드 모의 처리
      .compile();

    controller = module.get<AuthController>(AuthController);
    proxyService = module.get<ProxyService>(ProxyService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('로그인 요청을 Auth 서비스로 전달해야 함', (done) => {
      // 준비
      const loginDto: LoginDto = {
        userId: 'testuser',
        password: 'password123',
      };
      const expectedResponse = { access_token: 'test-token' };
      
      mockProxyService.sendToAuthService.mockReturnValue(of(expectedResponse));

      // 실행 및 검증
      controller.login(loginDto).subscribe(result => {
        expect(proxyService.sendToAuthService).toHaveBeenCalledWith('login', loginDto);
        expect(result).toEqual(expectedResponse);
        done();
      });
    });
  });

  describe('signup', () => {
    it('회원가입 요청을 Auth 서비스로 전달해야 함', (done) => {
      // 준비
      const createUserDto: CreateUserDto = {
        userId: 'newuser',
        email: 'test@example.com',
        nickName: '테스트유저',
        password: 'password123',
        role: UserRole.USER,
      };
      const expectedResponse = { userId: 'newuser', email: 'test@example.com' };
      
      mockProxyService.sendToAuthService.mockReturnValue(of(expectedResponse));

      // 실행 및 검증
      controller.signup(createUserDto).subscribe(result => {
        expect(proxyService.sendToAuthService).toHaveBeenCalledWith('signup', createUserDto);
        expect(result).toEqual(expectedResponse);
        done();
      });
    });
  });

  describe('getProfile', () => {
    it('인증된 사용자 정보 요청을 Auth 서비스로 전달해야 함', (done) => {
      // 준비
      const req = {
        user: { userId: 'testuser', role: UserRole.USER },
      };
      const expectedResponse = { 
        userId: 'testuser', 
        email: 'test@example.com',
        nickName: '테스트유저',
        role: UserRole.USER
      };
      
      mockProxyService.sendToAuthService.mockReturnValue(of(expectedResponse));

      // 실행 및 검증
      controller.getProfile(req).subscribe(result => {
        expect(proxyService.sendToAuthService).toHaveBeenCalledWith('get-profile', { user: req.user });
        expect(result).toEqual(expectedResponse);
        done();
      });
    });
  });
});
