import { round } from "lodash";
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
          <Badge variant="outline">花费usdt: {round(futuresOpenUsdt, 2)}</Badge>
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
          <Badge
            variant={variant}
            className={`${futures_achieved_pl < 0 ? "bg-rose-600" : "bg-lime-600"}`}
          >
            已实现盈亏: {round(futures_achieved_pl, 2)}
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
