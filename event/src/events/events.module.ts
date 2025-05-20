import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { Event, EventSchema } from './schemas/event.schema';
import {
  Condition,
  ConditionSchema,
} from '../conditions/schemas/condition.schema';
import { Reward, RewardSchema } from '../rewards/schemas/reward.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: Condition.name, schema: ConditionSchema },
      { name: Reward.name, schema: RewardSchema },
    ]),
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
