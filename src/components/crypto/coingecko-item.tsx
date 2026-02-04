import { upperCase } from "lodash";
import { effective } from "../../utils";
import { Card, CardContent } from "../ui/card";
import type { CoingeckoMarketsItem } from "@/types/CoingeckoCoin";

interface CoingeckoItemProps {
  item: CoingeckoMarketsItem;
}

export function CoingeckoItem({ item }: CoingeckoItemProps) {
  const change = item.price_change_percentage_24h;

  return (
    <Card className="p-0 cursor-pointer overflow-hidden">
      <CardContent className="py-1 px-3 flex flex-col items-center">
        <img
          src={item.image}
          alt={item.symbol}
          className="size-10 rounded-full"
        />
        <span>{upperCase(item.symbol)}</span>

        <span className="text-xs underline">
          {effective(item.current_price.toString())}
        </span>
        {/* <span
					className={badgeVariants({
						variant: `${change >= 0 ? "default" : "destructive"}`,
					})}
				> */}
        <span
          className={`text-sm rounded-full px-1 shadow-xl ${change >= 0 ? "bg-lime-600" : "bg-rose-400"}`}
        >
          {change.toFixed(3)}%
        </span>
      </CardContent>
    </Card>
  );
}
