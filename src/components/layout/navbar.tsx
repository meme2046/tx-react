import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { SidebarTrigger } from "../ui/sidebar";
import { navList } from "./list";
import type { INav } from "@/types";
import { cn } from "@/lib/utils";
import { startCase } from "lodash";

export function Navbar() {
	const renderMenuItems = ({
		items,
		className,
	}: {
		items: INav[];
		className?: string;
	}) => {
		return items.map((item) => (
			<li key={item.value}>
				<NavigationMenuLink asChild>
					<Link
						to={item.value}
						className={cn("select-none", className)}
						activeProps={{
							className: "font-bold text-primary",
						}}
					>
						<div>
							<span>{item.emoj}</span>
							<span className="ml-2">{startCase(item.name)}</span>
						</div>
						<p className="text-xs font-thin">
							{item.desc ? `| ${item.desc}` : undefined}
						</p>
					</Link>
				</NavigationMenuLink>
			</li>
		));
	};
	return (
		<nav className="py-1 text-sm flex justify-around items-stretch sticky top-0 z-40 inset-x-0 backdrop-blur-xs bg-background/20">
			<div className="flex items-center">
				<SidebarTrigger className="text-primary hover:text-lime-600 [&>svg]:size-6! cursor-pointer" />
				<Link to="/">
					<Button variant="ghost" className="py-0 px-1 cursor-pointer">
						<span className="font-[DeliusSwashCaps]">Meme</span>
					</Button>
				</Link>
			</div>
			<div className="hidden sm:flex">
				<NavigationMenu viewport={true}>
					<NavigationMenuList>
						{Object.entries(navList).map(([group, items]) => (
							<NavigationMenuItem key={group}>
								<NavigationMenuTrigger className="bg-transparent">
									{group}
								</NavigationMenuTrigger>

								<NavigationMenuContent>
									<ul className="grid min-w-64">
										{renderMenuItems({ items })}
									</ul>
								</NavigationMenuContent>
							</NavigationMenuItem>
						))}
					</NavigationMenuList>
				</NavigationMenu>
			</div>
			<div></div>
		</nav>
	);
}
