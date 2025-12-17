import { COIN_SRC } from "../../consts";
import { upperCase } from "lodash";
import { effective } from "../../utils";
import { Card, CardContent } from "../ui/card";
import { badgeVariants } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import type { ITicker } from "@/types";

interface CoinInfoProps {
	symbol: string;
	spotTickers: ITicker[];
	mixTickers: ITicker[];
}

export function CoinInfo({ symbol, spotTickers, mixTickers }: CoinInfoProps) {
	let ticker = spotTickers.find(
		(t) => t.symbol.toLowerCase() === `${symbol}usdt`,
	);
	if (!ticker) {
		ticker = mixTickers.find((t) => t.symbol.toLowerCase() === `${symbol}usdt`);
	}
	const change = Number(ticker?.changeUtc24h) * 100;

	return (
		<Card className="cursor-pointer min-w-24 overflow-hidden transition-all duration-300 hover:shadow-md">
			<CardContent className="p-2 flex flex-col items-center">
				<img
					src={COIN_SRC[symbol.toLowerCase()]}
					alt={symbol}
					className="w-10 h-10 rounded-full"
				/>
				<span>{upperCase(symbol)}</span>

				{ticker ? (
					<>
						<span className="text-xs underline">
							{effective(ticker?.lastPr)}
						</span>
						<span
							className={badgeVariants({
								variant: `${Number(change) >= 0 ? "default" : "destructive"}`,
							})}
						>
							{change.toFixed(2)}%
						</span>
					</>
				) : (
					<>
						<Skeleton className="w-20 h-4" />
						<Skeleton className="w-12 h-4 mt-1" />
					</>
				)}
			</CardContent>
		</Card>
	);
}
