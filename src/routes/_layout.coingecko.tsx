import { CoingeckoItem } from "@/components/crypto";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AVATAR_SRC, SVG_SRC } from "@/consts";
import { useRedis } from "@/hooks/use-redis";
import type { CoingeckoMarketsItem } from "@/types/CoingeckoCoin";
import type { RedisData } from "@/types/Gushitong";
import { createFileRoute } from "@tanstack/react-router";
import dayjs from "dayjs";
import { useMemo } from "react";
import { ReactSVG } from "react-svg";

export const Route = createFileRoute("/_layout/coingecko")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "关注币种",
      },
    ],
  }),
});

function RenderCard({
  title,
  imgSrc,
  data,
  timestamp,
}: {
  title: string;
  imgSrc: string;
  data?: CoingeckoMarketsItem[];
  timestamp?: number;
}) {
  return (
    <Card className="py-0 gap-0">
      <CardHeader className="px-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={imgSrc} className="w-12 rounded-full" alt={title} />
            <Badge>{title}</Badge>
          </div>
          <div className="relative text-xs font-normal">
            <span>更新时间: </span>
            <span>
              {timestamp && dayjs(Number(timestamp)).format("YYYY-MM-DD HH:mm")}
            </span>
            <ReactSVG
              src={SVG_SRC["line"]}
              className="absolute left-0 bottom-[-4px] text-primary w-full"
            />
          </div>
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="p-3 flex justify-center flex-wrap gap-2">
        {data?.map((item, _) => (
          <div key={item.id}>
            <CoingeckoItem item={item} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function RouteComponent() {
  const { data: redisData } =
    useRedis<RedisData<CoingeckoMarketsItem[]>>("coingecko.markets");
  const data = redisData?.data;
  const timestamp = redisData?.timestamp;

  const sortedData = useMemo(() => {
    return data?.sort(
      (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h,
    );
  }, [data]);

  return (
    <div className="p-4">
      <RenderCard
        title="关注币种"
        imgSrc={AVATAR_SRC["btc"]}
        data={sortedData}
        timestamp={timestamp}
      />
      {/* {renderCard("关注币种", AVATAR_SRC["btc"])} */}
    </div>
  );
}
