import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { fetchData } from "./makeData.ts";
import type { IStrategyTx } from "@/types/IStrategyTx.ts";
import type { IArweaveDataList } from "@/types/IArweave.ts";

export const useFakerInfinite = (fetchSize: number) => {
	return useInfiniteQuery<IArweaveDataList<IStrategyTx>>({
		queryKey: ["faker-arweave-tx-infinite"],
		queryFn: async ({ pageParam = 0 }) => {
			return await fetchData(fetchSize, (pageParam as number).toString());
		},
		initialPageParam: 0,
		getNextPageParam: (lastPage) => lastPage.nextCursor,
		refetchOnWindowFocus: false,
		placeholderData: keepPreviousData,
	});
};
