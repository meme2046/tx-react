import { AVATAR_SRC } from "@/consts";
import { ProgressSpinner } from "../ProgressSpinner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

import {
	SidebarProvider,
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "../ui/sidebar";
import { navList } from "./list";
import { capitalize } from "lodash";
import { Link, Outlet } from "@tanstack/react-router";
export function Layout() {
	const { isMobile, toggleSidebar } = useSidebar();

	return (
		<SidebarProvider defaultOpen={true} className="w-full h-full p-0 m-0">
			<ProgressSpinner />
			<Sidebar className="z-50" variant="floating">
				<SidebarHeader>
					<div className="flex gap-2 items-center">
						<Avatar className="ring">
							<AvatarImage
								src={AVATAR_SRC.shadcn}
								alt="@shadcn_sidebar"
							/>
							<AvatarFallback className="animate-pulse bg-gradient-to-tr from-info to-primary"></AvatarFallback>
						</Avatar>
						<span className="text-primary">Meme2046</span>
					</div>
				</SidebarHeader>
				<SidebarContent>
					{Object.entries(navList).map(([group, items]) => (
						<SidebarGroup key={group}>
							<SidebarGroupLabel>
								{capitalize(group)}
							</SidebarGroupLabel>
							<SidebarGroupContent>
								<SidebarMenu>
									{items.map((item) => (
										<SidebarMenuItem key={item.value}>
											<SidebarMenuButton asChild>
												<Link
													to={item.value}
													onClick={() =>
														isMobile &&
														toggleSidebar()
													}
												>
													<span className="text-lg">
														{item.emoj}
													</span>
													<span className="ml-1 hover:underline">
														{capitalize(item.name)}
													</span>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
									))}
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>
					))}
				</SidebarContent>
			</Sidebar>
			<div className="grow overflow-auto scrollbar-thin">
				{/* <Navbar /> */}
				{/* <RefDiv ref={rootRef} className="px-4 min-h-[calc(100vh-64px)]">
					<Outlet context={{ rootRef }} />
				</RefDiv> */}
				<Outlet />
			</div>
		</SidebarProvider>
	);
}
