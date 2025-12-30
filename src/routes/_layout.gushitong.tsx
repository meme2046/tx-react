import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GUSHITONG_LOGO, GUSHITONG_MARKET } from "@/consts/gushitong";
import {
  useBanner,
  useIndexBanner,
  useOpenData,
} from "@/hooks/gushitong/use-gushitong";
import type { BannerItem, OpenData } from "@/types/Gushitong";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";

export const Route = createFileRoute("/_layout/gushitong")({
  component: RouteComponent,
});

function BannerCard(props: { item: BannerItem }) {
  const { item } = { ...props };
  return (
    <Card className="py-1 gap-0">
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
        <div className="flex gap-1">
          <Badge variant="default">{item.lastPrice}</Badge>
          <Badge
            className={
              item.increase.startsWith("-") ? "bg-rose-500" : "bg-lime-500"
            }
          >
            {item.increase}
          </Badge>
          <Badge
            className={
              item.increase.startsWith("-") ? "bg-rose-500" : "bg-lime-500"
            }
          >
            {item.ratio}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

function OpenDataCard(props: { item: OpenData }) {
  const { item } = { ...props };

  return (
    <Card className="py-1 gap-1">
      <CardHeader className="gap-0">
        <div className="flex items-center gap-2">
          <img
            src={item.minute_data.basicinfos.logo}
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
        {item.tag_list.length > 0 && (
          <div className="flex items-center gap-0.5 text-xs">
            {item.tag_list.map((tag) => (
              <>
                <img src={tag.imageUrl} className="w-4" alt={tag.desc} />
                <span>{tag.desc}</span>
              </>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-0.5">
        <div className="flex gap-1">
          <Badge variant="default">{item.minute_data.cur.price}</Badge>
          <Badge
            className={
              item.minute_data.cur.increase.startsWith("-")
                ? "bg-rose-500"
                : "bg-lime-500"
            }
          >
            {item.minute_data.cur.increase}
          </Badge>
          <Badge
            className={
              item.minute_data.cur.increase.startsWith("-")
                ? "bg-rose-500"
                : "bg-lime-500"
            }
          >
            {item.minute_data.cur.ratio}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

function RouteComponent() {
  const { data: indexBanner } = useIndexBanner();
  const { data: foreign } = useBanner("foreign");
  const { data: au888 } = useOpenData("AU888", "51287");

  const dataList = useMemo(() => {
    const combinedData = [
      ...(indexBanner?.Result || []),
      ...(foreign?.Result?.list || []),
    ];
    return combinedData.filter((item) =>
      Object.keys(GUSHITONG_LOGO).includes(item.code),
    );
  }, [indexBanner, foreign]);
  return (
    <div className="p-4 space-y-4">
      {au888 && <OpenDataCard item={au888} />}
      {dataList?.map((item, index) => (
        <BannerCard key={index} item={item} />
      ))}
    </div>
  );
}
