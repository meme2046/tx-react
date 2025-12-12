export interface IGrid {
	created_at: string;
	name: string;
	act_name: string;
	symbol: string;
	qty: number;
	cex: string;
	status: string;
	up_status: number;
	path: string;
	level: number;
	earn: number;
	cost: number;
	buy_px: number;
	benefit: number;
	sell_px: number;
	profit: number;
	order_id: string;
	client_order_id: string;
	fx_order_id: string;
	fx_client_order_id: string;
	open_at: string;
	close_at: string;
	chain?: string;
}
