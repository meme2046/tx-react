import { useQuery } from "@tanstack/react-query";
import { http } from "../../utils";
import { useSnapshot } from "valtio";
import { store } from "@/lib/valtio";
import type { CoingeckoMarketsItem } from "@/types/CoingeckoCoin";
import type { KV } from "@/types/KV";

export function useCoingeckoCoinsMarkets(coinList: string[]) {
  return useQuery<CoingeckoMarketsItem[]>({
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
    refetchOnWindowFocus: false,
    refetchInterval: 60 * 1000,
    refetchIntervalInBackground: true,
  });
}

export function useCoinsFromGithub() {
  const { githubDataURL } = useSnapshot(store);
  return useQuery<KV[]>({
    queryKey: ["coingecko-coins-github"],
    queryFn: () => {
      return http(`${githubDataURL}/coingecko.json`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    refetchOnWindowFocus: false,
    refetchInterval: 60 * 1000,
  });
}
