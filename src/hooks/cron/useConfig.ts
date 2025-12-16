import { useQuery } from "@tanstack/react-query";
import { useSnapshot } from "valtio";
import { http } from "../../utils";
import type { IEtcd } from "@/types";
import { storePersist } from "@/lib/valtio";

export const useConfig = (key?: string) => {
	const { cronURL } = useSnapshot(storePersist);
	return useQuery<IEtcd>({
		queryKey: ["cron-config", key, cronURL],
		queryFn: () => {
			return http<IEtcd>(`${cronURL}/api/v1/etcd`, {
				params: { key: key, prefix: false },
			});
		},
	});
};
