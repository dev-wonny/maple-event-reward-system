import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProxyModule } from './proxy/proxy.module';
import { AuthController } from './controllers/auth.controller';
import { UsersController } from './controllers/users.controller';
import { EventsController } from './controllers/events.controller';
import { ConditionsController } from './controllers/conditions.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    AuthModule,
    ProxyModule,
  ],
  controllers: [
    AppController, 
    AuthController, 
    UsersController,
    EventsController,
    ConditionsController
  ],
  providers: [AppService],
})
export class AppModule {}
