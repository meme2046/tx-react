import type { ArweaveData } from "./IArweave.ts";

export interface IGridTx extends ArweaveData {
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
