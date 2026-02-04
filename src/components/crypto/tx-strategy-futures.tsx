import { map, round } from "lodash";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import dayjs from "dayjs";
export const TxStrategyFutures = ({ data }: { data: string[] }) => {
  const [
    lever,
    futures_open_px,
    futures_open_usdt,
    futures_close_px,
    futures_achieved_pl,
    futures_fee,
    futures_close_at,
  ] = map(data, Number);

  const skeletonClassName = "h-[22px] w-32 rounded-lg";

  return (
    <div className="flex flex-col gap-1 items-start">
      <Badge variant="outline">
        <span className="text-cyan-600">🪂杠杆:✘{lever}</span>
        {futures_fee != 0 && (
          <span
            className={`underline underline-offset-1 ${futures_fee < 0 ? "text-rose-400" : "text-lime-600"}`}
          >
            手续费:{round(futures_fee, 2)}
          </span>
        )}
      </Badge>
      {futures_open_px ? (
        <>
          <Badge variant="outline">
            <span>均价:{futures_open_px}</span>
            <span>金额:${round(futures_open_usdt, 1)}</span>
          </Badge>
        </>
      ) : (
        <>
          <Skeleton className={skeletonClassName}></Skeleton>
        </>
      )}
      {futures_close_px ? (
        <>
          <Badge
            className={`${futures_achieved_pl < 0 ? "bg-rose-400" : "bg-lime-600"}`}
          >
            <span>平仓均价:{futures_close_px}</span>
            <span>盈亏:{round(futures_achieved_pl, 1)}</span>
          </Badge>
          <Badge variant="outline">
            <span>
              平仓时间:{dayjs(futures_close_at).format("YYYY-MM-DD HH:mm")}
            </span>
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
