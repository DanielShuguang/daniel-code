export enum TimeUtils {
  MILLISECOND = 1,
  SECOND = 1000 * TimeUtils.MILLISECOND,
  MINUTE = 60 * TimeUtils.SECOND,
  HOUR = 60 * TimeUtils.MINUTE,
  DAY = 24 * TimeUtils.HOUR,
  WEEK = 7 * TimeUtils.DAY
}
