import { useQuery } from "@tanstack/react-query";
import { http } from "../../utils";
import type { CoingeckoCoinsMarketsItem, IKV } from "@/types";

export function useCoingeckoCoinsMarkets(coinList: string[]) {
	return useQuery<CoingeckoCoinsMarketsItem[]>({
		queryKey: ["coingecko-coins-markets", coinList.length],
		queryFn: () => {
			if (!coinList.length) {
				return [];
			}

			return http("https://api.coingecko.com/api/v3/coins/markets", {
				headers: {
					"Content-Type": "application/json",
				},
				params: {
					vs_currency: "usd",
					order: "price_change_percentage_24h_desc",
					ids: coinList.join(","),
				},
			});
		},
		// refetchOnWindowFocus: false,
		// refetchInterval: 60 * 1000,
		// refetchIntervalInBackground: true,
	});
}

export function useCoinsFromGithub() {
	return useQuery<IKV[]>({
		queryKey: ["coingecko-coins-github"],
		queryFn: () => {
			return http(
				"https://raw.githubusercontent.com/txnj/data/refs/heads/main/coingecko.json",
				{
					headers: {
						"Content-Type": "application/json",
					},
				},
			);
		},
	});
}
