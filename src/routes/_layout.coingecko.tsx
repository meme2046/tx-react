import { CoingeckoItem } from "@/components/crypto";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AVATAR_SRC, ICON_SRC } from "@/consts";
import { useCoingeckoCoinsMarkets, useCoinsFromGithub } from "@/hooks/crypto";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { ReactSVG } from "react-svg";

export const Route = createFileRoute("/_layout/coingecko")({
	component: RouteComponent,
	head: () => ({
		meta: [
			{
				title: "关注币种",
			},
		],
	}),
});

function RouteComponent() {
	const { data: coins } = useCoinsFromGithub();
	const { data, isFetching } = useCoingeckoCoinsMarkets(
		coins?.map((item) => item.key) ?? [],
	);

	const sortedData = useMemo(() => {
		return data?.sort(
			(a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h,
		);
	}, [data]);

	const renderCard = (title: string, imgSrc: string) => (
		<Card className="py-0 gap-0">
			<CardHeader className="px-4">
				<CardTitle className="flex items-center gap-2">
					<img src={imgSrc} className="w-12 rounded-full" alt={title} />
					<span className="underline">
						${data?.find((v) => v.id === "bitcoin")?.current_price}
					</span>
					<span className="text-lg font-semibold">{title}</span>

					<Button
						variant="ghost"
						size="icon"
						className="cursor-pointer rounded-full"
					>
						<ReactSVG
							src={ICON_SRC["loading2"]}
							className={`text-purple-500 w-6 ${isFetching ? "animate-spin" : ""}`}
						/>
					</Button>
				</CardTitle>
			</CardHeader>
			<Separator />
			<CardContent className="p-3 flex justify-center flex-wrap gap-2">
				{sortedData?.map((item, _) => (
					<div key={item.id}>
						<CoingeckoItem item={item} />
					</div>
				))}
			</CardContent>
		</Card>
	);
	return <div className="p-4">{renderCard("关注币种", AVATAR_SRC["btc"])}</div>;
}
