import { map, round } from "lodash";
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
  ] = map(data, Number);

  const skeletonClassName = "h-[22px] w-32 rounded-lg";

  return (
    <div className="flex flex-col gap-1 items-start">
      <Badge variant="outline">
        <span className="text-cyan-600">🚀杠杆:✘{lever}</span>
        {long_fee != 0 && (
          <span
            className={`underline underline-offset-1 ${long_fee < 0 ? "text-rose-400" : "text-lime-600"}`}
          >
            手续费:{round(long_fee, 2)}
          </span>
        )}
      </Badge>
      {long_open_px ? (
        <>
          <Badge variant="outline">
            <span>均价:{long_open_usdt}</span>
            <span>金额:${round(long_open_usdt / lever, 1)}</span>
          </Badge>
        </>
      ) : (
        <>
          <Skeleton className={skeletonClassName}></Skeleton>
        </>
      )}

      {long_close_px ? (
        <>
          <Badge
            className={`${long_achieved_pl < 0 ? "bg-rose-400" : "bg-lime-600"}`}
          >
            <span>平仓均价:{long_close_px}</span>
            <span>盈亏: {round(long_achieved_pl, 1)}</span>
          </Badge>
          <Badge variant="outline">
            <span>
              平仓时间:{dayjs(long_close_at).format("YYYY-MM-DD HH:mm")}
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
}
