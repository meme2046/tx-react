import type { GetBanner } from "@/types/IGushitong";
import { http } from "@/utils";
import { useQuery } from "@tanstack/react-query";

export const useBanner = (market: string) => {
	return useQuery<GetBanner>({
		queryKey: ["gushitong-getbanner"],
		queryFn: () => {
			return http("https://finance.pae.baidu.com/api/getbanner", {
				params: { market: market },
			});
		},
		refetchOnWindowFocus: false,
		refetchInterval: 60 * 1000,
		refetchIntervalInBackground: false,
	});
};
