import { createFileRoute } from "@tanstack/react-router";
import { Link, Outlet } from "@tanstack/react-router";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { fetchInvoices } from "@/lib/api/fakerInvoice";

export const Route = createFileRoute("/_auth/invoices")({
	loader: async () => ({
		invoices: await fetchInvoices(),
	}),
	component: RouteComponent,
});

function RouteComponent() {
	const { invoices } = Route.useLoaderData();

	return (
		<div className="p-4">
			<ResizablePanelGroup
				direction="horizontal"
				className="rounded-lg border"
			>
				<ResizablePanel defaultSize={25} className="min-w-[212px]">
					<div className="p-1 flex flex-col gap-1">
						{invoices.map((invoice) => (
							<Link
								to="/invoices/$invoiceId"
								params={{
									invoiceId: invoice.id.toString(),
								}}
								className="hover:opacity-75"
								activeProps={{
									className: "font-bold underline",
								}}
							>
								<span className="tabular-nums">
									#{invoice.id.toString().padStart(2, "0")}
								</span>
								- {invoice.title.slice(0, 16)}...
							</Link>
						))}
					</div>
				</ResizablePanel>
				<ResizableHandle withHandle />
				<ResizablePanel defaultSize={75}>
					<Outlet />
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}
