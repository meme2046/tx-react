import { useSnapshot } from "valtio";
import { http } from "../../utils";
import { Button } from "../ui/button";
import { ReactSVG } from "react-svg";
import { ICON_SRC } from "@/consts";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../ui/tooltip";
import { storePersist } from "@/lib/valtio";

export function KillJob(props: { name?: string }) {
	const { name } = { ...props };
	const { cronURL } = useSnapshot(storePersist);
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						size="icon"
						variant="ghost"
						className="cursor-pointer"
						onClick={() => {
							if (name) {
								http(`${cronURL}/api/v1/etcd`, {
									method: "put",

									data: {
										key: `/cron/killer/${name}`,
										value: "",
										lease: 3,
									},
									successMessage: "Job killed successfully.",
								}).then();
							}
						}}
					>
						<ReactSVG src={ICON_SRC["kill"]} className="text-yellow-600" />
					</Button>
				</TooltipTrigger>
				<TooltipContent side="bottom">
					<p>kill {name} job</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
