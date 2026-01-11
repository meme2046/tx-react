import { Card, CardContent } from "@/components/ui/card";
import { SVG_SRC } from "@/consts";
import { createFileRoute } from "@tanstack/react-router";
import dayjs from "dayjs";
import { ReactSVG } from "react-svg";
import GaugeChart from "react-gauge-chart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRedis } from "@/hooks/use-redis";
import type { FearGreed } from "@/types/FearGreed";
import type { RedisData } from "@/types/Gushitong";
export const Route = createFileRoute("/_layout/fear-greed")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "恐贪指数",
      },
    ],
  }),
});

function RouteComponent() {
  const { data: redisData } = useRedis<RedisData<FearGreed>>(
    "coinstats.fear-greed",
  );
  const data = redisData?.data;

  return (
    <div className="flex flex-col items-center pt-4 font-[DeliusSwashCaps]">
      <div className={`flex items-center justify-center relative`}>
        <Button
          variant="outline"
          size="icon-lg"
          className="rounded-full cursor-pointer absolute top-[86.7px]"
        >
          <ReactSVG
            className="animate-wiggle-more animate-infinite"
            src={SVG_SRC["btc"]}
          />
        </Button>
      </div>
      <div>
        <GaugeChart
          id="gauge-chart1"
          nrOfLevels={8}
          arcWidth={0.3}
          percent={data && data.now ? Number(data.now.value) / 100 : 0.5}
          // className="font-[Sniglet]"
          needleColor="var(--primary)"
          hideText={true}
          textColor="var(--primary)"
          formatTextValue={(v) => {
            return data && data.now ? v : "";
          }}
        />
      </div>

      {data && data.now && (
        <Card className="shadow rounded-lg py-4">
          <CardContent className="grid text-center gap-1">
            <p className="text-lg font-semibold text-primary">
              <span>{`${data.now.value} (${data.now.value_classification})`}</span>
            </p>
            <p className="text-sm text-foreground">
              <span>昨天:</span>
              <span>{`${data.yesterday.value} (${data.yesterday.value_classification})`}</span>
            </p>
            <p className="text-sm text-foreground">
              <span>本周:</span>
              <span>{`${data.lastWeek.value} (${data.lastWeek.value_classification})`}</span>
            </p>
            <Badge variant="outline" className="shadow">
              <span>更新时间:</span>
              <span>
                {redisData &&
                  dayjs(Number(redisData.timestamp)).format("YYYY-MM-DD HH:mm")}
              </span>
            </Badge>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
