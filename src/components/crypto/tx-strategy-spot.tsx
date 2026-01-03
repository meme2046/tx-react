import { round } from "lodash";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";

export const TxStrategySpot = ({ data }: { data: number[] }) => {
  const [spotOpenPx, spotOpenUsdt, spotClosePx, spot_achieved_pl] = data;
  const variant = "default";
  const skeletonClassName = "h-[22px] w-32 rounded-lg";
  return (
    <div className="flex flex-col gap-1 items-start">
      {spotOpenPx ? (
        <>
          <Badge variant="outline">买入价格: {spotOpenPx}</Badge>
          <Badge variant="outline">花费usdt: {round(spotOpenUsdt, 2)}</Badge>
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
          <Badge
            variant={variant}
            className={`${spot_achieved_pl < 0 ? "bg-rose-600" : "bg-lime-600"}`}
          >
            已实现盈亏: {round(spot_achieved_pl, 2)}
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
