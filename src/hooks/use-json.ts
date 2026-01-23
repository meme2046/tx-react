import { http } from "@/utils/http";
import { useQuery } from "@tanstack/react-query";

export const useJson = <T>(url: string) => {
  return useQuery({
    queryKey: [url],
    queryFn: () => http<T>(url),
    refetchOnWindowFocus: true,
    refetchInterval: 60 * 1000,
  });
};
