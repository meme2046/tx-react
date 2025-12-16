import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AVATAR_SRC } from "@/consts";
import { createFileRoute } from "@tanstack/react-router";
import { upperCase } from "lodash";

export const Route = createFileRoute("/_layout/avatars")({
	component: RouteComponent,
	head: () => ({
		meta: [
			{
				title: "Avatars",
			},
		],
	}),
});

function RouteComponent() {
	return (
		<div className="p-4">
			<Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
				<CardHeader className="py-2">
					<CardTitle className="flex items-center gap-2 text-xl font-bold text-primary">
						<Avatar>
							<AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
							<AvatarFallback className="animate-pulse bg-linear-to-tr from-info to-primary"></AvatarFallback>
						</Avatar>
						<span>头像展示墙</span>
					</CardTitle>
				</CardHeader>
				<Separator className="bg-primary/20" />
				<CardContent className="p-3">
					<div className="flex flex-wrap gap-4">
						{Object.keys(AVATAR_SRC).map((key, index) => (
							<div key={index}>
								<Avatar>
									<AvatarImage src={AVATAR_SRC[key]} alt={upperCase(key)} />
									<AvatarFallback className="animate-pulse bg-linear-to-tr from-info to-primary"></AvatarFallback>
								</Avatar>
								<span className="mt-1 text-xs text-muted-foreground">
									{key}
								</span>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
