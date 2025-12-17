import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";

export const TxGridEnd = ({ data }: { data: string }) => {
	const [pnl] = data.split(",");
	const skeletonClassName = "h-5 w-28 rounded-lg";
	return (
		<div className="flex flex-col items-start">
			{pnl ? (
				<Badge variant="default">收益额: ${pnl}</Badge>
			) : (
				<Skeleton className={skeletonClassName}></Skeleton>
			)}
		</div>
	);
};
