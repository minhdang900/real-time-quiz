import { DocTypeCode, QueueSiKind, WebAgentSiKind } from 'src/shared/enum';
import { formatDateOnly } from './date.util';

export function getSeqFromQueueNumber(queueNumber: string): number {
  return Number(queueNumber.split('-')?.[2]);
}

export function generateDocQueueNumber(bookingNumber: string, siReceivedAt: Date, seq: number): string {
  return `${bookingNumber}-${formatDateOnly(siReceivedAt)}-${seq}`;
}

export function getOdsTableName(odsTableName: string): string {
  const parts = odsTableName.split('.');
  const tableName = parts[parts.length - 1]?.toUpperCase();
  return tableName;
}

export const VALID_TYPE_CODE = [DocTypeCode.F, DocTypeCode.U, DocTypeCode.S];

export function odsStringToBoolean(flag: string): boolean {
  return flag === 'Y';
}

// true: not yet setup time off/weekend
// false: already setup time off/weekend
export function isNotSetupTimeOffWeekend(dailyTimeOffFrom: string, dailyTimeOffTo: string): boolean {
  return dailyTimeOffFrom === '-1' && dailyTimeOffTo === '-1';
}

export function mapWebAgentSiKindToQueueSiKind(rawSiKind: string): QueueSiKind {
  const webAgentSiKindMap = new Map<string, QueueSiKind>([
    [WebAgentSiKind.O, QueueSiKind.ORIGINAL],
    [WebAgentSiKind.A, QueueSiKind.AMEND],
    [WebAgentSiKind.B, QueueSiKind.BL_CONFIRM],
    [WebAgentSiKind.M, QueueSiKind.COMBINE],
    [WebAgentSiKind.S, QueueSiKind.SPLIT],
    [WebAgentSiKind.K, QueueSiKind.RETURN_BACK_FROM_CUSTOMER],
    [WebAgentSiKind.T, QueueSiKind.ATTACHMENT],
    [WebAgentSiKind.G, QueueSiKind.DG_ATTACHMENT],
    [WebAgentSiKind.P, QueueSiKind.EL_ATTACHMENT],
  ]);

  return webAgentSiKindMap.get(rawSiKind) || null;
}
