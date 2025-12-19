import { upperCase } from "lodash";
import { effective } from "../../utils";
import { Card, CardContent } from "../ui/card";
import { badgeVariants } from "../ui/badge";
import type { CoingeckoCoinsMarketsItem } from "@/types";

interface CoingeckoItemProps {
	item: CoingeckoCoinsMarketsItem;
}

export function CoingeckoItem({ item }: CoingeckoItemProps) {
	const change = item.price_change_percentage_24h;

	return (
		<Card className="cursor-pointer min-w-24 overflow-hidden transition-all duration-300 hover:shadow-md">
			<CardContent className="p-2 flex flex-col items-center">
				<img
					src={item.image}
					alt={item.symbol}
					className="size-10 rounded-full"
				/>
				<span>{upperCase(item.symbol)}</span>

				<span className="text-xs underline">
					{effective(item.current_price.toString())}
				</span>
				<span
					className={badgeVariants({
						variant: `${change >= 0 ? "default" : "destructive"}`,
					})}
				>
					{change.toFixed(3)}%
				</span>
			</CardContent>
		</Card>
	);
}
