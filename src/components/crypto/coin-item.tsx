import { COIN_SRC, SVG_SRC } from "@/consts";
import { Button } from "../ui/button";
import { ReactSVG } from "react-svg";

export function CoinItem({
	coin,
	cex,
	dex,
}: {
	coin: string;
	cex: string;
	dex?: string;
}) {
	return (
		<div className="flex flex-col gap-1 items-start">
			<Button variant="ghost" size="sm" className="p-1">
				<img className="mr-2 w-6" src={COIN_SRC[coin.toLowerCase()]} />
				<span>{coin}</span>
			</Button>

			<div className="inline-block">
				<Button variant="ghost" size="sm" className="p-1">
					<ReactSVG
						src={SVG_SRC[cex.toLowerCase()]}
						className="mr-2 w-6"
					/>
					<span>{cex}</span>
				</Button>

				{dex ? (
					<Button variant="ghost" size="sm" className="p-1">
						<ReactSVG
							src={SVG_SRC[dex.toLowerCase()]}
							className="mr-2 w-6"
						/>
						<span>{dex}</span>
					</Button>
				) : undefined}
			</div>
		</div>
	);
}
