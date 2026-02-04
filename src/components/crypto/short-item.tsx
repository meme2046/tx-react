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

  const variant = "default";
  const skeletonClassName = "h-[22px] w-32 rounded-lg";

  return (
    <div className="flex flex-col gap-1 items-start">
      <div>
        <Badge variant="outline">
          <span className="text-indigo-500">🪂杠杆:✘{lever}</span>
          {short_fee != 0 && (
            <span
              className={`underline underline-offset-1 ${short_fee < 0 ? "text-red-500" : "text-green-500"}`}
            >
              手续费:{round(short_fee, 2)}
            </span>
          )}
        </Badge>
      </div>
      {short_open_px ? (
        <>
          <Badge variant="outline">开仓均价: {short_open_px}</Badge>
          <Badge variant="outline">
            花费usdt: {round(short_open_usdt / lever, 2)}
          </Badge>
        </>
      ) : (
        <>
          <Skeleton className={skeletonClassName}></Skeleton>
          <Skeleton className={skeletonClassName}></Skeleton>
          <Skeleton className={skeletonClassName}></Skeleton>
        </>
      )}
      {short_close_px ? (
        <>
          <Badge variant={variant}>平仓均价: {short_close_px}</Badge>
          <Badge
            variant={variant}
            className={`${short_achieved_pl < 0 ? "bg-rose-600" : "bg-lime-600"}`}
          >
            已实现盈亏: {round(short_achieved_pl, 2)}
          </Badge>
          <Badge variant="secondary">
            {dayjs(short_close_at).format("YYYY-MM-DD HH:mm")}
          </Badge>
        </>
      ) : (
        <>
          <Skeleton className={skeletonClassName}></Skeleton>
          <Skeleton className={skeletonClassName}></Skeleton>
          <Skeleton className={skeletonClassName}></Skeleton>
        </>
      )}
    </div>
  );
}
