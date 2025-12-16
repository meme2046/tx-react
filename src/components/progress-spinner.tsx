import { useSnapshot } from "valtio";
import { store } from "@/lib/valtio";

export function ProgressSpinner() {
	const { progress } = useSnapshot(store);

	return (
		<div className="fixed inset-x-0 top-0 z-50 h-[2px] overflow-x-hidden">
			{progress && (
				<div className="h-[2px] bg-primary animate-[movex_3s_ease-in-out_infinite]"></div>
			)}
		</div>
	);
}
