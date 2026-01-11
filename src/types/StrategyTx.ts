import type { ArweaveData } from "./IArweave";

export interface StrategyTx extends ArweaveData {
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
