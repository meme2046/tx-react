import { useQuery } from "@tanstack/react-query";
import { http } from "../../utils";
import type { ITicker } from "@/types";

export function useBitgetMixTickers() {
	return useQuery<ITicker[]>({
		queryKey: ["bitget-mix-tickers"],
		queryFn: () => {
			return http("https://api.bitget.com/api/v2/mix/market/tickers", {
				method: "GET",
				params: { productType: "USDT-FUTURES" },
				d2: true,
			});
		},
	});
}
