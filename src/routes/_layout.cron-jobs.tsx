import { DeleteJob, KillJob, SaveJob } from "@/components/cron";
import { ReactTable } from "@/components/table";
import { ICON_SRC } from "@/consts";
import { useJob } from "@/hooks/cron";
import type { ICronJob } from "@/types";
import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { ReactSVG } from "react-svg";

export const Route = createFileRoute("/_layout/cron-jobs")({
	component: RouteComponent,
	head: () => ({
		meta: [
			{
				title: "Cron Jobs",
			},
		],
	}),
});

function RouteComponent() {
	const columns = useMemo<ColumnDef<ICronJob>[]>(
		() => [
			{
				accessorKey: "sortIndex",
				header: "序号",
				enableColumnFilter: true,
				enableSorting: true,
				size: 160,
			},
			{
				accessorKey: "name",
				header: "NAME",
				enableColumnFilter: true,
				enableSorting: true,
				size: 160,
			},
			{
				accessorKey: "command",
				header: "COMMAND",
				enableColumnFilter: true,
				enableSorting: true,
				size: 444,
			},
			{
				accessorKey: "cronExpr",
				header: "CRON EXPRESSION",
				enableColumnFilter: true,
				enableSorting: true,
				size: 160,
			},
			{
				id: "actions",
				header: "ACTIONS",
				enableHiding: false,
				cell: ({ row }) => {
					const orig = row.original;
					return (
						<div>
							<SaveJob
								size="icon"
								variant="ghost"
								name={orig.name}
								title="edit"
								triggerContent={
									<ReactSVG src={ICON_SRC["edit"]} className="text-lime-600" />
								}
							/>
							<KillJob name={orig.name} />
							<DeleteJob name={orig.name} />
						</div>
					);
				},
				size: 128,
			},
		],
		[],
	);

	const initialVisibilityColumns = ["name", "command", "cronExpr"];
	const rowsPerPageList: number[] = [50, 100, 200];
	const [rowsPerPage, setRowsPerPage] = useState<string>(
		`${rowsPerPageList[0]}`,
	);

	const { data, isLoading, isFetching, refetch } = useJob();
	const jobs: ICronJob[] = useMemo(() => {
		return data?.map((d) => JSON.parse(d.value)) ?? [];
	}, [data]);

	return (
		<>
			<div className="relative mt-1">
				<div className="absolute right-0 md:right-40">
					<SaveJob
						title="Add new"
						triggerContent={
							<>
								<span>Add new job&nbsp;</span>
								<ReactSVG src={ICON_SRC["plus"]} />
							</>
						}
					/>
				</div>
			</div>

			<ReactTable
				data={jobs}
				refetch={refetch}
				isFetching={isFetching}
				isLoading={isLoading}
				columns={columns}
				initialVisibilityColumns={initialVisibilityColumns}
				rowsPerPageList={rowsPerPageList}
				rowsPerPage={rowsPerPage}
				setRowsPerPage={setRowsPerPage}
				initialSorting={[{ id: "sortIndex", desc: false }]}
				subHeight={96}
				keyField="name"
				type="virtualized"
				estimateRowHeight={53}
				overscan={6}
			/>
		</>
	);
}
