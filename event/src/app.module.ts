import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { ConditionsModule } from './conditions/conditions.module';
import { RewardsModule } from './rewards/rewards.module';
import { UserEventRewardsModule } from './user-event-rewards/user-event-rewards.module';
import { UserEventRewardHistoryModule } from './user-event-reward-history/user-event-reward-history.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri:
          configService.get<string>('MONGODB_URI') ||
          'mongodb://localhost:27017/event',
      }),
    }),
    EventsModule,
    ConditionsModule,
    RewardsModule,
    UserEventRewardsModule,
    UserEventRewardHistoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
