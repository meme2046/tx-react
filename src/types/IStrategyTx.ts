import type { IArweaveData } from "./IArweave";

export interface IStrategyTx extends IArweaveData {
	cex: string;
	closeUnix?: number;
	coin: string;
	futuresClosePx?: number;
	futuresCloseUsdt?: number;
	futuresOpenPx: number;
	futuresOpenUsdt: number;
	futuresPositionSide: string;
	id: string;
	nodeId: string;
	openUnix: number;
	pnl?: number;
	pnlRatio?: number;
	spotClosePx?: number;
	spotCloseUsdt?: number;
	spotOpenPx: number;
	spotOpenUsdt: number;
}
