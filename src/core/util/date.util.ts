import * as dayjs from 'dayjs';

export function formatDateOnly(date: Date): number {
  return Number(dayjs(date).format('YYYYMMDD'));
}
