import { useQuery } from "@tanstack/react-query";
import { http } from "../../utils";
import type { IFearGreed } from "@/types";

export const useFearGreed = () => {
	return useQuery<IFearGreed>({
		queryKey: ["fear-greed"],
		queryFn: () => {
			return http("https://api.coin-stats.com/v2/fear-greed");
		},
	});
};
