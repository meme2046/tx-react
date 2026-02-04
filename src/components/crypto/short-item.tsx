import { map, round } from "lodash";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import dayjs from "dayjs";

export function ShortItem({ data }: { data: string[] }) {
  const [
    lever,
    short_open_px,
    short_open_usdt,
    short_close_px,
    short_achieved_pl,
    short_fee,
    short_close_at,
  ] = map(data, Number);

  const skeletonClassName = "h-[22px] w-32 rounded-lg";

  return (
    <div className="flex flex-col gap-1 items-start">
      <Badge variant="outline">
        <span className="text-cyan-600">🪂杠杆:✘{lever}</span>
        {short_fee != 0 && (
          <span
            className={`underline underline-offset-1 ${short_fee < 0 ? "text-rose-400" : "text-lime-600"}`}
          >
            手续费:{round(short_fee, 2)}
          </span>
        )}
      </Badge>
      {short_open_px ? (
        <>
          <Badge variant="outline">
            <span>均价:{short_open_px}</span>
            <span>金额:${round(short_open_usdt, 1)}</span>
          </Badge>
        </>
      ) : (
        <>
          <Skeleton className={skeletonClassName}></Skeleton>
        </>
      )}
      {short_close_px ? (
        <>
          <Badge
            className={`${short_achieved_pl < 0 ? "bg-rose-400" : "bg-lime-600"}`}
          >
            <span>平仓均价:{short_close_px}</span>
            <span>盈亏: {round(short_achieved_pl, 1)}</span>
          </Badge>
          <Badge variant="outline">
            <span>
              平仓时间:{dayjs(short_close_at).format("YYYY-MM-DD HH:mm")}
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
