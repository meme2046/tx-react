import { store } from "@/lib/valtio/store";
import type { RedisResponse } from "@/types/Gushitong";
import type { InfiniteList } from "@/types/Infinite";
import { http } from "@/utils";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useSnapshot } from "valtio";
export const useRedis = <T>(key: string) => {
  const { redisBaseURL } = useSnapshot(store);
  return useQuery({
    queryKey: [`${key}`],
    queryFn: () => {
      return http<RedisResponse<T>>(`${redisBaseURL}/api/v1/redis/json`, {
        params: { key },
      }).then((d) => {
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

async function fetchRedisList<T extends object>(
  url: string,
  key: string,
  cursor: number = 0,
  size: number = 5000,
): Promise<InfiniteList<T>> {
  try {
    const resp = await http<RedisResponse<T[]>>(url, {
      params: { key, cursor, size },
    });

    const nextCursor = `${(cursor + 1) * size}`;

    if (resp.success) {
      // console.log("count: ", resp.data?.length);
      if (resp.data && resp.data.length > 0) {
        return {
          list: resp.data || [],
          prevCursor: `${cursor}`,
          nextCursor,
        };
      } else {
        return {
          list: [],
          prevCursor: `${cursor}`,
          nextCursor: undefined,
        };
      }
    } else {
      throw new Error(resp.error);
    }
  } catch (e) {
    throw new Error(String(e));
  }
}

export const useRedisListInfinite = <T extends object>(
  key: string,
  size: number = 10000,
) => {
  const { redisBaseURL } = useSnapshot(store);
  return useInfiniteQuery<InfiniteList<T>>({
    queryKey: [`redis-set-${key}`],
    queryFn: ({ pageParam }) => {
      return fetchRedisList<T>(
        `${redisBaseURL}/api/v1/redis/byset`,
        key,
        Number(pageParam),
        size,
      );
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    refetchOnWindowFocus: true,
    refetchInterval: 60 * 1000,
  });
};
