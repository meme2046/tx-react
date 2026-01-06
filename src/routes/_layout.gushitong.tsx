import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SVG_SRC } from "@/consts";
import { GUSHITONG_LOGO, GUSHITONG_MARKET } from "@/consts/gushitong";
import { useRedis } from "@/hooks/use-redis";
import type {
  BannerItem,
  BannerResult,
  OpenData,
  SelfSelectItem,
} from "@/types/Gushitong";
import { createFileRoute } from "@tanstack/react-router";
import dayjs from "dayjs";
import { compact, round } from "lodash";
import { useMemo } from "react";
import { ReactSVG } from "react-svg";

export const Route = createFileRoute("/_layout/gushitong")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "股市",
      },
    ],
  }),
});

function BannerCard(props: { item: BannerItem }) {
  const { item } = props;
  return (
    <Card className="py-1 gap-1 justify-between">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <img
            src={GUSHITONG_LOGO[item.code]}
            alt={item.code}
            className={`w-10 ${item.code == "USDCNH" ? "" : "rounded-full"}`}
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
      <Separator />
      <CardContent>
        <div className="flex gap-1 items-end justify-start text-sm">
          <span className="text-5xl">{round(Number(item.lastPrice), 2)}</span>
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
        {item.timestamp && (
          <div className="relative inline-block">
            <Badge variant="outline">
              更新时间: {dayjs(item.timestamp).format("YYYY-MM-DD HH:mm:ss")}
            </Badge>
            {/* <ReactSVG
              src={SVG_SRC["line"]}
              className="text-primary absolute left-0 bottom-0 w-full"
            /> */}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function OpenDataCard(props: { item: OpenData }) {
  const { item } = props;

  return (
    <Card className="py-1 gap-1 justify-between">
      <CardHeader className="gap-0">
        <div className="flex items-center gap-2">
          <img
            src={item.minute_data.basicinfos.logo ?? GUSHITONG_LOGO[item.code]}
            alt={item.code}
            className="w-10 rounded-full"
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
      <Separator />
      <CardContent>
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
            {round(Number(item.minute_data.cur.price), 2)}
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
        <div className="relative inline-block">
          <Badge variant="outline">
            更新时间: {dayjs(item.timestamp).format("YYYY-MM-DD HH:mm:ss")}
          </Badge>
          <ReactSVG
            src={SVG_SRC["line"]}
            className="text-primary absolute left-0 bottom-0 w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function SelfSelectCard({ item }: { item: SelfSelectItem }) {
  return (
    <Card className="py-1 gap-1 justify-between">
      <CardHeader className="gap-0">
        <div className="flex items-center gap-2">
          <img
            src={GUSHITONG_LOGO[item.code] ?? item.logo?.logo}
            alt={item.code}
            className={`rounded-full ${item.code == "600519" ? "w-20 m-[-16px]" : "w-10"}`}
          />
          <div>
            <p className="text-lg">{item.name}</p>
            <div className="text-xs flex items-center gap-0.5">
              <span className="rounded">{item.exchange}</span>
              <span className="border rounded px-1">{item.code}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent>
        <div className="flex gap-1 items-end text-sm justify-start">
          <span className="text-5xl">{round(Number(item.price), 2)}</span>
          <div className="flex flex-col gap-0.5 items-start justify-center">
            <span
              className={`rounded-xl px-1
              ${item.increase.startsWith("-") ? "bg-rose-500" : "bg-lime-500"}
            `}
            >
              {item.increase}
            </span>
            <span
              className={`rounded-xl px-1
              ${item.increase.startsWith("-") ? "bg-rose-500" : "bg-lime-500"}
            `}
            >
              {item.ratio}
            </span>
          </div>
        </div>
        <div className="relative inline-block">
          <Badge variant="outline">
            更新时间: {dayjs(item.timestamp).format("YYYY-MM-DD HH:mm:ss")}
          </Badge>
          {/* <ReactSVG
            src={SVG_SRC["line"]}
            className="text-primary absolute left-0 bottom-0 w-full"
          /> */}
        </div>
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

  const bannerList = useMemo(() => {
    const combinedBanner = [
      ...(indexBanner?.data || []).map((item) => ({
        ...item,
        timestamp: indexBanner?.timestamp,
      })),
      ...(foreign?.data.list || []).map((item) => ({
        ...item,
        timestamp: foreign?.timestamp,
      })),
    ];
    return combinedBanner.filter((item) =>
      Object.keys(GUSHITONG_LOGO).includes(item.code),
    );
  }, [indexBanner, foreign]);

  const { data: au888 } = useRedis<any>("baidu.gushitong.opendata.AU888");
  const { data: xauusd } = useRedis<any>("baidu.gushitong.opendata.XAUUSD");
  const { data: btcusd } = useRedis<any>("baidu.gushitong.opendata.BTCUSD");
  const { data: ethusd } = useRedis<any>("baidu.gushitong.opendata.ETHUSD");
  const { data: ss600519 } = useRedis<any>("baidu.finance.selfselect.600519");
  const { data: ss399300 } = useRedis<any>("baidu.finance.selfselect.399300");
  const { data: ss399905 } = useRedis<any>("baidu.finance.selfselect.399905");

  const openDataList = useMemo(() => {
    return compact([au888, xauusd, btcusd, ethusd]).map((item) => ({
      ...item.data[0]?.DisplayData.resultData.tplData.result,
      timestamp: item.timestamp,
    }));
  }, [au888, xauusd, btcusd, ethusd]);

  const ssList = useMemo(() => {
    return compact([ss600519, ss399300, ss399905]).map((item) => ({
      ...item.data.stock[0],
      timestamp: item.timestamp,
    }));
  }, [ss600519, ss399300, ss399905]);

  return (
    <div className="flex flex-wrap gap-4 p-4">
      {openDataList.map((data, index) => (
        <OpenDataCard key={`open-data-${index}`} item={data} />
      ))}
      {bannerList?.map((item, index) => {
        return <BannerCard key={index} item={item} />;
      })}
      {ssList?.map((item, index) => {
        return <SelfSelectCard key={index} item={item} />;
      })}
    </div>
  );
}
