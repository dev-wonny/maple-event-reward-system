# 이벤트 리워드 시스템

이벤트 리워드 시스템은 사용자가 다양한 이벤트에 참여하고 조건을 충족했을 때 보상을 받을 수 있는 마이크로서비스 아키텍처 기반의 애플리케이션입니다.

## 목차

- [실행 방법](#실행-방법)
- [시스템 아키텍처](#시스템-아키텍처)
- [스키마 설명](#스키마-설명)
- [이벤트 설계](#이벤트-설계)
- [조건 검증 방식](#조건-검증-방식)
- [API 구조](#api-구조)
- [기술 선택 이유](#기술-선택-이유)
- [구현 중 겪은 고민](#구현-중-겪은-고민)

## 실행 방법

### 사전 요구사항

- Docker 및 Docker Compose가 설치되어 있어야 합니다.
- Node.js 및 npm이 설치되어 있어야 합니다. (개발 시에만 필요)

### Docker Compose를 사용한 실행

1. 저장소를 클론합니다:

```bash
git clone <repository-url>
cd event-reward-system
```

2. Docker Compose를 사용하여 서비스를 시작합니다:

```bash
docker-compose up -d
```

3. 서비스 접근:
   - Gateway API: http://localhost:3000/api
   - Auth 서비스: http://localhost:3001
   - Event 서비스: http://localhost:3002
   - MongoDB Express (데이터베이스 관리): http://localhost:8081 (사용자: admin, 비밀번호: yourpassword)

## 시스템 아키텍처

이 시스템은 마이크로서비스 아키텍처를 기반으로 구축되었으며, 다음과 같은 서비스로 구성됩니다:

1. **Gateway 서비스**: 클라이언트 요청을 받아 적절한 서비스로 라우팅하는 API 게이트웨이입니다.
2. **Auth 서비스**: 사용자 인증 및 권한 관리를 담당합니다.
3. **Event 서비스**: 이벤트, 조건, 보상 관리를 담당합니다.
4. **MongoDB**: 데이터 저장소로 사용됩니다.

서비스 간 통신은 HTTP를 통해 이루어지며, JWT 토큰을 사용하여 인증을 처리합니다.

## 스키마 설명

### User 스키마 (Auth 서비스)

```typescript
{
  userId: string;        // 사용자 ID (고유 식별자)
  email: string;         // 이메일 주소
  password: string;      // 암호화된 비밀번호
  nickName: string;      // 사용자 닉네임
  role: string;          // 사용자 역할 (USER, ADMIN)
  isBlocked: boolean;    // 계정 차단 여부
  loginCount: number;    // 로그인 횟수
  loginDays: number;     // 연속 로그인 일수
  createdAt: Date;       // 계정 생성 시간
  updatedAt: Date;       // 계정 정보 업데이트 시간
}
```

### Event 스키마 (Event 서비스)

```typescript
{
  eventId: string;       // 이벤트 ID (고유 식별자)
  title: string;         // 이벤트 제목
  description: string;   // 이벤트 설명
  startDate: Date;       // 이벤트 시작 날짜
  endDate: Date;         // 이벤트 종료 날짜
  isActive: boolean;     // 이벤트 활성화 여부
  conditions: Condition[]; // 이벤트 참여 조건 목록
  rewards: Reward[];     // 이벤트 보상 목록
  createdAt: Date;       // 이벤트 생성 시간
  updatedAt: Date;       // 이벤트 업데이트 시간
}
```

### Condition 스키마 (Event 서비스)

```typescript
{
  conditionId: string;   // 조건 ID (고유 식별자)
  eventId: string;       // 연결된 이벤트 ID
  type: string;          // 조건 유형 (LOGIN_COUNT, LOGIN_DAYS, PURCHASE, CUSTOM)
  value: number;         // 조건 값 (예: 로그인 횟수 5회)
  description: string;   // 조건 설명
  createdAt: Date;       // 조건 생성 시간
  updatedAt: Date;       // 조건 업데이트 시간
}
```

### Reward 스키마 (Event 서비스)

```typescript
{
  rewardId: string;      // 보상 ID (고유 식별자)
  eventId: string;       // 연결된 이벤트 ID
  type: string;          // 보상 유형 (POINT, ITEM, COUPON)
  value: number;         // 보상 값 (예: 포인트 100점)
  description: string;   // 보상 설명
  createdAt: Date;       // 보상 생성 시간
  updatedAt: Date;       // 보상 업데이트 시간
}
```

### UserEventRewardHistory 스키마 (Event 서비스)

```typescript
{
  historyId: string;     // 히스토리 ID (고유 식별자)
  userId: string;        // 사용자 ID
  eventId: string;       // 이벤트 ID
  rewardId: string;      // 보상 ID
  rewardType: string;    // 보상 유형
  rewardValue: number;   // 보상 값
  receivedAt: Date;      // 보상 수령 시간
}
```

## 이벤트 설계

이벤트는 다음과 같은 구조로 설계되었습니다:

1. **이벤트 생성**: 관리자가 이벤트를 생성하고 활성화합니다.
2. **조건 설정**: 이벤트에 참여하기 위한 조건을 설정합니다.
3. **보상 설정**: 조건을 충족했을 때 지급할 보상을 설정합니다.
4. **사용자 참여**: 사용자가 이벤트에 참여하고 조건을 충족하면 보상을 받습니다.
5. **보상 지급**: 조건 충족 시 자동으로 보상이 지급되고 히스토리에 기록됩니다.

## 조건 검증 방식

조건 검증은 다음과 같은 방식으로 이루어집니다:

1. **로그인 횟수 조건**: 사용자의 로그인 횟수를 추적하여 설정된 횟수에 도달하면 조건을 충족합니다.
2. **연속 로그인 일수 조건**: 사용자의 연속 로그인 일수를 추적하여 설정된 일수에 도달하면 조건을 충족합니다.
3. **구매 조건**: 사용자의 구매 내역을 추적하여 설정된 금액 이상 구매하면 조건을 충족합니다.
4. **커스텀 조건**: 특정 액션을 수행했을 때 조건을 충족합니다.

조건 검증은 사용자의 액션이 발생할 때마다 이벤트 서비스에서 검증하며, 조건이 충족되면 보상을 지급합니다.

## API 구조

### Gateway API

- `POST /api/auth/login`: 사용자 로그인
- `POST /api/auth/signup`: 사용자 회원가입
- `GET /api/auth/me`: 현재 로그인한 사용자 정보 조회
- `GET /api/users`: 모든 사용자 목록 조회
- `GET /api/users/:id`: 특정 사용자 정보 조회
- `PATCH /api/users/:id`: 사용자 정보 업데이트
- `DELETE /api/users/:id`: 사용자 삭제
- `POST /api/events`: 새 이벤트 생성
- `GET /api/events`: 모든 이벤트 목록 조회
- `GET /api/events/:eventId`: 특정 이벤트 정보 조회
- `PUT /api/events/:eventId`: 이벤트 정보 업데이트
- `PATCH /api/events/:eventId`: 이벤트 부분 업데이트
- `DELETE /api/events/:eventId`: 이벤트 삭제
- `PATCH /api/events/:eventId/activate`: 이벤트 활성화
- `PATCH /api/events/:eventId/deactivate`: 이벤트 비활성화
- `POST /api/conditions`: 새 조건 생성
- `GET /api/conditions`: 모든 조건 목록 조회

### Auth 서비스 API

- `POST /auth/login`: 사용자 로그인
- `POST /auth/signup`: 사용자 회원가입
- `GET /auth/me`: 현재 로그인한 사용자 정보 조회
- `GET /users`: 모든 사용자 목록 조회
- `GET /users/:id`: 특정 사용자 정보 조회
- `PATCH /users/:id`: 사용자 정보 업데이트
- `DELETE /users/:id`: 사용자 삭제

### Event 서비스 API

- `POST /events`: 새 이벤트 생성
- `GET /events`: 모든 이벤트 목록 조회
- `GET /events/:eventId`: 특정 이벤트 정보 조회
- `PUT /events/:eventId`: 이벤트 정보 업데이트
- `PATCH /events/:eventId`: 이벤트 부분 업데이트
- `DELETE /events/:eventId`: 이벤트 삭제
- `PATCH /events/:eventId/activate`: 이벤트 활성화
- `PATCH /events/:eventId/deactivate`: 이벤트 비활성화
- `POST /conditions`: 새 조건 생성
- `GET /conditions`: 모든 조건 목록 조회

## 기술 선택 이유

### NestJS

- 타입스크립트 기반의 강력한 백엔드 프레임워크
- 모듈화된 구조로 마이크로서비스 아키텍처 구현이 용이
- 데코레이터를 통한 선언적 프로그래밍 지원
- 내장된 의존성 주입 시스템으로 테스트 용이성 향상

### MongoDB

- 스키마 유연성이 높아 빠른 개발 및 변경 대응 가능
- 문서 기반 데이터 모델로 복잡한 관계를 단일 문서에 저장 가능
- 수평적 확장성이 뛰어나 대용량 데이터 처리에 적합

### Docker & Docker Compose

- 개발, 테스트, 배포 환경의 일관성 유지
- 서비스 간 격리로 안정성 향상
- 빠른 환경 구성 및 확장 가능

### JWT 인증

- 상태를 저장하지 않는(Stateless) 인증 방식으로 서버 부하 감소
- 마이크로서비스 간 인증 정보 공유 용이
- 토큰 기반 인증으로 보안성 향상

## 구현 중 겪은 고민

### 마이크로서비스 간 통신 방식

초기에는 TCP 기반의 마이크로서비스 통신을 고려했으나, 개발 및 디버깅의 용이성을 위해 HTTP 기반 통신으로 결정했습니다. 이는 서비스 간 통신을 더 직관적으로 만들고 디버깅을 용이하게 했습니다.

### 보상 히스토리 설계

처음에는 단순히 'RewardHistory'로 설계했으나, 사용자와 이벤트 간의 관계를 명확히 하기 위해 'UserEventRewardHistory'로 변경했습니다. 이를 통해 어떤 사용자가 어떤 이벤트에서 어떤 보상을 받았는지 명확하게 추적할 수 있게 되었습니다.

### Gateway 서비스 연결 문제

Gateway 서비스와 다른 마이크로서비스 간의 연결 과정에서 여러 문제가 발생했습니다:

1. **JWT 토큰 전달**: Gateway에서 Auth 서비스로 JWT 토큰을 전달하는 과정에서 인증 헤더 처리 방식의 불일치가 있었습니다. Auth 서비스는 'Bearer ' 접두사가 포함된 토큰을 기대하는데, 이를 정확히 전달하는 과정에서 어려움이 있었습니다.

2. **CORS 설정**: 서비스 간 통신 시 CORS 문제가 발생하여 이를 해결하기 위한 설정을 추가했습니다.

3. **환경 변수 일관성**: 각 서비스에서 사용하는 JWT_SECRET 등의 환경 변수가 일치하지 않아 인증 문제가 발생했습니다. Docker Compose 설정을 통해 이를 일관되게 관리하도록 수정했습니다.

### 조건 검증 로직

다양한 조건 유형(로그인 횟수, 연속 로그인 일수, 구매 등)에 대한 검증 로직을 어떻게 설계할지 고민했습니다. 최종적으로는 전략 패턴(Strategy Pattern)을 활용하여 각 조건 유형별로 검증 로직을 분리하여 구현했습니다.

## 향후 개선 사항

1. **메시지 큐 도입**: 서비스 간 비동기 통신을 위한 메시지 큐(RabbitMQ, Kafka 등) 도입 검토
2. **서비스 디스커버리**: 동적으로 서비스를 발견하고 로드 밸런싱하기 위한 서비스 디스커버리 도입
3. **모니터링 및 로깅**: 분산 로깅 및 모니터링 시스템 도입
4. **테스트 자동화**: 단위 테스트, 통합 테스트, E2E 테스트 자동화
5. **CI/CD 파이프라인**: 지속적 통합 및 배포 파이프라인 구축
