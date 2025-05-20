import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 설정 추가
  app.enableCors({
    origin: true, // 모든 출처 허용 (프로덕션 환경에서는 특정 출처만 허용하는 것이 좋습니다)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type,Authorization',
  });

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('Auth API')
    .setDescription('인증 서비스 API 문서')
    .setVersion('1.0')
    .addTag('auth')
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

  // 마이크로서비스 시작
  // await app.startAllMicroservices();

  // HTTP 서버 시작 (다른 포트 사용)
  await app.listen(3000);
}

bootstrap();
