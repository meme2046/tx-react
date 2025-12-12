import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";

export function Navbar() {
	return (
		<nav className="py-1 text-sm flex justify-around items-stretch sticky top-0 z-40 inset-x-0 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="flex items-center">
				<SidebarTrigger className="text-primary hover:text-success" />
				<Link to="/">
					<Button variant="ghost" className="py-0 px-1">
						<span className="text-primary">Meme2046</span>
					</Button>
				</Link>
			</div>
			<div className="hidden sm:flex">
				<NavigationMenu>
					<NavigationMenuList>
						{Object.entries(navList).map(([group, items]) => (
							<NavigationMenuItem key={group}>
								<NavigationMenuTrigger className="bg-transparent">
									{group}
								</NavigationMenuTrigger>
								<NavigationMenuContent>
									<ul className="flex flex-col p-2 min-w-96">
										{renderMenuItems({ items })}
									</ul>
								</NavigationMenuContent>
							</NavigationMenuItem>
						))}
					</NavigationMenuList>
				</NavigationMenu>
			</div>
			<ToggleTheme />
		</nav>
	);
}
