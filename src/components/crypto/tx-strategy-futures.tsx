import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";

export const TxStrategyFutures = ({ data }: { data: number[] }) => {
	const [futuresOpenPx, futuresOpenUsdt, futuresClosePx, futuresCloseUsdt] =
		data;
	const variant = "default";
	const skeletonClassName = "h-[22px] w-32 rounded-lg";

	return (
		<div className="flex flex-col gap-1 items-start">
			{futuresOpenPx ? (
				<>
					<Badge variant={variant}>交易方向: 空🪂</Badge>
					<Badge variant={variant}>开仓均价: {futuresOpenPx}</Badge>
					<Badge variant={variant}>花费usdt: {futuresOpenUsdt}</Badge>
				</>
			) : (
				<>
					<Skeleton className={skeletonClassName}></Skeleton>
					<Skeleton className={skeletonClassName}></Skeleton>
					<Skeleton className={skeletonClassName}></Skeleton>
				</>
			)}
			{futuresClosePx ? (
				<>
					<Badge variant={variant}>平仓均价: {futuresClosePx}</Badge>
					<Badge variant={variant}>
						获得usdt: {futuresCloseUsdt}
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
