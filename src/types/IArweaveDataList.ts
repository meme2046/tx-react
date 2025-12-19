import type { IArweaveData } from "./IArweave";

export interface IArweaveDataList<T extends IArweaveData> {
	list: T[];
	prevCursor?: string;
	nextCursor?: string;
}
