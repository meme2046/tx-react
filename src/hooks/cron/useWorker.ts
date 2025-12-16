import { useQuery } from "@tanstack/react-query";
import { useSnapshot } from "valtio";
import { http } from "../../utils";
import { storePersist } from "@/lib/valtio";
import type { IEtcd } from "@/types";

export const useWorker = () => {
	const { cronURL } = useSnapshot(storePersist);
	return useQuery<string[]>({
		queryKey: ["cron-worker", cronURL],
		queryFn: () => {
			return http<IEtcd[]>(`${cronURL}/api/v1/etcd`, {
				params: { key: "/cron/worker", prefix: true },
			}).then((resp) => resp.map((item) => item.key));
		},
	});
};
