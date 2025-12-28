import type { GetBanner } from "@/types/IGushitong";
import { http } from "@/utils";
import { useQuery } from "@tanstack/react-query";

export const useBanner = (market: string) => {
	return useQuery<GetBanner>({
		queryKey: ["gushitong-getbanner"],
		queryFn: () => {
			return http<GetBanner>(
				"https://meme.us.kg:8888/proxy/finance.pae.baidu.com/api/getbanner",
				{
					params: { market: market },
				},
			).then((d) => {
				if (d.ResultCode !== "0") {
					throw new Error(`ResultCode:${d.ResultCode}, is not success`);
				}
				return d;
			});
		},
		refetchOnWindowFocus: false,
		refetchInterval: 60 * 1000,
		refetchIntervalInBackground: false,
	});
};
