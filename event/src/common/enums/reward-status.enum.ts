export enum RewardStatus {
  PENDING = 'pending',   // 조건 만족했지만 아직 지급되지 않음
  SUCCESS = 'success',   // 정상 지급 완료
  FAILED = 'failed'      // 조건 미충족, 지급 오류, 중복 등
}
