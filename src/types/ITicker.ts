export interface ITicker {
	symbol: string;
	high24h: string;
	open: string;
	low24h: string;
	lastPr: string;
	quoteVolume: string;
	baseVolume: string;
	usdtVolume: string;
	bidPr: string;
	askPr: string;
	bidSz: string;
	askSz: string;
	openUtc: string;
	ts: string;
	changeUtc24h: string;
	change24h: string;
	indexPrice: string;
	fundingRate: string;
	holdingAmount: string;
	deliveryStartTime?: string;
	deliveryTime?: string;
	deliveryStatus: string;
	open24h: string;
}
