import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { get } from "lodash";
import dayjs from "dayjs";
import type { ColumnDef } from "@tanstack/react-table";
import type { ICronLog } from "@/types";
import { useLogInfinite } from "@/hooks/cron";
import { ReactTable } from "@/components/table";

export const Route = createFileRoute("/_layout/cron-logs")({
	component: RouteComponent,
	head: () => ({
		meta: [
			{
				title: "Cron Logs",
			},
		],
	}),
});

function RouteComponent() {
	const columns = useMemo<ColumnDef<ICronLog>[]>(
		() => [
			{
				accessorKey: "jobName",
				header: "任务名",
				enableColumnFilter: true,
				enableSorting: true,
				size: 160,
			},
			{
				accessorKey: "command",
				header: "COMMAND",
				enableColumnFilter: true,
				enableSorting: false,
				size: 444,
			},
			{
				accessorKey: "startTime",
				header: "开始时间",
				cell: (info) =>
					info.getValue() ? (
						<span>
							{dayjs(info.getValue<number>()).format("YYYY-MM-DD HH:mm:ss")}
						</span>
					) : undefined,
				enableColumnFilter: false,
				enableSorting: true,
				size: 160,
			},
			{
				accessorKey: "output",
				header: "任务输出",
				enableColumnFilter: true,
				enableSorting: false,
				size: 444,
			},
			{
				accessorKey: "err",
				header: "ERROR",
				enableColumnFilter: true,
				enableSorting: true,
				size: 128,
			},
			{
				accessorKey: "planTime",
				header: "计划时间",
				cell: (info) =>
					info.getValue() ? (
						<span>
							{dayjs(info.getValue<number>()).format("YYYY-MM-DD HH:mm:ss")}
						</span>
					) : undefined,
				enableColumnFilter: false,
				enableSorting: true,
				size: 160,
			},
			{
				accessorKey: "scheduleTime",
				header: "调度时间",
				cell: (info) =>
					info.getValue() ? (
						<span>
							{dayjs(info.getValue<number>()).format("YYYY-MM-DD HH:mm:ss")}
						</span>
					) : undefined,
				enableColumnFilter: false,
				enableSorting: true,
				size: 160,
			},
			{
				accessorKey: "endTime",
				header: "结束时间",
				cell: (info) =>
					info.getValue() ? (
						<span>
							{dayjs(info.getValue<number>()).format("YYYY-MM-DD HH:mm:ss")}
						</span>
					) : undefined,
				enableColumnFilter: false,
				enableSorting: true,
				size: 160,
			},
		],
		[],
	);
	const initialVisibilityColumns = ["jobName", "startTime", "output", "err"];

	const rowsPerPageList: number[] = [100, 200, 300, 500];
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
	} = useLogInfinite(Number(rowsPerPage));

	const flatData = useMemo(
		() => data?.pages?.flatMap((page) => page.items) ?? [],
		[data],
	);

	return (
		<>
			<ReactTable
				data={flatData}
				fetchNextPage={fetchNextPage}
				refetch={refetch}
				hasNextPage={hasNextPage}
				isFetchingNextPage={isFetchingNextPage}
				isFetching={isFetching}
				isLoading={isLoading}
				columns={columns}
				initialVisibilityColumns={initialVisibilityColumns}
				rowsPerPageList={rowsPerPageList}
				rowsPerPage={rowsPerPage}
				setRowsPerPage={setRowsPerPage}
				estimateRowHeight={36}
				overscan={12}
				subHeight={96}
				total={get(data?.pages[0], "total")}
				type="virtualized"
			/>
		</>
	);
}
