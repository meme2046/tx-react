import { useQuery } from "@tanstack/react-query";
import type { IFakerUser } from "../../types/index.ts";
import { fetchFakerUser } from "@/lib/api/fakerUser.ts";

export const useFakerUser = (size: number = 100) => {
	return useQuery<{ list: IFakerUser[]; nextCursor: number | undefined }>({
		queryKey: ["faker-user", size],
		queryFn: () => {
			return fetchFakerUser(size);
		},
	});
};
