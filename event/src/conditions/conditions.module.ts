import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Condition, ConditionSchema } from './schemas/condition.schema';
import { ConditionsController } from './conditions.controller';
import { ConditionsService } from './conditions.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Condition.name, schema: ConditionSchema },
    ]),
  ],
  controllers: [ConditionsController],
  providers: [ConditionsService],
  exports: [ConditionsService],
})
export class ConditionsModule {}
