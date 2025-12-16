import { useQuery } from "@tanstack/react-query";
import { useSnapshot } from "valtio";
import { http } from "../../utils";
import type { IEtcd } from "@/types";
import { storePersist } from "@/lib/valtio";

export const useConfig = (key?: string) => {
	const { cronUrl } = useSnapshot(storePersist);
	return useQuery<IEtcd>({
		queryKey: ["cron-config", key, cronUrl],
		queryFn: () => {
			return http<IEtcd>(`${cronUrl}/api/v1/etcd`, {
				params: { key: key, prefix: false },
			});
		},
	});
};
