import {
	keepPreviousData,
	useInfiniteQuery,
	useQuery,
} from "@tanstack/react-query";
import { useSnapshot } from "valtio";
import { http } from "../../utils";
import { storePersist } from "@/lib/valtio";
import type { ICronLogList } from "@/types";

export const useLog = (params: {
	name?: string;
	limit?: number;
	skip?: number;
}) => {
	const { cronUrl } = useSnapshot(storePersist);
	return useQuery<ICronLogList>({
		queryKey: ["cron-log", params, cronUrl],
		queryFn: () => {
			return http(`${cronUrl}/cron/log`, { d2: true, params });
		},
	});
};

export const useLogInfinite = (pageSize: number) => {
	const { cronUrl } = useSnapshot(storePersist);

	return useInfiniteQuery<ICronLogList>({
		queryKey: ["cron-log-infinite", pageSize, cronUrl],
		queryFn: async ({ pageParam }) => {
			const cursor = pageParam as number;
			const resp = await http<ICronLogList>(
				`${cronUrl}/api/v1/mongo/logs`,
				{
					params: { page: cursor, page_size: pageSize },
				}
			);

			const len = resp.items.length;
			if (len > 0) {
				resp.nextCursor = cursor + 1;
			}

			return resp;
		},
		initialPageParam: 1,
		getNextPageParam: (lastPage) => lastPage.nextCursor,
		refetchOnWindowFocus: false,
		placeholderData: keepPreviousData,
	});
};
