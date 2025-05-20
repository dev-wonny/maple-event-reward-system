import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { ProxyService } from '../proxy/proxy.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateEventDto, UpdateEventDto } from '../dto/event.dto';
import { of } from 'rxjs';

// 모의 객체 생성
const mockProxyService = {
  sendToEventService: jest.fn(),
};

describe('EventsController', () => {
  let controller: EventsController;
  let proxyService: ProxyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
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

    controller = module.get<EventsController>(EventsController);
    proxyService = module.get<ProxyService>(ProxyService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('컨트롤러가 정의되어 있어야 함', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('이벤트 생성 요청을 Event 서비스로 전달해야 함', (done) => {
      // 준비
      const createEventDto: CreateEventDto = {
        eventId: 'event-1',
        name: '테스트 이벤트',
        description: '테스트 이벤트 설명',
        conditionId: 'condition-1',
        rewardIds: ['reward-1', 'reward-2'],
        isActive: true
      };
      const req = {
        user: { userId: 'testuser', role: 'USER' }
      };
      const expectedResponse = { id: 'event-id-1', ...createEventDto };
      
      mockProxyService.sendToEventService.mockReturnValue(of(expectedResponse));

      // 실행 및 검증
      controller.create(createEventDto, req).subscribe(result => {
        expect(proxyService.sendToEventService).toHaveBeenCalledWith('create', {
          ...createEventDto,
          user: req.user
        });
        expect(result).toEqual(expectedResponse);
        done();
      });
    });
  });

  describe('findAll', () => {
    it('모든 이벤트 목록 조회 요청을 Event 서비스로 전달해야 함', (done) => {
      // 준비
      const req = {
        user: { userId: 'testuser', role: 'USER' }
      };
      const expectedResponse = [
        { id: 'event-id-1', name: '이벤트 1' },
        { id: 'event-id-2', name: '이벤트 2' }
      ];
      
      mockProxyService.sendToEventService.mockReturnValue(of(expectedResponse));

      // 실행 및 검증
      controller.findAll(req).subscribe(result => {
        expect(proxyService.sendToEventService).toHaveBeenCalledWith('findAll', {
          user: req.user
        });
        expect(result).toEqual(expectedResponse);
        done();
      });
    });
  });

  describe('findOne', () => {
    it('특정 이벤트 조회 요청을 Event 서비스로 전달해야 함', (done) => {
      // 준비
      const eventId = 'event-id-1';
      const req = {
        user: { userId: 'testuser', role: 'USER' }
      };
      const expectedResponse = { id: eventId, name: '테스트 이벤트' };
      
      mockProxyService.sendToEventService.mockReturnValue(of(expectedResponse));

      // 실행 및 검증
      controller.findOne(eventId, req).subscribe(result => {
        expect(proxyService.sendToEventService).toHaveBeenCalledWith('findOne', {
          id: eventId,
          user: req.user
        });
        expect(result).toEqual(expectedResponse);
        done();
      });
    });
  });

  describe('update', () => {
    it('이벤트 전체 업데이트 요청을 Event 서비스로 전달해야 함', (done) => {
      // 준비
      const eventId = 'event-id-1';
      const createEventDto: CreateEventDto = {
        eventId: 'event-1',
        name: '업데이트된 이벤트',
        description: '업데이트된 설명',
        conditionId: 'condition-1',
        rewardIds: ['reward-1', 'reward-2'],
        isActive: true
      };
      const req = {
        user: { userId: 'testuser', role: 'USER' }
      };
      const expectedResponse = { id: eventId, ...createEventDto };
      
      mockProxyService.sendToEventService.mockReturnValue(of(expectedResponse));

      // 실행 및 검증
      controller.update(eventId, createEventDto, req).subscribe(result => {
        expect(proxyService.sendToEventService).toHaveBeenCalledWith('update', {
          id: eventId,
          ...createEventDto,
          user: req.user
        });
        expect(result).toEqual(expectedResponse);
        done();
      });
    });
  });

  describe('partialUpdate', () => {
    it('이벤트 부분 업데이트 요청을 Event 서비스로 전달해야 함', (done) => {
      // 준비
      const eventId = 'event-id-1';
      const updateEventDto: UpdateEventDto = {
        name: '부분 업데이트된 이벤트',
        isActive: false
      };
      const req = {
        user: { userId: 'testuser', role: 'USER' }
      };
      const expectedResponse = { 
        id: eventId, 
        name: '부분 업데이트된 이벤트',
        isActive: false
      };
      
      mockProxyService.sendToEventService.mockReturnValue(of(expectedResponse));

      // 실행 및 검증
      controller.partialUpdate(eventId, updateEventDto, req).subscribe(result => {
        expect(proxyService.sendToEventService).toHaveBeenCalledWith('partialUpdate', {
          id: eventId,
          ...updateEventDto,
          user: req.user
        });
        expect(result).toEqual(expectedResponse);
        done();
      });
    });
  });

  describe('remove', () => {
    it('이벤트 삭제 요청을 Event 서비스로 전달해야 함', (done) => {
      // 준비
      const eventId = 'event-id-1';
      const req = {
        user: { userId: 'testuser', role: 'USER' }
      };
      const expectedResponse = { success: true, id: eventId };
      
      mockProxyService.sendToEventService.mockReturnValue(of(expectedResponse));

      // 실행 및 검증
      controller.remove(eventId, req).subscribe(result => {
        expect(proxyService.sendToEventService).toHaveBeenCalledWith('remove', {
          id: eventId,
          user: req.user
        });
        expect(result).toEqual(expectedResponse);
        done();
      });
    });
  });

  describe('activate', () => {
    it('이벤트 활성화 요청을 Event 서비스로 전달해야 함', (done) => {
      // 준비
      const eventId = 'event-id-1';
      const req = {
        user: { userId: 'testuser', role: 'USER' }
      };
      const expectedResponse = { id: eventId, isActive: true };
      
      mockProxyService.sendToEventService.mockReturnValue(of(expectedResponse));

      // 실행 및 검증
      controller.activate(eventId, req).subscribe(result => {
        expect(proxyService.sendToEventService).toHaveBeenCalledWith('activate', {
          id: eventId,
          user: req.user
        });
        expect(result).toEqual(expectedResponse);
        done();
      });
    });
  });

  describe('deactivate', () => {
    it('이벤트 비활성화 요청을 Event 서비스로 전달해야 함', (done) => {
      // 준비
      const eventId = 'event-id-1';
      const req = {
        user: { userId: 'testuser', role: 'USER' }
      };
      const expectedResponse = { id: eventId, isActive: false };
      
      mockProxyService.sendToEventService.mockReturnValue(of(expectedResponse));

      // 실행 및 검증
      controller.deactivate(eventId, req).subscribe(result => {
        expect(proxyService.sendToEventService).toHaveBeenCalledWith('deactivate', {
          id: eventId,
          user: req.user
        });
        expect(result).toEqual(expectedResponse);
        done();
      });
    });
  });
});
