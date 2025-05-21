# 🧩 이벤트 보상 시스템 (NestJS + MSA + MongoDB)

## 과제 개요

**목표:**
- NestJS + MSA + MongoDB 기반, 3개 서버 구조의 이벤트 보상 시스템 구축

**주요 기능:**
- 이벤트 생성
- 보상 정의
- 유저 보상 요청
- 관리자 및 감사자 확인 기능

**서버 구성:**
- **Gateway Server:** 모든 API 요청 진입점, 인증/권한 검사 및 라우팅
- **Auth Server:** 유저 정보 관리, 로그인, 역할 관리, JWT 발급
- **Event Server:** 이벤트 생성, 보상 정의, 보상 요청 처리, 지급 상태 저장

---
### 🕒 개발 기간
| 구분     | 소요 시간            |
| ------ | ---------------- |
| 설계     | 6시간              |
| 개발     | 18시간             |
| **총합** | **24시간 (2일 작업)** |

### 💡설계 전략

- **게임은 개인 아이디를 기준으로 이벤트 요청 및 상태 수정**되기 때문에 쓰기 락(write lock)이 필요하지 않습니다.
- **읽기 작업이 많아** 리드 락(read lock) 전략을 사용하는 것이 효과적입니다.

### 🧩 핵심 기능
* ✅ 이벤트 등록 및 조건 설정
  - 카테고리, 조건 타입, 기준값 설정
* ✅ 보상 등록 및 타입 관리
  - meso / mPoint / item 보상 정의
* ✅ 유저 보상 요청 처리
  - 수동 또는 자동 요청, 중복 방지, 상태 기록
* ✅ 지급 이력 기록 및 감사 조회
  - 성공 지급만 별도 저장하여 AUDITOR가 확인 가능

### 📌 역할별 기능 요약
| 역할         | 설명                   |
| ---------- | -------------------- |
| `USER`     | 이벤트 조회 및 보상 요청       |
| `OPERATOR` | 이벤트/보상 등록 및 수락 처리    |
| `ADMIN`    | 전체 접근 및 설정 가능        |
| `AUDITOR`  | 지급 이력만 조회 가능 (읽기 전용) |



---

## 🔧 기능 상세

### 1. Gateway Server
- 모든 요청 수신, 라우팅
- JWT 토큰 검증 및 역할(Role) 검사
- NestJS의 @nestjs/passport, AuthGuard, RolesGuard 사용
- 요청을 Event 서버, Auth 서버로 HttpService를 이용한 proxy 호출

### 2. Auth Server
- 유저 등록 / 로그인 / 역할(role) 관리
- JWT 관리 (HS256, exp, sub 포함)
- 유저 DB: MongoDB 컬렉션 또는 하드코딩

### 3. Event Server
- 이벤트 등록/조회, 조건 검증, 보상 처리, 지급 이력 저장
- 이벤트/보상 매핑, 조건별 검증 및 지급 처리

#### 이벤트/보상 주요 기능
- **이벤트 등록/조회:** 운영자/관리자만 생성, 조건(카테고리, 기간, 상태 등) 포함
- **보상 등록/조회:** 이벤트에 연결, 포인트/아이템/쿠폰 등, 수량 필수
- **유저 보상 요청:** 조건 충족 여부 검증, 중복 방지, 요청 상태 기록
- **보상 요청 내역 확인:** 유저 본인/관리자/감사자 전체 이력 조회, 필터링 지원

---

## 📂 디렉터리 구조 예시
```
root/
├── docker-compose.yml
├── gateway/
│   └── src/
│       ├── main.ts, app.module.ts, proxy.controller.ts, auth.guard.ts, roles.guard.ts
├── auth/
│   └── src/
│       ├── main.ts, app.module.ts, auth.controller.ts, auth.service.ts, user.schema.ts, jwt.strategy.ts
├── event/
│   └── src/
│       ├── main.ts, app.module.ts, event.controller.ts, event.service.ts, reward.controller.ts, reward.service.ts, reward-history.controller.ts
│       └── schemas/
│           ├── event.schema.ts, reward.schema.ts, condition.schema.ts, reward-history.schema.ts, item-meta.schema.ts
└── libs/
    └── common/
        └── enums/
            ├── role.enum.ts, reward-type.enum.ts, event-category.enum.ts, ...
```

---

## 🐳 Docker Compose 예시
```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:latest
    container_name: mongodb
    restart: always
    ports:
      - 27017:27017
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: password
      MONGO_INITDB_DATABASE: event_reward_system
    volumes:
      - mongodb_data:/data/db
    networks:
      - app-network

  mongo-express:
    image: mongo-express:latest
    container_name: mongo-express
    restart: always
    ports:
      - 8081:8081
    environment:
      ME_CONFIG_MONGODB_ADMINUSERNAME: root
      ME_CONFIG_MONGODB_ADMINPASSWORD: password
      ME_CONFIG_MONGODB_URL: mongodb://root:password@mongodb:27017/
      ME_CONFIG_BASICAUTH_USERNAME: admin
      ME_CONFIG_BASICAUTH_PASSWORD: yourpassword
    depends_on:
      - mongodb
    networks:
      - app-network

  auth:
    build:
      context: ./auth
      dockerfile: Dockerfile
    container_name: auth-service
    restart: always
    ports:
      - 3001:3001
    environment:
      - NODE_ENV=development
      - PORT=3001
      - MONGODB_URI=mongodb://root:password@mongodb:27017/auth
    depends_on:
      - mongodb
    networks:
      - app-network

  event:
    build:
      context: ./event
      dockerfile: Dockerfile
    container_name: event-service
    restart: always
    ports:
      - 3002:3002
    environment:
      - NODE_ENV=development
      - PORT=3002
      - MONGODB_URI=mongodb://root:password@mongodb:27017/event
    depends_on:
      - mongodb
    networks:
      - app-network

  gateway:
    build:
      context: ./gateway
      dockerfile: Dockerfile
    container_name: gateway-service
    restart: always
    ports:
      - 3000:3000
    environment:
      - NODE_ENV=development
      - PORT=3000
      - AUTH_SERVICE_URL=http://auth-service:3001
      - EVENT_SERVICE_URL=http://event-service:3002
    depends_on:
      - auth
      - event
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  mongodb_data:
```

---

## 🎯 시스템 개념 및 데이터 구조

### 1. User
- 조건 판단, 이벤트 검증: lastLoginAt, loginCount, invitedBy, loginDays 등 포함
```typescript
{
  userId: string,
  email: string,
  nickName: string,
  password: string,
  role: 'USER' | 'OPERATOR' | 'AUDITOR' | 'ADMIN',
  isBlocked: boolean,
  lastLoginAt: Date,
  loginCount: number,
  invitedBy?: string,
  loginDays: number,
  createdAt: Date,
  updatedAt: Date,
}
```

### 2. Event
```typescript
{
    eventId: string;
    title: string;
    category: EventCategory;
    conditionIds: string[]; // or ObjectId[]
    rewardIds: string[];    // or ObjectId[]
    trigger: 'manual' | 'auto';
    deliveryType: 'manual_claim' | 'immediate' | 'scheduled';
    startAt: Date;
    endAt: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

```
#### 🧩 설계 포인트
- 조건/보상은 배열로 구성되어 다양한 이벤트 구성 가능
- conditionIds / rewardIds는 참조 ID 기반 관계형 구조로 구성됨 (MongoDB populate 사용)
- trigger와 deliveryType은 시점과 방식 분리 설계로 정책 유연성 확보
- startAt ~ endAt으로 유효 기간 필터링 가능
- isActive 플래그로 운영자가 이벤트 활성화 제어 가능

#### 📌 핵심 개념

| 요소                | 설명                         |
| ----------------- | -------------------------- |
| `conditions`      | 조건 객체 배열, 이벤트 수행 조건 정의     |
| `rewards`         | 보상 객체 배열, 지급 대상 구성         |
| `trigger`         | 조건 만족 시점 or 유저 수동 요청 여부 결정 |
| `deliveryType`    | 지급 확정 후 유저에게 전달 방식 결정      |
| `startAt / endAt` | 이벤트 유효 기간                  |
| `isActive`        | 관리자에 의한 수동 활성화 여부          |


| 속성             | 의미             | 담당 시점               | 예시                                                                      |
| -------------- | -------------- | ------------------- | ----------------------------------------------------------------------- |
| `trigger`      | 지급 여부를 결정하는 시점 | 조건 만족 시 or 유저 수동 요청 | `manual` (출석 보상), `auto` (친구 초대)                                        |
| `deliveryType` | 지급 방식 (전달 방법)  | 지급 결정 이후            | `manual_claim` (우편함 수령), `immediate` (즉시 지급), `scheduled` (이벤트 종료 후 지급) |



##### trigger
> 언제 보상을 지급할지 결정하는 기준

- manual: 유저가 직접 "보상 받기"를 눌러야 함
- auto: 조건 만족 시 시스템이 자동으로 지급 판단

##### deliveryType
> 어떻게 보상을 유저에게 전달할지 방식

- manual_claim: 우편함 등에 저장 → 유저가 직접 수령
- immediate: 조건 충족 시 즉시 인벤토리로 지급
- scheduled: 이벤트 종료 후 일괄 지급


##### 이벤트 category
- 출석 이벤트 (attendance)
- 친구 초대 이벤트 (social)
- 플레이 시간 이벤트 (playtime)
- 미션 완료 (mission)
- 소비/수집 이벤트 (economy)
- 복귀 유저 (special)


### 3. Condition
```typescript
{
    category: 'attendance' | 'social' | 'economy' | 'mission' | 'special',
    subType: string,         // 예: 'total_days', 'invite_success' 등
    target?: string,         // 기준값 (예: '3', 'item-001') 수량, 아이템 아이디
    description?: string,    // 조건 설명
    createdAt: Date,
    updatedAt: Date,
}

```

#### 조건 data
![img.png](img.png)

#### 예시 JSON
```json
{
  "conditions": [
    {
      "id": "682bd9b81c36e24fa6592207",
      "category": "attendance",
      "subType": "total_days",
      "target": 3,
      "description": "3일 연속 출석 시 보상 지급"
    },
    {
      "id": "682bd9c91c36e24fa6592209",
      "category": "attendance",
      "subType": "after_signup",
      "target": 7,
      "description": "가입 후 7일 이내 출석"
    },
    {
      "id": "682bd9de1c36e24fa659220b",
      "category": "social",
      "subType": "invite_success",
      "description": "친구 초대"
    },
    {
      "id": "682bda031c36e24fa659220d",
      "category": "economy",
      "subType": "meso_spent",
      "target": 20000,
      "description": "메소 사용량"
    },
    {
      "id": "682bda131c36e24fa659220f",
      "category": "economy",
      "subType": "cash_topup",
      "target": 20000,
      "description": "캐시 충전"
    },
    {
      "id": "682bda391c36e24fa6592211",
      "category": "economy",
      "subType": "item_collect",
      "target": "itemId",
      "description": "특정 아이템 보유"
    },
    {
      "id": "682bda551c36e24fa6592213",
      "category": "mission",
      "subType": "quest_clear",
      "target": "questId",
      "description": "특정 퀘스트 클리어"
    },
    {
      "id": "682bda851c36e24fa6592215",
      "category": "special",
      "subType": "return_after_days",
      "description": "복귀 유저 조건"
    }
  ],
  "total": 8
}

```



### 4. Reward
```typescript
{
  type: 'item' | 'meso' | 'mPoint',
  quantity: number,
  itemId?: string, // type === 'item'인 경우 필수
  description: string,
  createdAt: Date,
  updatedAt: Date,
}
```
#### 예시 JSON
```json
[
  {
    "id": "682be8b07ff66e961cf44a8d",
    "type": "item",
    "quantity": 1,
    "itemId": "60d21b4667d0d8992e610c85",
    "description": "레어 아이템 보상"
  },
  {
    "id": "682be9d17ff66e961cf44a9e",
    "type": "meso",
    "quantity": 10000,
    "description": "메소 10000"
  },
  {
    "id": "682bea127ff66e961cf44aa0",
    "type": "mPoint",
    "quantity": 20000,
    "description": "포인트 20000"
  }
]

```

### 5. UserEventRewardRequest (보상 요청 기록)
```typescript
{
    userId: string,
    eventId: string,
    trigger: 'manual' | 'auto',
    deliveryType: 'manual_claim' | 'immediate' | 'scheduled',
    rewardSnapshot: {
    type: 'item' | 'meso' | 'mPoint',
        quantity: number,
        itemId?: string,
        description?: string
    },
    status: 'pending' | 'success' | 'failed',
    requestedAt?: Date,
    reason?: string,
    createdAt: Date,
    updatedAt: Date
}

```
#### 🧠 설계 포인트
- **스냅샷 구조(rewardSnapshot)** 로 당시 보상 정보를 정적으로 보존 → 후속 변경 영향 없음
- status 필드를 통해 요청 진행 상태 추적 가능
- 중복 요청 방지 인덱스 설정: userId + eventId 조합은 한 번만 요청 가능

#### 예시
```json
{
  "userId": "user-001",
  "eventId": "event-123",
  "trigger": "manual",
  "deliveryType": "manual_claim",
  "rewardSnapshot": {
    "type": "item",
    "quantity": 1,
    "itemId": "item-abc",
    "description": "레어 장비 상자"
  },
  "status": "pending",
  "requestedAt": "2025-05-20T03:00:00Z"
}

```


### 6. EventRewardHistory (실제 지급 내역)
```typescript
{
    userId: string,
    eventId: string,
    rewardId: string,
    quantity: number,
    itemId?: string,
    requestedAt?: Date,
    deliveredAt: Date,
    createdAt: Date,
    updatedAt: Date
}

```
#### 🧾 필드 설명
| 필드명                      | 설명                         |
| ------------------------ | -------------------------- |
| `userId`                 | 보상을 받은 유저의 식별자             |
| `eventId`                | 관련 이벤트 ID                  |
| `rewardId`               | 지급된 보상의 ID                 |
| `quantity`               | 지급 수량                      |
| `itemId`                 | 아이템 타입일 경우 아이템 ID          |
| `requestedAt`            | 유저가 요청한 시점 (수동 수령일 경우만 존재) |
| `deliveredAt`            | 실제 지급된 시간 (모든 보상 공통)       |
| `createdAt`, `updatedAt` | 문서 생성 및 수정 시간 (자동)         |

#### 🔒 인덱스 구성
| 인덱스                   | 용도                   |
| --------------------- | -------------------- |
| `{ userId, eventId }` | 유저별 지급 내역 조회 최적화     |
| `{ deliveredAt }`     | 지급 시간 기준 통계 / 정렬에 활용 |


#### 🧠 설계 포인트
- UserEventRewardRequest.status === 'success'일 때 생성됨
- 오직 성공 지급 기록만 보관 → 감사/정산/통계 목적에 최적화
- 실패/요청 이력은 UserEventRewardRequest에서 관리됨
- 운영자 및 AUDITOR 권한만 접근 가능

#### 예시
```json
{
  "userId": "user-123",
  "eventId": "event-001",
  "rewardId": "reward-abc123",
  "quantity": 1,
  "itemId": "item-001",
  "requestedAt": "2025-01-01T12:00:00Z",
  "deliveredAt": "2025-01-01T12:01:30Z"
}

```

### 7. ItemMeta(설계 완료, 미구현)
```typescript
{
    itemId: string,            // 아이템 고유 식별자
    name: string,              // 아이템 이름
    itemCategory: string,      // equipment | consumable | install | etc | cash
    tradable: boolean,         // 거래 가능 여부
    source: string,            // 획득처 설명 (e.g. 퀘스트, 상점, 제작 등)
    rarity: string,            // 희귀도 (e.g. common, rare, epic)
    createdAt: Date,
    updatedAt: Date
}

```
### 📦 아이템 분류 (itemCategory)
| 코드           | 이름  | 예시         | 설명            |
| ------------ | --- | ---------- | ------------- |
| `equipment`  | 장비  | 무기, 모자, 망토 | 착용 가능, 강화 대상  |
| `consumable` | 소비  | 물약, 경험치 쿠폰 | 사용 시 소모됨      |
| `install`    | 설치  | 의자, 칭호     | 설치 탭에 존재      |
| `etc`        | 기타  | 퀘스트 아이템    | 교환 불가, 특수 용도  |
| `cash`       | 캐시템 | 캐시 의상, 펫   | 캐시샵 구매 전용 아이템 |

#### 🧠 설계 포인트
- Reward.type === 'item'일 경우 itemId의 유효성 검증에 사용
- 인벤토리 화면, 필터링, 보상 UI 구성 등에 활용
- 향후 rarity, tradable 등으로 필터/정렬/가치 분석 기능 확장 가능
- itemCategory 기반으로 탭 구성, UI 정렬, 보상 정책 제한 등에 활용 가능
---

## 🔐 인증 및 권한
- USER: 이벤트 조회 및 보상 요청
- OPERATOR: 이벤트/조건/보상 등록, 유저 요청 허가
- ADMIN: 모든 기능 접근
- AUDITOR: 보상 지급 내역 열람만 가능

---

## 📮 API 명세서 (주요)

### Gateway Server
- 모든 요청: JWT 인증 및 역할(Role) 검사 후 Auth/Event 서버로 proxy

### Auth Server
- POST /auth/login: 유저 로그인, JWT 발급
- GET /auth/me: JWT 기반 유저 정보 조회
- POST /auth/signup: 유저 등록 (선택 구현)

### Event Server
- POST /events: 이벤트 등록 (OPERATOR 이상)
- GET /events: 이벤트 전체 목록 조회
- GET /events/:id: 이벤트 상세 조회
- POST /events/:eventId/rewards/:rewardId: 이벤트에 보상 연결
- POST /rewards: 보상 등록 (OPERATOR 이상)
- GET /rewards: 전체 보상 목록
- GET /rewards/:id: 단일 보상 상세
- POST /events/:id/claim: 유저가 이벤트에 대한 보상 요청
- GET /users/me/rewards: 유저 본인 요청 이력
- GET /admin/rewards: 전체 보상 이력 (ADMIN, AUDITOR)
- GET /admin/rewards?eventId=...&status=...: 조건별 필터링 (선택)

---

## 📦 Enum 구조 (libs/common/enums)
- role.enum.ts
- event-category.enum.ts
- condition-subtype.enum.ts
- trigger-type.enum.ts
- reward-delivery-type.enum.ts
- reward-type.enum.ts
- item-category.enum.ts
- reward-status.enum.ts

### 예시
```typescript
// role.enum.ts
export enum Role { USER = 'USER', OPERATOR = 'OPERATOR', AUDITOR = 'AUDITOR', ADMIN = 'ADMIN' }

// event-category.enum.ts
export enum EventCategory { ATTENDANCE = 'attendance', SOCIAL = 'social', ECONOMY = 'economy', MISSION = 'mission', SPECIAL = 'special' }

// condition-subtype.enum.ts
export enum ConditionSubType { TOTAL_DAYS = 'total_days', AFTER_SIGNUP = 'after_signup', INVITE_SUCCESS = 'invite_success', MESO_SPENT = 'meso_spent', CASH_TOPUP = 'cash_topup', ITEM_COLLECT = 'item_collect', QUEST_CLEAR = 'quest_clear', RETURN_AFTER_DAYS = 'return_after_days' }

// trigger-type.enum.ts
export enum TriggerType { MANUAL = 'manual', AUTO = 'auto' }

// reward-delivery-type.enum.ts
export enum RewardDeliveryType { IMMEDIATE = 'immediate', MANUAL_CLAIM = 'manual_claim', SCHEDULED = 'scheduled' }

// reward-type.enum.ts
export enum RewardType { ITEM = 'item', MESO = 'meso', MPOINT = 'mPoint' }

// item-category.enum.ts
export enum ItemCategory { EQUIPMENT = 'equipment', CONSUMABLE = 'consumable', INSTALL = 'install', ETC = 'etc', CASH = 'cash' }

// reward-status.enum.ts
export enum RewardStatus { PENDING = 'pending', SUCCESS = 'success', FAILED = 'failed' }
```

---

## ✅ 추천 실행 순서
1. NestJS 프로젝트 3개 생성 (nest new gateway, auth, event)
2. 각 프로젝트 공통 설정 (CORS, JWT 등)
3. 각 서버 main.ts에 PORT 및 prefix 세팅
4. Gateway → HttpModule로 proxy 준비
5. Auth → JWT 로그인, /auth/login 구현
6. Event → Mongo 연결, /events, /rewards 등부터 작업

---

## 💡 기타 참고
- Postman 테스트 시나리오, Mongo 모델, DTO, Guard, Proxy 등은 각 서버별로 추가 구현 가능
- 각 서버/컴포넌트별 템플릿, 예시 코드는 실제 구현에서 참고

---

본 README는 최신 요구사항 및 설계 기준에 맞춰 작성되었습니다.
