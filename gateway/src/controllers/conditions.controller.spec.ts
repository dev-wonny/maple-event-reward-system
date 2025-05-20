import { Test, TestingModule } from '@nestjs/testing';
import { ConditionsController } from './conditions.controller';
import { ProxyService } from '../proxy/proxy.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { of } from 'rxjs';

// 모의 객체 생성
const mockProxyService = {
  sendToEventService: jest.fn(),
};

describe('ConditionsController', () => {
  let controller: ConditionsController;
  let proxyService: ProxyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConditionsController],
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

    controller = module.get<ConditionsController>(ConditionsController);
    proxyService = module.get<ProxyService>(ProxyService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('컨트롤러가 정의되어 있어야 함', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('조건 생성 요청을 Event 서비스로 전달해야 함', (done) => {
      // 준비
      const createConditionDto = {
        name: '테스트 조건',
        description: '테스트 조건 설명',
        rules: { type: 'test', value: 10 }
      };
      const req = {
        user: { userId: 'testuser', role: 'USER' }
      };
      const expectedResponse = { id: 'condition-id-1', ...createConditionDto };
      
      mockProxyService.sendToEventService.mockReturnValue(of(expectedResponse));

      // 실행 및 검증
      controller.create(createConditionDto, req).subscribe(result => {
        expect(proxyService.sendToEventService).toHaveBeenCalledWith('conditions/create', {
          ...createConditionDto,
          user: req.user
        });
        expect(result).toEqual(expectedResponse);
        done();
      });
    });
  });

  describe('findAll', () => {
    it('모든 조건 목록 조회 요청을 Event 서비스로 전달해야 함', (done) => {
      // 준비
      const req = {
        user: { userId: 'testuser', role: 'USER' }
      };
      const expectedResponse = [
        { id: 'condition-id-1', name: '조건 1' },
        { id: 'condition-id-2', name: '조건 2' }
      ];
      
      mockProxyService.sendToEventService.mockReturnValue(of(expectedResponse));

      // 실행 및 검증
      controller.findAll(req).subscribe(result => {
        expect(proxyService.sendToEventService).toHaveBeenCalledWith('conditions/findAll', {
          user: req.user
        });
        expect(result).toEqual(expectedResponse);
        done();
      });
    });
  });
});
