import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";

export function TxGridDetail({
	data,
	isBuy,
}: {
	data: number[];
	isBuy: boolean;
}) {
	const [usdt, px] = data;
	const variant = "default";
	const skeletonClassName = "h-5 w-32 rounded-lg";
	return (
		<div className="flex flex-col items-start gap-1">
			{px ? (
				<>
					<Badge variant={variant}>{`${
						isBuy ? "买入价格" : "卖出价格"
					}: ${px}`}</Badge>
				</>
			) : (
				<>
					<Skeleton className={skeletonClassName}></Skeleton>
				</>
			)}

			{usdt ? (
				<>
					<Badge variant={variant}>{`${
						isBuy ? "花费usdt" : "获得usdt"
					}: ${usdt}`}</Badge>
				</>
			) : (
				<>
					<Skeleton className={`${skeletonClassName} px-2 text-info`}>
						等待成交
					</Skeleton>
				</>
			)}
		</div>
	);
}
