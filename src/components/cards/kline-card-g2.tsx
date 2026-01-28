import type { BasicInfo, UiKline } from "@/types/Charts";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { includes, startsWith, isNaN } from "lodash";
import { Badge } from "../ui/badge";
import { UpdateTime } from "./update-time";
import { Button } from "../ui/button";
import { KLineG2 } from "../charts/kline-g2";

interface Props {
  className?: string;
  basic: BasicInfo;
  data?: UiKline[];
}

export function KLineCardG2({
  className = "py-0 gap-0 m-0",
  basic,
  data,
}: Props) {
  return (
    <Card className={className}>
      <CardHeader className="gap-0">
        <CardTitle className="flex items-center">
          <Avatar
            className={`${includes(["600519"], basic.code) ? "size-20 m-[-16px]" : "size-12"}
            ${!includes(["USDCNH", "600519"], basic.code) ? "ring-2 ring-primary/50" : ""}
            ${includes(["USDCNH"], basic.code) ? "rounded" : ""}`}
          >
            <AvatarImage src={basic.logo} alt={basic.code} />
            <AvatarFallback>{basic.code}</AvatarFallback>
          </Avatar>
          <div className="ml-1">
            <div className="space-x-0.5 [&_span]:py-0">
              <span className="text-lg">{basic.name}</span>
              <Badge
                className={
                  basic.exchange === "Binance" ? "bg-yellow-500" : "bg-cyan-400"
                }
              >
                {basic.exchange}
              </Badge>
              <Badge variant="outline">{basic.code}</Badge>
              {basic.tradeStatus && <Badge>{basic.tradeStatus}</Badge>}
            </div>

            <div
              className={`flex text-sm gap-1 ${startsWith(basic.increase, "-") ? "text-red-600" : "text-green-700"}`}
            >
              <span className="text-5xl">
                {isNaN(basic.price) ? "--" : basic.price}
              </span>
              <div
                className={`${includes(["USDCNH", "IXIC"], basic.code) ? "hidden sm:flex sm:flex-col sm:gap-0.5" : "flex flex-col gap-0.5"}`}
              >
                <span className="border rounded px-0.5">{basic.increase}</span>
                <span className="border rounded px-0.5">{basic.ratio}</span>
              </div>
            </div>
          </div>
        </CardTitle>
        <CardDescription className="flex sm:hidden">
          <UpdateTime timestamp={basic.time ?? basic.timestamp} />
        </CardDescription>
        <CardAction>
          <div className="space-y-1 hidden sm:block">
            <div className="flex flex-col gap-0.5">
              {basic.tagList?.map((tag, index) => (
                <Button
                  variant="outline"
                  size="sm"
                  key={index}
                  className="px-0.5 h-auto justify-start"
                >
                  <img src={tag.imageUrl} className="w-4" />
                  <span>{tag.desc}</span>
                </Button>
              ))}
            </div>
            <UpdateTime timestamp={basic.time ?? basic.timestamp} />
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="p-0 m-0">
        <KLineG2 data={data} yTickCount={5} precision={basic.precision} />
      </CardContent>
    </Card>
  );
}
