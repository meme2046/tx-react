import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
export const TxStrategyFutures = ({ data }: { data: number[] }) => {
	const [futuresOpenPx, futuresOpenUsdt, futuresClosePx, futures_achieved_pl] =
		data;
	const variant = "default";
	const skeletonClassName = "h-[22px] w-32 rounded-lg";

	return (
		<div className="flex flex-col gap-1 items-start">
			{futuresOpenPx ? (
				<>
					<Badge variant="outline">交易方向: 空🪂</Badge>
					<Badge variant="outline">开仓均价: {futuresOpenPx}</Badge>
					<Badge variant="outline">花费usdt: {futuresOpenUsdt}</Badge>
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
					<Badge variant={variant} className="bg-amber-600">
						平仓均价: {futuresClosePx}
					</Badge>
					<Badge variant={variant} className="bg-lime-600">
						已实现盈亏: {futures_achieved_pl}
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
