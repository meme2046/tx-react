import { Card, CardContent } from "@/components/ui/card";
import { SVG_SRC } from "@/consts";
import { useFearGreed } from "@/hooks/crypto";
import { createFileRoute } from "@tanstack/react-router";
import dayjs from "dayjs";
import { ReactSVG } from "react-svg";
import GaugeChart from "react-gauge-chart";
import { Button } from "@/components/ui/button";
export const Route = createFileRoute("/_layout/fear-greed")({
	component: RouteComponent,
	head: () => ({
		meta: [
			{
				title: "恐贪指数",
			},
		],
	}),
});

function RouteComponent() {
	const { data } = useFearGreed();
	return (
		<div className="flex flex-col items-center pt-4 font-[DeliusSwashCaps]">
			<div className={`flex items-center justify-center relative`}>
				<Button
					variant="outline"
					size="icon-lg"
					className="rounded-full cursor-pointer absolute top-[86.7px]"
				>
					<ReactSVG
						className="animate-wiggle-more animate-infinite"
						src={SVG_SRC["btc"]}
					/>
				</Button>
			</div>
			<div>
				<GaugeChart
					id="gauge-chart1"
					nrOfLevels={8}
					arcWidth={0.3}
					percent={data && data.now ? Number(data.now.value) / 100 : 0.5}
					className="font-[Sniglet]"
					needleColor="var(--primary)"
					textColor="var(--primary)"
					formatTextValue={(v) => {
						return data && data.now ? v : "";
					}}
				/>
			</div>

			{data && data.now && (
				<Card className="shadow-lg rounded-lg">
					<CardContent className="p-6">
						<p className="text-lg font-semibold text-primary">
							当前:{" "}
							<span>{`${data.now.value} (${data.now.value_classification})`}</span>
						</p>
						<p className="text-sm text-foreground">
							昨天:{" "}
							<span>{`${data.yesterday.value} (${data.yesterday.value_classification})`}</span>
						</p>
						<p className="text-sm text-foreground">
							本周:{" "}
							<span>{`${data.lastWeek.value} (${data.lastWeek.value_classification})`}</span>
						</p>
						<p className="text-xs mt-2 text-muted-foreground">
							更新时间:{" "}
							{dayjs
								.unix(Number(data.now.timestamp))
								.format("YYYY-MM-DD HH:mm")}
						</p>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
