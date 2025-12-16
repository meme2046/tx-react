import { AVATAR_SRC } from "@/consts";
import { ProgressSpinner } from "@/components/progress-spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarProvider,
} from "@/components/ui/sidebar";
import { Outlet } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/layout/navbar";
import { SidebarItems } from "@/components/layout/sidebar-items";

export const Route = createFileRoute("/_layout")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<SidebarProvider>
				<ProgressSpinner />
				<Sidebar className="z-50" variant="floating">
					<SidebarHeader>
						<div className="flex gap-2 items-center">
							<Avatar className="ring">
								<AvatarImage src={AVATAR_SRC.shadcn} alt="@shadcn_sidebar" />
								<AvatarFallback className="animate-pulse bg-linear-to-tr from-info to-primary"></AvatarFallback>
							</Avatar>
							<span className="font-[Caps]">Meme</span>
						</div>
					</SidebarHeader>
					<SidebarContent className="scrollbar-thin">
						<SidebarItems />
					</SidebarContent>
				</Sidebar>
				<main className="grow">
					<Navbar />
					<Outlet />
				</main>
			</SidebarProvider>
		</>
	);
}
