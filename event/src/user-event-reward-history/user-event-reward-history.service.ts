import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  UserEventRewardHistory,
  UserEventRewardHistoryDocument,
} from './schemas/user-event-reward-history.schema';
import { CreateUserEventRewardHistoryDto } from './dto/create-user-event-reward-history.dto';
import { UserEventRewardHistoryResponseDto } from './dto/user-event-reward-history-response.dto';

@Injectable()
export class UserEventRewardHistoryService {
  constructor(
    @InjectModel(UserEventRewardHistory.name)
    private readonly userEventRewardHistoryModel: Model<UserEventRewardHistoryDocument>,
  ) {}

  /**
   * 새로운 보상 지급 기록을 생성합니다.
   * @param createUserEventRewardHistoryDto 보상 지급 기록 생성 DTO
   */
  async create(
    createUserEventRewardHistoryDto: CreateUserEventRewardHistoryDto,
  ): Promise<UserEventRewardHistoryResponseDto> {
    // 날짜 문자열을 Date 객체로 변환
    const historyData = {
      ...createUserEventRewardHistoryDto,
      requestedAt: createUserEventRewardHistoryDto.requestedAt
        ? new Date(createUserEventRewardHistoryDto.requestedAt)
        : new Date(),
      deliveredAt: createUserEventRewardHistoryDto.deliveredAt
        ? new Date(createUserEventRewardHistoryDto.deliveredAt)
        : new Date(),
    };

    const newHistory =
      await this.userEventRewardHistoryModel.create(historyData);
    return this.mapToResponseDto(newHistory.toObject());
  }

  /**
   * 모든 보상 지급 기록을 조회합니다.
   * @returns 모든 보상 지급 기록 목록
   */
  async findAll(): Promise<UserEventRewardHistoryResponseDto[]> {
    const histories = await this.userEventRewardHistoryModel
      .find()
      .sort({ deliveredAt: -1 })
      .lean();
    return histories.map((history) => this.mapToResponseDto(history));
  }

  /**
   * 사용자별 보상 지급 기록을 조회합니다.
   * @param userId 사용자 ID
   */
  async findAllByUserId(
    userId: string,
  ): Promise<UserEventRewardHistoryResponseDto[]> {
    const histories = await this.userEventRewardHistoryModel
      .find({ userId })
      .sort({ deliveredAt: -1 })
      .lean();
    return histories.map((history) => this.mapToResponseDto(history));
  }

  /**
   * 특정 ID의 보상 지급 기록을 조회합니다.
   * @param id 보상 지급 기록 ID
   */
  async findById(id: string): Promise<UserEventRewardHistoryResponseDto> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`유효하지 않은 ID 형식입니다: ${id}`);
    }

    const history = await this.userEventRewardHistoryModel.findById(id).lean();
    if (!history) {
      throw new NotFoundException(
        `ID ${id}에 해당하는 보상 지급 기록을 찾을 수 없습니다.`,
      );
    }
    return this.mapToResponseDto(history);
  }

  /**
   * 특정 이벤트에 대한 사용자의 보상 지급 기록을 조회합니다.
   * @param userId 사용자 ID
   * @param eventId 이벤트 ID
   */
  async findAllByUserIdAndEventId(
    userId: string,
    eventId: string,
  ): Promise<UserEventRewardHistoryResponseDto[]> {
    const histories = await this.userEventRewardHistoryModel
      .find({ userId, eventId })
      .sort({ deliveredAt: -1 })
      .lean();
    return histories.map((history) => this.mapToResponseDto(history));
  }

  /**
   * 이벤트별 보상 지급 기록을 조회합니다.
   * @param eventId 이벤트 ID
   */
  async findAllByEventId(
    eventId: string,
  ): Promise<UserEventRewardHistoryResponseDto[]> {
    const histories = await this.userEventRewardHistoryModel
      .find({ eventId })
      .sort({ deliveredAt: -1 })
      .lean();
    return histories.map((history) => this.mapToResponseDto(history));
  }

  /**
   * 날짜 범위로 보상 지급 기록을 조회합니다.
   * @param startDate 시작 날짜
   * @param endDate 종료 날짜
   */
  async findAllByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<UserEventRewardHistoryResponseDto[]> {
    const histories = await this.userEventRewardHistoryModel
      .find({
        deliveredAt: {
          $gte: startDate,
          $lte: endDate,
        },
      })
      .sort({ deliveredAt: -1 })
      .lean();
    return histories.map((history) => this.mapToResponseDto(history));
  }

  /**
   * 모델 객체를 응답 DTO로 변환합니다.
   * @param history 보상 지급 기록 모델 객체
   */
  private mapToResponseDto(history: any): UserEventRewardHistoryResponseDto {
    return {
      id: history._id.toString(),
      userId: history.userId,
      eventId: history.eventId,
      rewardId: history.rewardId,
      quantity: history.quantity,
      itemId: history.itemId,
      requestedAt: history.requestedAt,
      deliveredAt: history.deliveredAt,
      createdAt: history.createdAt,
      updatedAt: history.updatedAt,
    };
  }
}
