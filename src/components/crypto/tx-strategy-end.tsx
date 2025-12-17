import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";

export const TxStrategyEnd = ({ data }: { data: string }) => {
	const [pnl, pnlRatio] = data.split(",");
	const skeletonClassName = "h-5 w-28 rounded-lg";
	const variant = Number(pnl) > 0 ? "default" : "destructive";
	return (
		<div className="flex flex-col gap-1 items-start">
			{pnl ? (
				<>
					<Badge variant={variant}>收益额: ${pnl}</Badge>
					<Badge variant={variant}>
						收益率: {(Number(pnlRatio) * 100).toFixed(3)}%
					</Badge>
				</>
			) : (
				<>
					<Skeleton className={skeletonClassName}></Skeleton>
					<Skeleton className={skeletonClassName}></Skeleton>
				</>
			)}
		</div>
	);
};
