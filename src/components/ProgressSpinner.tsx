import { useSnapshot } from "valtio";
import { store } from "@/lib/valtio";

export function ProgressSpinner() {
	const { progress } = useSnapshot(store);

	return (
		<div className="absolute inset-x-0 top-0 z-50 h-[10px] overflow-x-hidden">
			{progress && (
				<div className="h-[10px] bg-primary animate-[moveX_3s_ease-in-out_infinite]"></div>
			)}
		</div>
	);
}
