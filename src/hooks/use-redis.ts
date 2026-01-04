import type { RedisResponse } from "@/types/Gushitong";
import { http } from "@/utils";
import { useQuery } from "@tanstack/react-query";
export const useRedis = <T>(key: string) => {
  return useQuery({
    queryKey: [`gushitong-opendata-${key}`],
    queryFn: () => {
      return http<RedisResponse<T>>(
        "https://meme.us.kg:8888/api/v1/redis/get",
        {
          params: { key },
        },
      ).then((d) => {
        if (!d.success) {
          throw new Error(`ERR: ${d.error}`);
        }

        return d.data;
      });
    },
    refetchOnWindowFocus: true,
    refetchInterval: 60 * 1000,
  });
};
