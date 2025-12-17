import { ICON_SRC, COIN_SRC, SVG_SRC } from "@/consts";
import { ReactSVG } from "react-svg";
import { http } from "../../utils";
import { useState } from "react";
import { Button } from "../ui/button";
import type { IArweaveData } from "@/types";

export function TxCoin<T extends IArweaveData>({
	data,
	callback,
}: {
	data: string;
	callback: (value: T) => void;
}) {
	const [loading, setLoading] = useState(false);
	const [coin, cex, nodeId] = data.split(",");
	const getArweaveTx = () => {
		return http<T>(`https://arweave.net/${nodeId}`);
	};
	return (
		<>
			{coin ? (
				<div className="flex flex-col gap-1 items-start">
					<Button variant="ghost" size="sm">
						<img className="mr-2 w-6" src={COIN_SRC[coin.toLowerCase()]} />
						<span>{coin}</span>
					</Button>
					<Button variant="ghost" size="sm">
						<ReactSVG src={SVG_SRC[cex]} className="mr-2 w-6" />
						<span>{cex}</span>
					</Button>
				</div>
			) : (
				<Button
					variant="default"
					size="sm"
					disabled={loading}
					onClick={async () => {
						setLoading(true);
						getArweaveTx()
							.then((resp) => {
								resp.nodeId = nodeId;
								callback(resp);
							})
							.finally(() => {
								setLoading(false);
							});
					}}
				>
					<ReactSVG
						src={ICON_SRC["loading4"]}
						className={`mr-1 w-5 ${loading ? "animate-spin" : ""}`}
					/>
					<span>重载当前行</span>
				</Button>
			)}
		</>
	);
}
