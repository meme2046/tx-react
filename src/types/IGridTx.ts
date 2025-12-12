import type { IArweaveData } from "./IArweave.ts";

export interface IGridTx extends IArweaveData {
	benefit?: number;
	buyPx?: number;
	cex: string;
	closeUnix?: number;
	coin: string;
	cost?: number;
	id: string;
	nodeId: string;
	openUnix: number;
	profit?: number;
	qty: number;
	sellPx?: number;
}
