import { useQuery } from "@tanstack/react-query";
import { http } from "../../utils";
import type { FearGreed } from "@/types/FearGreed";

export const useFearGreed = () => {
  return useQuery<FearGreed>({
    queryKey: ["fear-greed"],
    queryFn: () => {
      return http("https://api.coin-stats.com/v2/fear-greed");
    },
    refetchOnWindowFocus: false,
    refetchInterval: 60 * 1000,
  });
};
