import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "../ui/sidebar";
import { sideNavList } from "./list";
import { capitalize } from "lodash";
import { Link } from "@tanstack/react-router";
export function SidebarItems() {
	const { isMobile, toggleSidebar } = useSidebar();

	return (
		<>
			{Object.entries(sideNavList).map(([group, items]) => (
				<SidebarGroup key={group}>
					<SidebarGroupLabel>{capitalize(group)}</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.value}>
									<SidebarMenuButton asChild>
										<Link
											to={item.value}
											onClick={() =>
												isMobile && toggleSidebar()
											}
											activeProps={{
												className: "font-bold",
											}}
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
		</>
	);
}
