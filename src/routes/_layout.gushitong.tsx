import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GUSHITONG_LOGO, GUSHITONG_MARKET } from "@/consts/gushitong";
import { useRedis } from "@/hooks/gushitong/use-gushitong";
import type { BannerItem, BannerResult, OpenData } from "@/types/Gushitong";
import { createFileRoute } from "@tanstack/react-router";
import dayjs from "dayjs";
import { useMemo } from "react";

export const Route = createFileRoute("/_layout/gushitong")({
  component: RouteComponent,
});

function BannerCard(props: { item: BannerItem; timestamp?: number }) {
  const { item, timestamp } = { ...props };
  return (
    <Card className="py-1 gap-1 justify-around">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <img
            src={GUSHITONG_LOGO[item.code]}
            alt={item.code}
            className="w-10"
          />
          <div>
            <p className="text-lg">{item.name}</p>
            <div className="text-xs flex items-center gap-0.5">
              <span className="rounded">
                {item.exchange ?? GUSHITONG_MARKET[item.market]}
              </span>
              <span className="border rounded px-1">{item.code}</span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-1 items-end justify-start text-sm">
          <span className="text-5xl">
            {item.lastPrice.slice(0, item.lastPrice.indexOf(".") + 3)}
          </span>
          <div className="flex flex-col gap-0.5 items-start">
            <span
              className={`px-1 rounded-xl ${item.increase.startsWith("-") ? "bg-rose-500" : "bg-lime-500"}`}
            >
              {item.increase}
            </span>
            <span
              className={`px-1 rounded-xl ${item.increase.startsWith("-") ? "bg-rose-500" : "bg-lime-500"}`}
            >
              {item.ratio}
            </span>
          </div>
        </div>
        {timestamp && (
          <Badge variant="outline">
            更新时间: {dayjs(timestamp).format("YYYY-MM-DD HH:mm:ss")}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}

function OpenDataCard(props: { item: OpenData; timestamp: number }) {
  const { item, timestamp } = { ...props };

  return (
    <Card className="py-1 gap-1 justify-around">
      <CardHeader className="gap-0">
        <div className="flex items-center gap-2">
          <img
            src={item.minute_data.basicinfos.logo ?? GUSHITONG_LOGO[item.code]}
            alt={item.code}
            className="w-10"
          />
          <div>
            <p className="text-lg">{item.name}</p>
            <div className="text-xs flex items-center gap-0.5">
              <span className="rounded">{item.marketName}</span>
              <span className="border rounded px-1">{item.code}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-0.5">
        {item.tag_list.length > 0 && (
          <div className="flex gap-0.5 text-xs">
            {item.tag_list.map((tag) => (
              <div className="flex items-center gap-0.5" key={tag.desc}>
                <img src={tag.imageUrl} className="w-4" alt={tag.desc} />
                <span>{tag.desc}</span>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-1 items-end text-sm justify-start">
          <span className="text-5xl">
            {item.minute_data.cur.price.slice(
              0,
              item.minute_data.cur.price.indexOf(".") + 3,
            )}
          </span>
          <div className="flex flex-col gap-0.5 items-start justify-center">
            <span
              className={`rounded-xl px-1
              ${
                item.minute_data.cur.increase.startsWith("-")
                  ? "bg-rose-500"
                  : "bg-lime-500"
              }
            `}
            >
              {item.minute_data.cur.increase}
            </span>
            <span
              className={`rounded-xl px-1
              ${
                item.minute_data.cur.increase.startsWith("-")
                  ? "bg-rose-500"
                  : "bg-lime-500"
              }
            `}
            >
              {item.minute_data.cur.ratio}
            </span>
          </div>
        </div>
        <Badge variant="outline">
          更新时间: {dayjs(timestamp).format("YYYY-MM-DD HH:mm:ss")}
        </Badge>
      </CardContent>
    </Card>
  );
}

function RouteComponent() {
  const { data: indexBanner } = useRedis<BannerItem[]>(
    "baidu.finance.indexbanner",
  );
  const { data: foreign } = useRedis<BannerResult>(
    "baidu.finance.getbanner.foreign",
  );
  const { data: au888 } = useRedis<any>("baidu.gushitong.opendata.AU888");
  const { data: btcusd } = useRedis<any>("baidu.gushitong.opendata.BTCUSD");
  const { data: xauusd } = useRedis<any>("baidu.gushitong.opendata.XAUUSD");

  const dataList = useMemo(() => {
    const combinedData = [
      ...(indexBanner?.data || []),
      ...(foreign?.data.list || []),
    ];
    return combinedData.filter((item) =>
      Object.keys(GUSHITONG_LOGO).includes(item.code),
    );
  }, [indexBanner, foreign]);
  return (
    <div className="flex flex-wrap gap-4 p-4">
      {au888 && (
        <OpenDataCard
          item={au888.data[0]?.DisplayData.resultData.tplData.result}
          timestamp={au888.timestamp}
        />
      )}
      {xauusd && (
        <OpenDataCard
          item={xauusd.data[0]?.DisplayData.resultData.tplData.result}
          timestamp={xauusd.timestamp}
        />
      )}
      {btcusd && (
        <OpenDataCard
          item={btcusd.data[0]?.DisplayData.resultData.tplData.result}
          timestamp={btcusd.timestamp}
        />
      )}
      {dataList?.map((item, index) => {
        let ts = indexBanner?.timestamp;
        if (item.market == "global") {
          ts = foreign?.timestamp;
        }
        return <BannerCard key={index} item={item} timestamp={ts} />;
      })}
    </div>
  );
}
