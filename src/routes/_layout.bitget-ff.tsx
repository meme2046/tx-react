import { CoinItem } from "@/components/crypto/coin-item";
import { FFEnd } from "@/components/crypto/ff-end";
import { LongItem } from "@/components/crypto/long-item";
import { ShortItem } from "@/components/crypto/short-item";
import { ReactTable } from "@/components/table/react-table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useRedisListInfinite } from "@/hooks/use-redis";
import type { BitgetFF } from "@/types/BitgetFF";
import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { reduce, round } from "lodash";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/_layout/bitget-ff")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "Bitget FF",
      },
    ],
  }),
});

function RouteComponent() {
  const columns = useMemo<ColumnDef<BitgetFF>[]>(
    () => [
      {
        accessorKey: "long_client_order_id",
        id: "id",
        header: "ID",
        size: 180,
      },
      {
        accessorKey: "open_at",
        id: "openAt",
        header: "策略开启时间",
        size: 160,
        cell: (cell) => (
          <Badge>
            {dayjs(Number(cell.getValue<string>())).format("YYYY-MM-DD HH:mm")}
          </Badge>
        ),
        enableColumnFilter: false,
      },
      {
        accessorFn: (row) => `${row.symbol},${row.cex}`,
        id: "coin",
        header: "币种&交易所",
        size: 144,
        cell: ({ row }) => {
          const orig = row.original;
          return (
            <CoinItem
              coin={orig.symbol.replace(/[_-]?usdt$/i, "").replace(/^1000/, "")}
              cex={orig.cex}
            />
          );
        },
      },
      {
        accessorFn: (row) => [
          row.lever,
          row.long_open_px,
          row.long_open_usdt,
          row.long_close_px,
          row.long_achieved_pl,
          row.long_fee,
          row.long_close_at,
        ],
        id: "long",
        header: "多单",
        size: 192,
        cell: (row) => <LongItem data={row.getValue<string[]>()} />,
        enableColumnFilter: false,
        enableSorting: false,
      },
      {
        accessorFn: (row) => [
          row.lever,
          row.short_open_px,
          row.short_open_usdt,
          row.short_close_px,
          row.short_achieved_pl,
          row.short_fee,
          row.short_close_at,
        ],
        id: "short",
        header: "空单",
        size: 192,
        cell: (row) => <ShortItem data={row.getValue<string[]>()} />,
        enableColumnFilter: false,
        enableSorting: false,
      },
      {
        accessorFn: (row) =>
          `${row.pnl},${row.pnl_ratio},${row.pnl ? "complete" : "pending"}`,
        id: "pnl",
        header: "结算",
        size: 132,
        cell: (row) => <FFEnd data={row.getValue<string>()} />,
        meta: {
          filterVariant: "select",
          selectItems: [
            { value: "pending", name: "等待成交" },
            { value: "complete", name: "已完成" },
          ],
        },
      },
      {
        accessorKey: "close_at",
        id: "closeAt",
        header: "结束时间",
        size: 132,
        cell: (cell) => {
          const closeAt = cell.getValue<string>();
          return (
            <>
              {closeAt ? (
                <Badge variant="outline">
                  {dayjs(Number(cell.getValue<string>())).format(
                    "YYYY-MM-DD HH:mm",
                  )}
                </Badge>
              ) : (
                <Skeleton className="w-32 h-5" />
              )}
            </>
          );
        },
        enableColumnFilter: false,
      },
    ],
    [],
  );
  const initialVisibilityColumns = [
    "openAt",
    "coin",
    "long",
    "short",
    "pnl",
    "closeAt",
  ];

  const rowsPerPageList: number[] = [30, 60, 120];
  const [rowsPerPage, setRowsPerPage] = useState<string>(
    `${rowsPerPageList[0]}`,
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    refetch,
    isFetchingNextPage,
    isFetching,
    isLoading,
  } = useRedisListInfinite<BitgetFF>("bitget_ff");

  const sortedData = useMemo(() => {
    const flatData = data?.pages?.flatMap((page) => page.list) ?? [];
    return flatData.sort((a, b) => {
      return new Date(b.open_at).getTime() - new Date(a.open_at).getTime();
    });
  }, [data]);

  const pnl = useMemo(() => {
    return reduce(
      sortedData,
      (sum: number, v: BitgetFF) => {
        return sum + Number(v.pnl);
      },
      0,
    );
  }, [sortedData]);

  return (
    <>
      <div className="relative mt-1">
        <Badge className="absolute right-0 md:right-40 bg-lime-600">
          <span className="text-lg">💰</span>
          <span className="text-base">{round(pnl, 2)}</span>
        </Badge>
      </div>

      <ReactTable
        data={sortedData}
        refetch={refetch}
        isFetching={isFetching}
        isLoading={isLoading}
        columns={columns}
        initialVisibilityColumns={initialVisibilityColumns}
        rowsPerPageList={rowsPerPageList}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        initialSorting={[{ id: "openAt", desc: true }]}
        subHeight={96}
        keyField="id"
        type="virtualized"
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        estimateRowHeight={108}
        overscan={1}
      />
    </>
  );
}
