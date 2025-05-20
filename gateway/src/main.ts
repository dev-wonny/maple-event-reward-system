import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 전역 설정
  app.enableCors(); // CORS 활성화
  app.setGlobalPrefix('api'); // API 경로 접두사 설정

  // 전역 파이프 설정 (요청 데이터 유효성 검사)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 유효성 검사 데코레이터가 없는 속성은 제거
      forbidNonWhitelisted: true, // 화이트리스트에 없는 속성이 있으면 요청 거부
      transform: true, // 요청 데이터를 DTO 클래스의 인스턴스로 변환
    }),
  );

  // 서버 시작
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/api`);
}

bootstrap();
