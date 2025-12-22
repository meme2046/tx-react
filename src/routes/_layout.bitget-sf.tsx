import {
	CoinItem,
	TxStrategyEnd,
	TxStrategyFutures,
	TxStrategySpot,
} from "@/components/crypto";
import { ReactTable } from "@/components/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCsvInfinite } from "@/hooks/crypto";
import type { IStrategy } from "@/types";
import { matchStr } from "@/utils";
import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { reduce, round } from "lodash";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/_layout/bitget-sf")({
	component: RouteComponent,
	head: () => ({
		meta: [
			{
				title: "Bitget SF",
			},
		],
	}),
});

function RouteComponent() {
	const columns = useMemo<ColumnDef<IStrategy>[]>(
		() => [
			{
				accessorKey: "spot_client_order_id",
				id: "id",
				header: "ID",
				size: 180,
			},
			{
				accessorKey: "created_at",
				id: "openAt",
				header: "策略开启时间",
				size: 160,
				cell: (cell) => <Badge>{matchStr(cell.getValue<string>())}</Badge>,
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
					row.spot_open_px,
					row.spot_open_usdt,
					row.spot_close_px,
					row.spot_achieved_pl,
				],
				id: "spot",
				header: "现货",
				size: 188,
				cell: (row) => <TxStrategySpot data={row.getValue<number[]>()} />,
				enableColumnFilter: false,
				enableSorting: false,
			},
			{
				accessorFn: (row) => [
					row.futures_open_px,
					row.futures_open_usdt,
					row.futures_close_px,
					row.futures_achieved_pl,
				],
				id: "futures",
				header: "合约",
				size: 188,
				cell: (row) => <TxStrategyFutures data={row.getValue<number[]>()} />,
				enableColumnFilter: false,
				enableSorting: false,
			},
			{
				accessorFn: (row) =>
					`${row.pnl},${row.pnl_ratio},${row.pnl ? "complete" : "pending"}`,
				id: "pnl",
				header: "结算",
				size: 132,
				cell: (row) => <TxStrategyEnd data={row.getValue<string>()} />,
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
								<Badge variant="outline">{matchStr(closeAt)}</Badge>
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
		"spot",
		"futures",
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
	} = useCsvInfinite<IStrategy>("github", "bitget_sf");

	const sortedData = useMemo(() => {
		const flatData = data?.pages?.flatMap((page) => page.list) ?? [];
		return flatData.sort((a, b) => {
			return (
				new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
			);
		});
	}, [data]);

	const pnl = useMemo(() => {
		return reduce(
			sortedData,
			(sum: number, v: IStrategy) => {
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
				initialSorting={[{ id: "closeAt", desc: true }]}
				subHeight={96}
				keyField="id"
				type="virtualized"
				fetchNextPage={fetchNextPage}
				hasNextPage={hasNextPage}
				isFetchingNextPage={isFetchingNextPage}
				estimateRowHeight={143}
				overscan={1}
			/>
		</>
	);
}
