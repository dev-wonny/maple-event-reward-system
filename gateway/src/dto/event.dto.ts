import { IsArray, IsBoolean, IsDate, IsEnum, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export enum DeliveryType {
  IMMEDIATE = 'immediate',
  MANUAL_CLAIM = 'manual_claim',
  SCHEDULED = 'scheduled'
}

export enum TriggerType {
  MANUAL = 'manual',
  AUTO = 'auto'
}

export enum RewardStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed'
}

export class CreateEventDto {
  @IsString({ message: '이벤트 ID는 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '이벤트 ID는 필수 입력 항목입니다.' })
  eventId: string;

  @IsString({ message: '이벤트 이름은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '이벤트 이름은 필수 입력 항목입니다.' })
  name: string;

  @IsString({ message: '이벤트 설명은 문자열이어야 합니다.' })
  @IsOptional()
  description?: string;

  @IsString({ message: '조건 ID는 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '조건 ID는 필수 입력 항목입니다.' })
  conditionId: string;

  @IsArray({ message: '보상 ID 목록은 배열이어야 합니다.' })
  @IsNotEmpty({ message: '보상 ID 목록은 필수 입력 항목입니다.' })
  rewardIds: string[];

  @IsBoolean({ message: '활성화 여부는 불리언 값이어야 합니다.' })
  @IsOptional()
  isActive?: boolean;

  @IsDate({ message: '시작 시간은 날짜 형식이어야 합니다.' })
  @IsOptional()
  startAt?: Date;

  @IsDate({ message: '종료 시간은 날짜 형식이어야 합니다.' })
  @IsOptional()
  endAt?: Date;
}

export class UpdateEventDto {
  @IsString({ message: '이벤트 이름은 문자열이어야 합니다.' })
  @IsOptional()
  name?: string;

  @IsString({ message: '이벤트 설명은 문자열이어야 합니다.' })
  @IsOptional()
  description?: string;

  @IsString({ message: '조건 ID는 문자열이어야 합니다.' })
  @IsOptional()
  conditionId?: string;

  @IsArray({ message: '보상 ID 목록은 배열이어야 합니다.' })
  @IsOptional()
  rewardIds?: string[];

  @IsBoolean({ message: '활성화 여부는 불리언 값이어야 합니다.' })
  @IsOptional()
  isActive?: boolean;

  @IsDate({ message: '시작 시간은 날짜 형식이어야 합니다.' })
  @IsOptional()
  startAt?: Date;

  @IsDate({ message: '종료 시간은 날짜 형식이어야 합니다.' })
  @IsOptional()
  endAt?: Date;
}

export class CreateUserEventRewardRequestDto {
  @IsString({ message: '유저 ID는 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '유저 ID는 필수 입력 항목입니다.' })
  userId: string;

  @IsString({ message: '이벤트 ID는 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '이벤트 ID는 필수 입력 항목입니다.' })
  eventId: string;

  @IsString({ message: '보상 ID는 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '보상 ID는 필수 입력 항목입니다.' })
  rewardId: string;

  @IsEnum(TriggerType, { message: '유효한 트리거 타입이 아닙니다.' })
  @IsNotEmpty({ message: '트리거 타입은 필수 입력 항목입니다.' })
  trigger: TriggerType;

  @IsEnum(DeliveryType, { message: '유효한 전달 타입이 아닙니다.' })
  @IsNotEmpty({ message: '전달 타입은 필수 입력 항목입니다.' })
  deliveryType: DeliveryType;

  @IsDate({ message: '요청 시간은 날짜 형식이어야 합니다.' })
  @IsOptional()
  requestedAt?: Date;
}

export class EventResponseDto {
  @IsString()
  eventId: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  conditionId: string;

  @IsArray()
  rewardIds: string[];

  @IsBoolean()
  isActive: boolean;

  @IsString()
  @IsOptional()
  startAt?: string;

  @IsString()
  @IsOptional()
  endAt?: string;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;
}

export class UserEventRewardRequestResponseDto {
  @IsString()
  id: string;

  @IsString()
  userId: string;

  @IsString()
  eventId: string;

  @IsString()
  rewardId: string;

  @IsEnum(TriggerType)
  trigger: TriggerType;

  @IsEnum(DeliveryType)
  deliveryType: DeliveryType;

  @IsObject()
  rewardSnapshot: any;

  @IsEnum(RewardStatus)
  status: RewardStatus;

  @IsString()
  requestedAt: string;

  @IsString()
  @IsOptional()
  reason?: string;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;
}
