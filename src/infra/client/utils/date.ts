import * as dayjs from 'dayjs';

// Format as "yyyymmddHHmm"
export function formatDateDaylightSavingTime(date: Date): number {
  return Number.parseInt(dayjs(date).format('YYYYMMDDHHmm'));
}
