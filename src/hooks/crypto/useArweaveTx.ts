import type { IArweave, ArweaveData, IArweaveDataList } from "@/types";
import { http } from "../../utils";

import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

export const getQueryString = (
  fetchSize: number,
  type: string,
  cursor?: string,
) => {
  // tags: [{ name: "Type", values: ["test"] }]
  // tags: [{ name: "Content-Type", values: ["application/json"] }]
  return {
    query: `{
    transactions(
    owners: ["OVeo2rciRNaJSjFuXtv207mwCffNc36h83JfoQsIbs8"]
    sort: HEIGHT_DESC
    first: ${fetchSize}
    ${cursor ? `after: "${cursor}"` : ""}
    tags: [{ name: "Type", values: ["${type}"] }]
	) {
        edges {
			cursor
			node {
				id
			}
        }
    }
    }`,
  };
};

const createEmptyArweaveTx = (nodeId: string): ArweaveData => {
  return {
    id: `empty${crypto.randomUUID()}`,
    nodeId,
    // cex: "",
    // coin: "",
    // futuresOpenPx: 0,
    // futuresOpenUsdt: 0,
    // futuresPositionSide: "",
    // openUnix: 0,
    // spotOpenPx: 0,
    // spotOpenUsdt: 0,
  };
};

export const arweaveGraphql = async <T extends ArweaveData>(
  fetchSize: number,
  type: string,
  cursor?: string,
): Promise<IArweaveDataList<T>> => {
  const query = getQueryString(fetchSize, type, cursor);
  const resp = await http<IArweave>("https://arweave.net/graphql", {
    method: "post",
    data: query,
    d2: true,
  });
  let nextCursor = undefined;
  const len = resp.transactions.edges.length;
  if (len > 0) {
    nextCursor = resp.transactions.edges[len - 1].cursor;
  }

  const allPromise = resp.transactions.edges.map(async (edge) => {
    try {
      const d = await axios.get(`https://arweave.net/${edge.node.id}`);
      d.data.nodeId = edge.node.id;
      return d.data;
    } catch {
      return createEmptyArweaveTx(edge.node.id);
    }
  });

  const list = await Promise.all(allPromise);
  return { list, nextCursor };
};

export const useArweaveTxInfinite = <T extends ArweaveData>(
  key: string,
  fetchSize: number,
  type: string,
) => {
  return useInfiniteQuery<IArweaveDataList<T>>({
    queryKey: [`arweave-tx-infinite-${key}`],
    queryFn: ({ pageParam = "" }) => {
      return arweaveGraphql<T>(fetchSize, type, pageParam as string);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
};
