import type { ArweaveData } from "./IArweave";

export interface IArweaveDataList<T extends ArweaveData> {
  list: T[];
  prevCursor?: string;
  nextCursor?: string;
}
