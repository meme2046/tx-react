import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useBanner } from "@/hooks/gushitong/use-banner";
import type { GetBannerItem } from "@/types/IGushitong";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, type HTMLAttributes } from "react";

export const Route = createFileRoute("/_layout/gushitong")({
	component: RouteComponent,
});

function BannerCard(
	props: {
		item: GetBannerItem;
	} & HTMLAttributes<HTMLDivElement>,
) {
	const { className, item } = { ...props };
	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle>
					<Avatar>
						<AvatarImage src={item.logo.logo} alt="@shadcn" />
						<AvatarFallback className="animate-pulse bg-linear-to-tr from-secondary to-primary"></AvatarFallback>
					</Avatar>
					<span>{item.name}</span>
				</CardTitle>
				<CardDescription>
					<span>{item.exchange}</span>
					<span>{item.code}</span>
				</CardDescription>
			</CardHeader>
			<CardContent>
				<span>{item.lastPrice}</span>
				<span>{item.increase}</span>
				<span>{item.ratio}</span>
			</CardContent>
		</Card>
	);
}

function RouteComponent() {
	const { data } = useBanner("asia");
	const dataList = useMemo(() => data?.Result?.list, [data]);
	return (
		<div className="p-4 space-y-4">
			{dataList?.map((item, index) => (
				<BannerCard key={index} item={item} />
			))}
		</div>
	);
}
