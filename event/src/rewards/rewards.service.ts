import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Reward } from './schemas/reward.schema';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';
import { RewardResponseDto } from './dto/reward-response.dto';
import { RewardType } from '../../../libs/common';

@Injectable()
export class RewardsService {
  constructor(@InjectModel(Reward.name) private rewardModel: Model<Reward>) {}

  // 헬퍼 메서드: Reward 객체를 RewardResponseDto로 변환
  private mapToRewardResponseDto(reward: any): RewardResponseDto {
    return new RewardResponseDto({
      id: reward._id ? reward._id.toString() : reward.id,
      type: reward.type,
      quantity: reward.quantity,
      itemId: reward.itemId,
      description: reward.description,
      createdAt: reward.createdAt,
      updatedAt: reward.updatedAt,
    });
  }

  // Reward 관련 메서드
  async createReward(
    createRewardDto: CreateRewardDto,
  ): Promise<RewardResponseDto> {
    // 아이템 타입인 경우 itemId 필수 체크
    if (createRewardDto.type === RewardType.ITEM && !createRewardDto.itemId) {
      throw new BadRequestException('아이템 타입의 보상은 itemId가 필수입니다');
    }

    const createdReward = new this.rewardModel(createRewardDto);
    const savedReward = await createdReward.save();
    return this.mapToRewardResponseDto(savedReward.toObject());
  }

  async findAllRewards(): Promise<RewardResponseDto[]> {
    const rewards = await this.rewardModel.find().lean().exec();
    return rewards.map((reward) => this.mapToRewardResponseDto(reward));
  }

  async findOneReward(id: string): Promise<RewardResponseDto> {
    // ObjectId 형식 검증
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`${id}는 유효한 ID 형식이 아닙니다`);
    }

    const reward = await this.rewardModel.findById(id).lean().exec();

    if (!reward) {
      throw new NotFoundException(`ID가 ${id}인 보상을 찾을 수 없습니다`);
    }

    return this.mapToRewardResponseDto(reward);
  }

  async updateReward(
    id: string,
    updateRewardDto: UpdateRewardDto,
  ): Promise<RewardResponseDto> {
    // ObjectId 형식 검증
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`${id}는 유효한 ID 형식이 아닙니다`);
    }

    // 아이템 타입인 경우 itemId 필수 체크
    if (updateRewardDto.type === RewardType.ITEM && !updateRewardDto.itemId) {
      throw new BadRequestException('아이템 타입의 보상은 itemId가 필수입니다');
    }

    const updatedReward = await this.rewardModel
      .findByIdAndUpdate(id, updateRewardDto, { new: true })
      .lean()
      .exec();

    if (!updatedReward) {
      throw new NotFoundException(`ID가 ${id}인 보상을 찾을 수 없습니다`);
    }

    return this.mapToRewardResponseDto(updatedReward);
  }

  async removeReward(id: string): Promise<RewardResponseDto> {
    // ObjectId 형식 검증
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`${id}는 유효한 ID 형식이 아닙니다`);
    }

    const deletedReward = await this.rewardModel
      .findByIdAndDelete(id)
      .lean()
      .exec();

    if (!deletedReward) {
      throw new NotFoundException(`ID가 ${id}인 보상을 찾을 수 없습니다`);
    }

    return this.mapToRewardResponseDto(deletedReward);
  }
}
