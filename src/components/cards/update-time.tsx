import { SVG_SRC } from "@/consts";
import dayjs from "dayjs";
import { ReactSVG } from "react-svg";

export function UpdateTime({
  timestamp,
  className,
}: {
  timestamp?: number;
  className?: string;
}) {
  return (
    timestamp && (
      <div className={`relative text-xs ${className ?? ""}`}>
        <span>更新时间:</span>
        <span>
          {dayjs
            .unix(
              timestamp.toString().length === 13
                ? Math.floor(timestamp / 1000)
                : timestamp,
            )
            .format("YYYY-MM-DD HH:mm")}
        </span>
        <ReactSVG
          src={SVG_SRC["line"]}
          className="text-primary absolute left-0 bottom-[-4px] w-full"
        />
      </div>
    )
  );
}
