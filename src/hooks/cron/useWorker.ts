import { useQuery } from "@tanstack/react-query";
import { useSnapshot } from "valtio";
import { http } from "../../utils";
import { storePersist } from "@/lib/valtio";
import type { IEtcd } from "@/types";

export const useWorker = () => {
	const { cronUrl } = useSnapshot(storePersist);
	return useQuery<string[]>({
		queryKey: ["cron-worker", cronUrl],
		queryFn: () => {
			return http<IEtcd[]>(`${cronUrl}/api/v1/etcd`, {
				params: { key: "/cron/worker", prefix: true },
			}).then((resp) => resp.map((item) => item.key));
		},
	});
};
