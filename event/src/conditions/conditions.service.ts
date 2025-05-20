import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Condition, parseTargetValue } from './schemas/condition.schema';
import { CreateConditionDto } from './dto/create-condition.dto';
import { UpdateConditionDto } from './dto/update-condition.dto';
import { ConditionResponseDto } from './dto/condition-response.dto';

@Injectable()
export class ConditionsService {
  constructor(
    @InjectModel(Condition.name) private conditionModel: Model<Condition>,
  ) {}

  async create(
    createConditionDto: CreateConditionDto,
  ): Promise<ConditionResponseDto> {
    try {
      const createdCondition = new this.conditionModel(createConditionDto);
      const savedCondition = await createdCondition.save();
      return this.mapToConditionResponseDto(savedCondition);
    } catch (error) {
      throw new BadRequestException(
        '조건 생성에 실패했습니다: ' + error.message,
      );
    }
  }

  async findAll(): Promise<ConditionResponseDto[]> {
    try {
      const conditions = await this.conditionModel.find().lean().exec();
      return conditions.map((condition) =>
        this.mapToConditionResponseDto(condition),
      );
    } catch (error) {
      throw new BadRequestException(
        '조건 목록 조회에 실패했습니다: ' + error.message,
      );
    }
  }

  async findOne(id: string): Promise<ConditionResponseDto> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('유효하지 않은 조건 ID 형식입니다');
    }

    const condition = await this.conditionModel.findById(id).lean().exec();
    if (!condition) {
      throw new NotFoundException(`ID가 ${id}인 조건을 찾을 수 없습니다`);
    }
    return this.mapToConditionResponseDto(condition);
  }

  async update(
    id: string,
    updateConditionDto: UpdateConditionDto,
  ): Promise<ConditionResponseDto> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('유효하지 않은 조건 ID 형식입니다');
    }

    try {
      const updatedCondition = await this.conditionModel
        .findByIdAndUpdate(id, updateConditionDto, { new: true })
        .lean()
        .exec();

      if (!updatedCondition) {
        throw new NotFoundException(`ID가 ${id}인 조건을 찾을 수 없습니다`);
      }

      return this.mapToConditionResponseDto(updatedCondition);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        '조건 업데이트에 실패했습니다: ' + error.message,
      );
    }
  }

  async remove(id: string): Promise<ConditionResponseDto> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('유효하지 않은 조건 ID 형식입니다');
    }

    const deletedCondition = await this.conditionModel
      .findByIdAndDelete(id)
      .lean()
      .exec();

    if (!deletedCondition) {
      throw new NotFoundException(`ID가 ${id}인 조건을 찾을 수 없습니다`);
    }

    return this.mapToConditionResponseDto(deletedCondition);
  }

  /**
   * Mongoose 문서를 ConditionResponseDto로 변환하는 헬퍼 메서드
   * target 필드가 숫자 문자열인 경우 숫자로 변환
   */
  private mapToConditionResponseDto(condition: any): ConditionResponseDto {
    const parsedTarget = condition.target
      ? parseTargetValue(condition.target)
      : undefined;

    return {
      id: condition._id ? condition._id.toString() : condition.id,
      category: condition.category,
      subType: condition.subType,
      target: parsedTarget,
      description: condition.description,
      createdAt: condition.createdAt,
      updatedAt: condition.updatedAt,
    };
  }
}
