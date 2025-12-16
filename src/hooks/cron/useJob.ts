import { useQuery } from "@tanstack/react-query";
import { useSnapshot } from "valtio";
import { http } from "../../utils";
import type { IEtcd } from "@/types";
import { storePersist } from "@/lib/valtio";

export const useJob = () => {
	const { cronURL } = useSnapshot(storePersist);
	return useQuery<IEtcd[]>({
		queryKey: ["cron-job", cronURL],
		queryFn: () => {
			return http(`${cronURL}/api/v1/etcd`, {
				params: { key: "/cron/jobs", prefix: true },
			});
		},
	});
};
