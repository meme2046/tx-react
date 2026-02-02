import { round } from "lodash";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import dayjs from "dayjs";

export function LongItem({ data }: { data: string[] }) {
  const [
    lever,
    long_open_px,
    long_open_usdt,
    long_close_px,
    long_achieved_pl,
    long_fee,
    long_close_at,
  ] = data;

  const longAchievedPl = Number(long_achieved_pl);

  const variant = "default";
  const skeletonClassName = "h-[22px] w-32 rounded-lg";

  return (
    <div className="flex flex-col gap-1 items-start">
      <div className="flex gap-1">
        <Badge variant="outline">
          🚀杠杆:✘{lever}
          {long_fee && <span>,手续费:{round(Number(long_fee), 2)}</span>}
        </Badge>
      </div>
      {long_open_px ? (
        <>
          <Badge variant="outline">开仓均价: {long_open_px}</Badge>
          <Badge variant="outline">
            花费usdt: {round(Number(long_open_usdt), 2)}
          </Badge>
        </>
      ) : (
        <>
          <Skeleton className={skeletonClassName}></Skeleton>
          <Skeleton className={skeletonClassName}></Skeleton>
        </>
      )}

      {long_close_px ? (
        <>
          <Badge variant={variant}>平仓均价: {long_close_px}</Badge>
          <Badge
            variant={variant}
            className={`${longAchievedPl < 0 ? "bg-rose-600" : "bg-lime-600"}`}
          >
            已实现盈亏: {round(longAchievedPl, 2)}
          </Badge>
          <Badge variant="default">
            {dayjs(Number(long_close_at)).format("YYYY-MM-DD HH:mm")}
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
}
