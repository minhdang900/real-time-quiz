import { MAX_PAGE_SIZE, MIN_PAGE_NUMBER, MIN_PAGE_SIZE } from 'src/shared/constant';

export function validatePageNumber(pageNumber: number): number {
  return Math.max(pageNumber, MIN_PAGE_NUMBER);
}

export function validatePageSize(pageSize: number): number {
  return pageSize >= MIN_PAGE_SIZE && pageSize <= MAX_PAGE_SIZE ? pageSize : MIN_PAGE_SIZE;
}

export function convertToOffset(pageNumber: number, pageSize: number): number {
  return (pageNumber - 1) * pageSize;
}
