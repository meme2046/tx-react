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
import { capitalize } from "lodash";
import { useIsMobile } from "@/lib/hooks/use-mobile";

export function Navbar() {
	const isMobile = useIsMobile();
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
					>
						<div className="text-sm">
							<span className="text-lg">{item.emoj}</span>
							<span className="ml-2">
								{capitalize(item.name)}
							</span>
						</div>
						<p className="text-xs">
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
				<SidebarTrigger />
				<Link to="/">
					<Button variant="ghost" className="py-0 px-1">
						<span className="font-[Caps]">Meme</span>
					</Button>
				</Link>
			</div>
			<div className="hidden sm:flex">
				<NavigationMenu viewport={isMobile}>
					<NavigationMenuList>
						{Object.entries(navList).map(([group, items]) => (
							<NavigationMenuItem key={group}>
								<NavigationMenuTrigger className="bg-transparent">
									{group}
								</NavigationMenuTrigger>
								<NavigationMenuContent>
									<ul className="min-w-48">
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
