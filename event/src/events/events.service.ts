import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Event } from './schemas/event.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { Condition } from '../conditions/schemas/condition.schema';
import { Reward } from '../rewards/schemas/reward.schema';
import { EventResponseDto } from './dto/event-response.dto';
import { ConditionResponseDto } from '../conditions/dto/condition-response.dto';
import { RewardResponseDto } from '../rewards/dto/reward-response.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
    @InjectModel(Condition.name)
    private readonly conditionModel: Model<Condition>,
    @InjectModel(Reward.name) private readonly rewardModel: Model<Reward>,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<EventResponseDto> {
    // 이벤트 ID 중복 확인
    const existingEvent = await this.eventModel
      .findOne({
        eventId: createEventDto.eventId,
      })
      .lean();

    if (existingEvent) {
      throw new ConflictException(
        `Event with ID ${createEventDto.eventId} already exists`,
      );
    }

    // 조건 ID 유효성 검증
    await this.validateConditionIds(createEventDto.conditionIds);

    // 보상 ID 유효성 검증
    await this.validateRewardIds(createEventDto.rewardIds);

    // 새 이벤트 생성
    const createdEvent = new this.eventModel(createEventDto);
    const savedEvent = await createdEvent.save();

    // 저장된 이벤트를 조회하여 조건과 보상 정보를 함께 반환
    return this.findOne(savedEvent.eventId);
  }

  async findAll(): Promise<EventResponseDto[]> {
    const events = await this.eventModel
      .find()
      .populate('conditionIds')
      .populate('rewardIds')
      .lean();

    return events.map((event) => this.mapToEventResponseDto(event));
  }

  async findOne(eventId: string): Promise<EventResponseDto> {
    const event = await this.eventModel
      .findOne({ eventId })
      .populate('conditionIds')
      .populate('rewardIds')
      .lean();

    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    return this.mapToEventResponseDto(event);
  }

  async update(
    eventId: string,
    updateEventDto: Partial<CreateEventDto>,
  ): Promise<EventResponseDto> {
    // 조건 ID가 있으면 유효성 검증
    if (updateEventDto.conditionIds) {
      await this.validateConditionIds(updateEventDto.conditionIds);
    }

    // 보상 ID가 있으면 유효성 검증
    if (updateEventDto.rewardIds) {
      await this.validateRewardIds(updateEventDto.rewardIds);
    }

    const updatedEvent = await this.eventModel
      .findOneAndUpdate({ eventId }, updateEventDto, { new: true })
      .populate('conditionIds')
      .populate('rewardIds')
      .lean();

    if (!updatedEvent) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    return this.mapToEventResponseDto(updatedEvent);
  }

  /**
   * 이벤트 부분 업데이트 메서드
   * @param eventId 이벤트 ID
   * @param updateEventDto 업데이트할 필드만 포함된 DTO
   */
  async partialUpdate(
    eventId: string,
    updateEventDto: UpdateEventDto,
  ): Promise<EventResponseDto> {
    // 조건 ID가 있으면 유효성 검증
    if (updateEventDto.conditionIds && updateEventDto.conditionIds.length > 0) {
      await this.validateConditionIds(updateEventDto.conditionIds);
    }

    // 보상 ID가 있으면 유효성 검증
    if (updateEventDto.rewardIds && updateEventDto.rewardIds.length > 0) {
      await this.validateRewardIds(updateEventDto.rewardIds);
    }

    const updatedEvent = await this.eventModel
      .findOneAndUpdate({ eventId }, updateEventDto, { new: true })
      .populate('conditionIds')
      .populate('rewardIds')
      .lean();

    if (!updatedEvent) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    return this.mapToEventResponseDto(updatedEvent);
  }

  async remove(eventId: string): Promise<void> {
    const result = await this.eventModel.deleteOne({ eventId });

    if (result.deletedCount === 0) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }
  }

  /**
   * 이벤트 상태(활성화/비활성화) 업데이트 메서드
   * @param eventId 이벤트 ID
   * @param isActive 활성화 여부
   */
  async updateStatus(
    eventId: string,
    isActive: boolean,
  ): Promise<EventResponseDto> {
    const updatedEvent = await this.eventModel
      .findOneAndUpdate({ eventId }, { isActive }, { new: true })
      .populate('conditionIds')
      .populate('rewardIds')
      .lean();

    if (!updatedEvent) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    return this.mapToEventResponseDto(updatedEvent);
  }

  // 이전 메서드들은 updateStatus로 대체됩니다
  async activateEvent(eventId: string): Promise<EventResponseDto> {
    return this.updateStatus(eventId, true);
  }

  async deactivateEvent(eventId: string): Promise<EventResponseDto> {
    return this.updateStatus(eventId, false);
  }

  /**
   * 조건 ID 목록의 유효성을 검증하는 헬퍼 메서드
   * @param conditionIds 조건 ID 목록
   */
  private async validateConditionIds(conditionIds: string[]): Promise<void> {
    // 모든 ID가 유효한 MongoDB ObjectId 형식인지 확인
    const invalidIds = conditionIds.filter((id) => !isValidObjectId(id));
    if (invalidIds.length > 0) {
      throw new BadRequestException(
        `Invalid condition IDs: ${invalidIds.join(', ')}`,
      );
    }

    // 모든 ID가 데이터베이스에 존재하는지 확인
    const conditions = await this.conditionModel
      .find({ _id: { $in: conditionIds } })
      .lean();

    if (conditions.length !== conditionIds.length) {
      const foundIds = conditions.map((condition) => condition._id.toString());
      const missingIds = conditionIds.filter((id) => !foundIds.includes(id));
      throw new BadRequestException(
        `Condition IDs not found: ${missingIds.join(', ')}`,
      );
    }
  }

  /**
   * 보상 ID 목록의 유효성을 검증하는 헬퍼 메서드
   * @param rewardIds 보상 ID 목록
   */
  private async validateRewardIds(rewardIds: string[]): Promise<void> {
    // 모든 ID가 유효한 MongoDB ObjectId 형식인지 확인
    const invalidIds = rewardIds.filter((id) => !isValidObjectId(id));
    if (invalidIds.length > 0) {
      throw new BadRequestException(
        `Invalid reward IDs: ${invalidIds.join(', ')}`,
      );
    }

    // 모든 ID가 데이터베이스에 존재하는지 확인
    const rewards = await this.rewardModel
      .find({ _id: { $in: rewardIds } })
      .lean();

    if (rewards.length !== rewardIds.length) {
      const foundIds = rewards.map((reward) => reward._id.toString());
      const missingIds = rewardIds.filter((id) => !foundIds.includes(id));
      throw new BadRequestException(
        `Reward IDs not found: ${missingIds.join(', ')}`,
      );
    }
  }

  /**
   * Mongoose 문서를 EventResponseDto로 변환하는 헬퍼 메서드
   * @param event Mongoose 이벤트 문서
   */
  private mapToEventResponseDto(event: any): EventResponseDto {
    // 조건 목록 매핑
    const conditions = Array.isArray(event.conditionIds)
      ? event.conditionIds.map((condition) => {
          return {
            id: condition._id.toString(),
            category: condition.category,
            subType: condition.subType,
            target: condition.target,
            description: condition.description,
            createdAt: condition.createdAt,
            updatedAt: condition.updatedAt,
          } as ConditionResponseDto;
        })
      : [];

    // 보상 목록 매핑
    const rewards = Array.isArray(event.rewardIds)
      ? event.rewardIds.map((reward) => {
          return {
            id: reward._id.toString(),
            type: reward.type,
            quantity: reward.quantity,
            itemId: reward.itemId,
            description: reward.description,
            createdAt: reward.createdAt,
            updatedAt: reward.updatedAt,
          } as RewardResponseDto;
        })
      : [];

    return {
      eventId: event.eventId,
      title: event.title,
      category: event.category,
      conditions,
      rewards,
      trigger: event.trigger,
      deliveryType: event.deliveryType,
      startAt: event.startAt,
      endAt: event.endAt,
      isActive: event.isActive,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    };
  }
}
