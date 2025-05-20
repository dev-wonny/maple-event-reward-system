import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserEventRewardRequest } from './schemas/user-event-reward-request.schema';
import { CreateUserEventRewardRequestDto } from './dto/create-user-event-reward-request.dto';
import { UserEventRewardRequestResponseDto } from './dto/user-event-reward-request-response.dto';
import { UpdateUserEventRewardStatusDto } from './dto/update-user-event-reward-status.dto';
import { Event } from '../events/schemas/event.schema';
import { Reward } from '../rewards/schemas/reward.schema';
import { RewardStatus } from '../../../libs/common/enums/reward-status.enum';
import { UserEventRewardHistoryService } from '../user-event-reward-history/user-event-reward-history.service';
import { CreateUserEventRewardHistoryDto } from '../user-event-reward-history/dto/create-user-event-reward-history.dto';

@Injectable()
export class UserEventRewardsService {
  constructor(
    @InjectModel(UserEventRewardRequest.name)
    private readonly userEventRewardRequestModel: Model<UserEventRewardRequest>,
    @InjectModel(Event.name)
    private readonly eventModel: Model<Event>,
    @InjectModel(Reward.name)
    private readonly rewardModel: Model<Reward>,
    private readonly userEventRewardHistoryService: UserEventRewardHistoryService,
  ) {}

  /**
   * 유저의 이벤트 보상 요청을 생성하고 처리합니다.
   * @param createUserEventRewardRequestDto 유저 이벤트 보상 요청 DTO
   */
  async create(
    createUserEventRewardRequestDto: CreateUserEventRewardRequestDto,
  ): Promise<UserEventRewardRequestResponseDto> {
    const { userId, eventId } = createUserEventRewardRequestDto;

    // 1. 중복 요청 확인
    const existingRequest = await this.userEventRewardRequestModel
      .findOne({ userId, eventId })
      .lean();

    if (existingRequest) {
      throw new ConflictException(
        `이미 해당 이벤트(${eventId})의 보상을 요청했습니다.`,
      );
    }

    // 2. 이벤트 존재 여부 확인
    const event = await this.eventModel
      .findOne({ eventId, isActive: true })
      .lean();

    if (!event) {
      throw new NotFoundException(
        `이벤트(${eventId})를 찾을 수 없거나 활성화되지 않았습니다.`,
      );
    }

    // 3. 이벤트에 보상이 있는지 확인
    if (!event.rewardIds || event.rewardIds.length === 0) {
      throw new BadRequestException(
        `이벤트(${eventId})에 보상이 설정되어 있지 않습니다.`,
      );
    }

    // 4. 이벤트 기간 확인
    const now = new Date();
    if (now < event.startAt || now > event.endAt) {
      throw new BadRequestException(
        `이벤트 기간이 아닙니다. 이벤트 기간: ${event.startAt} ~ ${event.endAt}`,
      );
    }

    // 5. 이벤트의 첫 번째 보상 ID를 사용하여 보상 정보 조회
    const firstRewardId = event.rewardIds[0];
    const reward = await this.rewardModel.findById(firstRewardId).lean();

    if (!reward) {
      throw new BadRequestException(
        `이벤트(${eventId})에 유효한 보상이 없습니다.`,
      );
    }

    // 6. 보상 스냅샷 생성 - 문자열로 변환하여 저장
    const rewardSnapshot = {
      type: reward.type,
      quantity: reward.quantity,
      itemId: reward.itemId || undefined,
      description: reward.description || undefined,
    };

    // 7. 요청 시간 설정 (제공되지 않은 경우 현재 시간으로 설정)
    const requestedAt =
      createUserEventRewardRequestDto.requestedAt || new Date();

    // 8. 보상 요청 생성
    const userEventRewardRequest = new this.userEventRewardRequestModel({
      ...createUserEventRewardRequestDto,
      rewardSnapshot,
      requestedAt,
      status: RewardStatus.PENDING, // 기본 상태는 PENDING
    });

    const savedRequest = await userEventRewardRequest.save();
    return this.mapToResponseDto(savedRequest);
  }

  /**
   * 유저의 모든 이벤트 보상 요청을 조회합니다.
   * @param userId 유저 ID
   */
  async findAllByUserId(
    userId: string,
  ): Promise<UserEventRewardRequestResponseDto[]> {
    const requests = await this.userEventRewardRequestModel
      .find({ userId })
      .lean();
    return requests.map((request) => this.mapToResponseDto(request));
  }

  /**
   * 특정 이벤트에 대한 유저의 보상 요청을 조회합니다.
   * @param userId 유저 ID
   * @param eventId 이벤트 ID
   */
  async findAllByUserIdAndEventId(
    userId: string,
    eventId: string,
  ): Promise<UserEventRewardRequestResponseDto[]> {
    const requests = await this.userEventRewardRequestModel
      .find({ userId, eventId })
      .lean();
    return requests.map((request) => this.mapToResponseDto(request));
  }

  /**
   * 특정 보상 요청을 ID로 조회합니다.
   * @param id 보상 요청 ID
   */
  async findById(id: string): Promise<UserEventRewardRequestResponseDto> {
    // ObjectId 유효성 검사
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`유효하지 않은 ID 형식입니다: ${id}`);
    }

    const request = await this.userEventRewardRequestModel.findById(id).lean();
    if (!request) {
      throw new NotFoundException(`보상 요청(${id})을 찾을 수 없습니다.`);
    }
    return this.mapToResponseDto(request);
  }

  /**
   * 보상 요청의 상태를 업데이트합니다.
   * @param id 보상 요청 ID
   * @param updateStatusDto 상태 업데이트 DTO
   */
  async updateStatus(
    id: string,
    updateStatusDto: UpdateUserEventRewardStatusDto,
  ): Promise<UserEventRewardRequestResponseDto> {
    // ObjectId 유효성 검사
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`유효하지 않은 ID 형식입니다: ${id}`);
    }

    const { status, reason } = updateStatusDto;

    // 기존 요청 조회
    const existingRequest = await this.userEventRewardRequestModel
      .findById(id)
      .lean();

    if (!existingRequest) {
      throw new NotFoundException(`보상 요청(${id})을 찾을 수 없습니다.`);
    }

    // 상태 업데이트
    const updatedRequest = await this.userEventRewardRequestModel
      .findByIdAndUpdate(
        id,
        {
          status,
          reason,
          ...(status === RewardStatus.SUCCESS && { processedAt: new Date() }),
        },
        { new: true },
      )
      .lean();

    // 상태가 SUCCESS로 변경된 경우에만 히스토리에 기록
    if (status === RewardStatus.SUCCESS) {
      // 보상 스냅샷에서 필요한 정보 추출
      const { rewardSnapshot } = existingRequest;

      if (rewardSnapshot) {
        // 히스토리 생성을 위한 DTO 생성
        const historyDto: CreateUserEventRewardHistoryDto = {
          userId: existingRequest.userId,
          eventId: existingRequest.eventId,
          rewardId: existingRequest._id.toString(), // 보상 요청 ID를 rewardId로 사용
          quantity: rewardSnapshot.quantity,
          itemId: rewardSnapshot.itemId,
          requestedAt: new Date().toISOString(), // ISO 문자열로 변환
          deliveredAt: new Date().toISOString(), // ISO 문자열로 변환
        };

        // 히스토리 생성
        await this.userEventRewardHistoryService.create(historyDto);
      }
    }

    return this.mapToResponseDto(updatedRequest);
  }

  /**
   * 모든 보상 요청을 조회합니다. (관리자용)
   * @returns 모든 보상 요청 목록
   */
  async findAll(): Promise<UserEventRewardRequestResponseDto[]> {
    const requests = await this.userEventRewardRequestModel
      .find()
      .sort({ createdAt: -1 })
      .lean();
    return requests.map((request) => this.mapToResponseDto(request));
  }

  /**
   * 상태별로 보상 요청을 필터링하여 조회합니다.
   * @param status 보상 상태 (PENDING, SUCCESS, FAILED)
   * @returns 필터링된 보상 요청 목록
   */
  async findAllByStatus(status: RewardStatus): Promise<UserEventRewardRequestResponseDto[]> {
    const requests = await this.userEventRewardRequestModel
      .find({ status })
      .sort({ createdAt: -1 })
      .lean();
    return requests.map((request) => this.mapToResponseDto(request));
  }

  /**
   * 이벤트별로 보상 요청을 필터링하여 조회합니다.
   * @param eventId 이벤트 ID
   * @returns 필터링된 보상 요청 목록
   */
  async findAllByEventId(eventId: string): Promise<UserEventRewardRequestResponseDto[]> {
    const requests = await this.userEventRewardRequestModel
      .find({ eventId })
      .sort({ createdAt: -1 })
      .lean();
    return requests.map((request) => this.mapToResponseDto(request));
  }

  /**
   * 이벤트와 상태로 보상 요청을 필터링하여 조회합니다.
   * @param eventId 이벤트 ID
   * @param status 보상 상태
   * @returns 필터링된 보상 요청 목록
   */
  async findAllByEventIdAndStatus(
    eventId: string,
    status: RewardStatus
  ): Promise<UserEventRewardRequestResponseDto[]> {
    const requests = await this.userEventRewardRequestModel
      .find({ eventId, status })
      .sort({ createdAt: -1 })
      .lean();
    return requests.map((request) => this.mapToResponseDto(request));
  }

  /**
   * Mongoose 문서를 응답 DTO로 변환합니다.
   * @param request Mongoose 문서
   */
  private mapToResponseDto(request: any): UserEventRewardRequestResponseDto {
    return {
      id: request._id.toString(),
      userId: request.userId,
      eventId: request.eventId,
      trigger: request.trigger,
      deliveryType: request.deliveryType,
      rewardSnapshot: request.rewardSnapshot,
      status: request.status,
      requestedAt: request.requestedAt,
      reason: request.reason,
      createdAt: request.createdAt,
      updatedAt: request.updatedAt,
    };
  }
}
