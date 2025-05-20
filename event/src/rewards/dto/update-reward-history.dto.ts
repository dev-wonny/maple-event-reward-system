import { PartialType } from '@nestjs/swagger';
import { CreateRewardHistoryDto } from './create-reward-history.dto';

export class UpdateRewardHistoryDto extends PartialType(
  CreateRewardHistoryDto,
) {}
