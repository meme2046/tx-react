import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "../ui/badge";
import type { BasicInfo, ChartData } from "@/types/Charts";
import { VolPxECharts } from "../charts/vol-px-echarts";
import { Button } from "../ui/button";
import { includes, startsWith, isNaN } from "lodash";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { UpdateTime } from "./update-time";
interface Props {
  className?: string;
  basicInfo: BasicInfo;
  data: ChartData;
}
const defaultProps = {
  className: "py-0 gap-0",
};

export function VolPxCardEcharts(props: Props) {
  const { className, basicInfo, data } = {
    ...defaultProps,
    ...props,
  };
  return (
    <Card className={className}>
      <CardHeader className="gap-0">
        <CardTitle className="flex items-center">
          <Avatar
            className={`${includes(["600519"], basicInfo.code) ? "size-20 m-[-16px]" : "size-12"}
            ${!includes(["USDCNH", "600519"], basicInfo.code) ? "ring-2 ring-primary/50" : ""}
            ${includes(["USDCNH"], basicInfo.code) ? "rounded" : ""}`}
          >
            <AvatarImage src={basicInfo.logo} alt={basicInfo.code} />
            <AvatarFallback>{basicInfo.code}</AvatarFallback>
          </Avatar>
          <div className="ml-1">
            <div className="space-x-0.5 [&_span]:py-0">
              <span className="text-lg">{basicInfo.name}</span>
              <Badge variant="secondary">{basicInfo.exchange}</Badge>
              <Badge variant="outline">{basicInfo.code}</Badge>
              {basicInfo.tradeStatus && <Badge>{basicInfo.tradeStatus}</Badge>}
            </div>

            <div
              className={`flex text-sm gap-1 ${startsWith(basicInfo.increase, "-") ? "text-red-600" : "text-green-700"}`}
            >
              <span className="text-5xl">
                {isNaN(basicInfo.price) ? "--" : basicInfo.price}
              </span>
              <div
                className={`${includes(["USDCNH", "IXIC"], basicInfo.code) ? "hidden sm:flex sm:flex-col sm:gap-0.5" : "flex flex-col gap-0.5"}`}
              >
                <span className="border rounded px-0.5">
                  {basicInfo.increase}
                </span>
                <span className="border rounded px-0.5">{basicInfo.ratio}</span>
              </div>
            </div>
          </div>
        </CardTitle>
        <CardDescription className="flex sm:hidden">
          <UpdateTime timestamp={basicInfo.time ?? basicInfo.timestamp} />
        </CardDescription>
        <CardAction>
          <div className="space-y-1 hidden sm:block">
            <div className="flex flex-col gap-0.5">
              {basicInfo.tagList?.map((tag, index) => (
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
            <UpdateTime timestamp={basicInfo.time ?? basicInfo.timestamp} />
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="p-0 m-0">
        <VolPxECharts basicInfo={basicInfo} data={data} />
      </CardContent>
    </Card>
  );
}
