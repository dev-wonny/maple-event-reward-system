import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserEventRewardHistoryController } from './user-event-reward-history.controller';
import { UserEventRewardHistoryService } from './user-event-reward-history.service';
import {
  UserEventRewardHistory,
  UserEventRewardHistorySchema,
} from './schemas/user-event-reward-history.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserEventRewardHistory.name,
        schema: UserEventRewardHistorySchema,
      },
    ]),
  ],
  controllers: [UserEventRewardHistoryController],
  providers: [UserEventRewardHistoryService],
  exports: [UserEventRewardHistoryService],
})
export class UserEventRewardHistoryModule {}
