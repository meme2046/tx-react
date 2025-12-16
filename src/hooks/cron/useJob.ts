import { useQuery } from "@tanstack/react-query";
import { useSnapshot } from "valtio";
import { http } from "../../utils";
import type { IEtcd } from "@/types";
import { storePersist } from "@/lib/valtio";

export const useJob = () => {
	const { cronUrl } = useSnapshot(storePersist);
	return useQuery<IEtcd[]>({
		queryKey: ["cron-job", cronUrl],
		queryFn: () => {
			return http(`${cronUrl}/api/v1/etcd`, {
				params: { key: "/cron/jobs", prefix: true },
			});
		},
	});
};
