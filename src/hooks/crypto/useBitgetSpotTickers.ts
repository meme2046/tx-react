import { useQuery } from "@tanstack/react-query";
import { http } from "../../utils";
import type { ITicker } from "@/types";

export function useBitgetSpotTickers() {
	return useQuery<ITicker[]>({
		queryKey: ["bitget-spot-tickers"],
		queryFn: () => {
			return http("https://api.bitget.com/api/v2/spot/market/tickers", {
				d2: true,
			});
		},
	});
}
