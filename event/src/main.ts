import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 유효성 검사 파이프 설정
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('이벤트 서비스 API')
    .setDescription('이벤트 관리 시스템을 위한 API 문서')
    .setVersion('1.0')
    .addTag('events')
    .addTag('conditions')
    .addTag('rewards')
    .addTag('user-event-rewards')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'JWT 토큰을 입력하세요',
        in: 'header',
      },
      'JWT',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3002);
  console.log(
    `애플리케이션이 포트 ${process.env.PORT ?? 3002}에서 실행 중입니다.`,
  );
}

bootstrap();
