import type {
  BannerItem,
  BannerResult,
  Gushitong,
  OpenData,
} from "@/types/Gushitong";
import { http } from "@/utils";
import { useQuery } from "@tanstack/react-query";

// export const useBanner = (market: string) => {
//   return useQuery({
//     queryKey: ["gushitong-banner"],
//     queryFn: () => {
//       return http<Gushitong<BannerResult>>(
//         "https://meme.us.kg:8888/proxy/finance.pae.baidu.com/api/getbanner",
//         {
//           params: { market: market },
//         },
//       ).then((d) => {
//         if (d.ResultCode !== "0" && d.ResultCode !== 0) {
//           throw new Error(`ResultCode:${d.ResultCode}, is not success`);
//         }
//         return d;
//       });
//     },
//     refetchOnWindowFocus: false,
//     refetchInterval: 70 * 1000,
//     refetchIntervalInBackground: false,
//   });
// };

// export const useIndexBanner = () => {
//   return useQuery({
//     queryKey: ["gushitong-indexbanner"],
//     queryFn: () => {
//       return http<Gushitong<BannerItem[]>>(
//         "https://meme.us.kg:8888/proxy/finance.pae.baidu.com/api/indexbanner",
//       ).then((d) => {
//         if (d.ResultCode !== "0" && d.ResultCode !== 0) {
//           throw new Error(`ResultCode:${d.ResultCode}, is not success`);
//         }
//         return d;
//       });
//     },
//     refetchOnWindowFocus: false,
//     refetchInterval: 60 * 1000,
//     refetchIntervalInBackground: false,
//   });
// };

export const useRedis = <T>(key: string) => {
  return useQuery({
    queryKey: [`gushitong-opendata-${key}`],
    queryFn: () => {
      return http<Gushitong<T>>("https://meme.us.kg:8888/api/v1/redis/get", {
        params: { key },
      }).then((d) => {
        if (!d.success) {
          throw new Error(`ERR: ${d.error}`);
        }

        // if (key.startsWith("baidu.gushitong.opendata")) {
        //   const result = d.data?.data[0]?.DisplayData.resultData.tplData.result;
        //   const data: OpenData = {
        //     name: result.name,
        //     code: result.code,
        //     marketName: result.marketName,
        //     tag_list: result.tag_list,
        //     minute_data: {
        //       cur: result.minute_data.cur,
        //       basicinfos: result.minute_data.basicinfos,
        //     },
        //     finance_type: result.finance_type,
        //   };
        //   return data;
        // }
        return d.data;
      });
    },
    refetchOnWindowFocus: false,
    refetchInterval: 80 * 1000,
    refetchIntervalInBackground: false,
  });
};
