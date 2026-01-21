import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "../ui/badge";
import type { BasicInfo, ChartData } from "@/types/Charts";
import { VolPxChart } from "../charts/vol-px-chart";
import { Button } from "../ui/button";
import dayjs from "dayjs";
import { SVG_SRC } from "@/consts/svg";
import { ReactSVG } from "react-svg";
import { includes, startsWith } from "lodash";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
interface Props {
  className?: string;
  basicInfo: BasicInfo;
  data: ChartData;
}
const defaultProps = {
  className: "",
};

export function GushiCard(props: Props) {
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
              className={`flex text-sm gap-1 ${startsWith(basicInfo.increase, "+") ? "text-green-700" : "text-red-600"}`}
            >
              <span className="text-5xl">{basicInfo.price}</span>
              <div className="flex flex-col gap-0.5">
                <span className="border rounded px-0.5">
                  {basicInfo.increase}
                </span>
                <span className="border rounded px-0.5">{basicInfo.ratio}</span>
              </div>
            </div>
          </div>
        </CardTitle>
        <CardDescription></CardDescription>
        <CardAction className="space-y-1">
          <div className="flex flex-col gap-0.5">
            {basicInfo.tagList?.map((tag, index) => (
              <Button
                variant="outline"
                size="sm"
                key={index}
                className="px-0.5 h-auto"
              >
                <img src={tag.imageUrl} className="w-4" />
                <span>{tag.desc}</span>
              </Button>
            ))}
          </div>
          <div className="relative text-xs">
            <span>更新时间:</span>
            <span>
              {basicInfo.time
                ? dayjs.unix(basicInfo.time).format("YYYY-MM-DD HH:mm")
                : dayjs(basicInfo.timestamp).format("YYYY-MM-DD HH:mm")}
            </span>
            <ReactSVG
              src={SVG_SRC["line"]}
              className="text-primary absolute left-0 bottom-[-4px] w-full"
            />
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="p-0 m-0">
        <VolPxChart data={data} />
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
