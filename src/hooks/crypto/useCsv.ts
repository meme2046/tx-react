import { http } from "@/utils";
import {
	keepPreviousData,
	useInfiniteQuery,
	useQuery,
} from "@tanstack/react-query";
import dayjs from "dayjs";
import Papa from "papaparse";
import { useSnapshot } from "valtio";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { storePersist } from "@/lib/valtio";
import type { IGrid, IInfiniteList, IStrategy } from "@/types";

export const useGrid = () => {
	const { githubDataURL } = useSnapshot(storePersist);
	return useQuery<IGrid[]>({
		queryKey: ["github-grid"],
		queryFn: () => {
			return http<string>(
				`${githubDataURL}/grid_0.csv?t=${dayjs().valueOf()}`,
			).then((resp) => {
				return new Promise<IGrid[]>((resolve, reject) => {
					Papa.parse(resp, {
						header: true,
						skipEmptyLines: true,
						complete: (results: Papa.ParseResult<unknown>) => {
							resolve(results.data as IGrid[]);
						},
						error: (error: unknown) => {
							reject(error);
						},
					});
				});
			});
		},
	});
};

export const useStrategy = () => {
	const { githubDataURL } = useSnapshot(storePersist);
	return useQuery<IStrategy[]>({
		queryKey: ["github-strategy"],
		queryFn: () => {
			return http<string>(
				`${githubDataURL}/strategy_0.csv?t=${dayjs().valueOf()}`,
			).then((resp) => {
				return new Promise<IStrategy[]>((resolve, reject) => {
					Papa.parse(resp, {
						header: true,
						skipEmptyLines: true,
						complete: (results: Papa.ParseResult<unknown>) => {
							resolve(results.data as IStrategy[]);
						},
						error: (error: unknown) => {
							reject(error);
						},
					});
				});
			});
		},
	});
};

export const fetchCsvData = async <T extends object>(
	url: string,
	fileName: string,
	cursor: number,
): Promise<IInfiniteList<T>> => {
	try {
		const resp = await http<string>(
			`${url}/${fileName}_${cursor}.csv?t=${dayjs().valueOf()}`,
			{
				errorMessage: undefined,
			},
		);

		const { data, errors } = Papa.parse<T>(resp, {
			header: true,
			skipEmptyLines: true,
		});

		if (errors.length > 0) {
			toast.error(errors[0].message);
			return Promise.reject(errors);
		}

		return { list: data, nextCursor: `${cursor + 1}` };
	} catch (error) {
		if (isAxiosError(error) && error.response?.status === 404) {
			return { list: [], nextCursor: undefined };
		}
		return Promise.reject(error);
	}
};

export const useCsvInfinite = <T extends object>(
	key: string,
	fileName: string,
) => {
	const { githubDataURL } = useSnapshot(storePersist);
	return useInfiniteQuery<IInfiniteList<T>>({
		queryKey: [`infinite-${key}`],
		queryFn: ({ pageParam = "" }) => {
			return fetchCsvData<T>(githubDataURL, fileName, Number(pageParam));
		},
		initialPageParam: 0,
		getNextPageParam: (lastPage) => lastPage.nextCursor,
		refetchOnWindowFocus: false,
		placeholderData: keepPreviousData,
	});
};
