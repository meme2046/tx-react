import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { fetchData } from "./makeData.ts";
import type { IArweaveDataList, StrategyTx } from "@/types";

export const useFakerInfinite = (fetchSize: number) => {
  return useInfiniteQuery<IArweaveDataList<StrategyTx>>({
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
