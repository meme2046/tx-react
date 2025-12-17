import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";

export const TxStrategySpot = ({ data }: { data: number[] }) => {
	const [spotOpenPx, spotOpenUsdt, spotClosePx, spotCloseUsdt] = data;
	const variant = "default";
	const skeletonClassName = "h-[22px] w-32 rounded-lg";
	return (
		<div className="flex flex-col gap-1 items-start">
			{spotOpenPx ? (
				<>
					<Badge variant={variant}>买入价格: {spotOpenPx}</Badge>
					<Badge variant={variant}>花费usdt: {spotOpenUsdt}</Badge>
				</>
			) : (
				<>
					<Skeleton className={skeletonClassName}></Skeleton>
					<Skeleton className={skeletonClassName}></Skeleton>
				</>
			)}

			{spotClosePx ? (
				<>
					<Badge variant={variant}>卖出价格: {spotClosePx}</Badge>
					<Badge variant={variant}>获得usdt: {spotCloseUsdt}</Badge>
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
