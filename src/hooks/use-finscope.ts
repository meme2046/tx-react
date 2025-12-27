import { store } from "@/lib/valtio";
import type { IAU888 } from "@/types/IBaidu";
import { http } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { useSnapshot } from "valtio";

export const useFinAU888 = <T extends object>(
	key: string,
	fileName: string,
) => {
	const { baiduGushitongURL } = useSnapshot(store);

	return useQuery<IAU888>({
		queryKey: ["fear-greed"],
		queryFn: () => {
			return http(baiduGushitongURL, { params: {}, data: {} });
		},
		refetchOnWindowFocus: false,
		refetchInterval: 60 * 1000,
	});
};
