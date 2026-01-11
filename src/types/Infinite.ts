export interface InfiniteList<T extends object> {
  list: T[];
  prevCursor?: string;
  nextCursor?: string;
}
