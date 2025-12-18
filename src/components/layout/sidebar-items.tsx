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
import { startCase } from "lodash";
import { Link } from "@tanstack/react-router";
export function SidebarItems() {
	const { isMobile, toggleSidebar } = useSidebar();

	return (
		<>
			{Object.entries(sideNavList).map(([group, items]) => (
				<SidebarGroup key={group}>
					<SidebarGroupLabel className="font-[Sniglet]">
						{startCase(group)}
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.value}>
									<SidebarMenuButton asChild>
										<Link
											to={item.value}
											onClick={() => isMobile && toggleSidebar()}
											activeProps={{
												className: "font-bold",
											}}
										>
											<span className="text-lg">{item.emoj}</span>
											<span className="ml-1 hover:underline">
												{startCase(item.name)}
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
