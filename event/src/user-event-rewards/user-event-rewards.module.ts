import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserEventRewardsController } from './user-event-rewards.controller';
import { UserEventRewardsService } from './user-event-rewards.service';
import {
  UserEventRewardRequest,
  UserEventRewardRequestSchema,
} from './schemas/user-event-reward-request.schema';
import { EventsModule } from '../events/events.module';
import { RewardsModule } from '../rewards/rewards.module';
import { UserEventRewardHistoryModule } from '../user-event-reward-history/user-event-reward-history.module';
import { Event, EventSchema } from '../events/schemas/event.schema';
import { Reward, RewardSchema } from '../rewards/schemas/reward.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserEventRewardRequest.name,
        schema: UserEventRewardRequestSchema,
      },
      { name: Event.name, schema: EventSchema },
      { name: Reward.name, schema: RewardSchema },
    ]),
    EventsModule,
    RewardsModule,
    UserEventRewardHistoryModule,
  ],
  controllers: [UserEventRewardsController],
  providers: [UserEventRewardsService],
  exports: [UserEventRewardsService],
})
export class UserEventRewardsModule {}
