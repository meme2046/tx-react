import { Badge } from "../ui/badge";
import { map, round } from "lodash";
import { Skeleton } from "../ui/skeleton";
import dayjs from "dayjs";

export const TxStrategySpot = ({ data }: { data: string[] }) => {
  const [
    lever,
    spot_open_px,
    spot_open_usdt,
    spot_close_px,
    spot_achieved_pl,
    spot_fee,
    spot_close_at,
  ] = map(data, Number);

  const skeletonClassName = "h-[22px] w-32 rounded-lg";
  return (
    <div className="flex flex-col gap-1 items-start">
      <Badge variant="outline">
        <span className="text-cyan-600">🚀杠杆:✘{lever}</span>
        {spot_fee != 0 && (
          <span
            className={`underline underline-offset-1 ${spot_fee < 0 ? "text-rose-400" : "text-lime-600"}`}
          >
            手续费:{round(spot_fee, 2)}
          </span>
        )}
      </Badge>
      {spot_open_px ? (
        <>
          <Badge variant="outline">
            <span>买入均价:{spot_open_px}</span>
            <span>金额:${round(spot_open_usdt / lever, 1)}</span>
          </Badge>
        </>
      ) : (
        <>
          <Skeleton className={skeletonClassName}></Skeleton>
        </>
      )}

      {spot_close_px ? (
        <>
          <Badge
            className={`${spot_achieved_pl < 0 ? "bg-rose-400" : "bg-lime-600"}`}
          >
            <span>卖出均价:{spot_close_px}</span>
            <span>盈亏:{round(spot_achieved_pl, 1)}</span>
          </Badge>
          <Badge variant="outline">
            <span>
              平仓时间:{dayjs(spot_close_at).format("YYYY-MM-DD HH:mm")}
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
