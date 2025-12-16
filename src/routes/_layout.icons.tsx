import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AVATAR_SRC, ICON_SRC, SVG_SRC } from "@/consts";
import { createFileRoute } from "@tanstack/react-router";
import { ReactSVG } from "react-svg";

export const Route = createFileRoute("/_layout/icons")({
	component: RouteComponent,
	head: () => ({
		meta: [
			{
				title: "Icons",
			},
		],
	}),
});

function RouteComponent() {
	return (
		<div className="p-4 flex flex-col gap-6">
			<div className="flex gap-2 flex-wrap justify-center">
				<Badge>primary</Badge>
				<Badge variant="default">default</Badge>
				<Badge variant="secondary">secondary</Badge>
				<Badge variant="destructive">destructive</Badge>
				<Badge variant="outline">outline</Badge>
			</div>
			<div className="flex gap-2 flex-wrap justify-center">
				<Button size="default" variant="default">
					Default
				</Button>
				<Button variant="secondary">Secondary</Button>
				<Button variant="destructive">Destructive</Button>
				<Button variant="outline">Outline</Button>
				<Button variant="link">Link</Button>
				<Button variant="ghost">Ghost</Button>
			</div>
			<Card className="bg-card shadow-md rounded-md">
				<CardHeader className="py-1 rounded-t-md">
					<CardTitle className="flex items-center gap-3 text-primary">
						<Avatar className="ring">
							<AvatarImage src={AVATAR_SRC["6"]} alt="6" />
							<AvatarFallback className="animate-pulse bg-linear-to-tr from-info to-primary"></AvatarFallback>
						</Avatar>
						<span className="text-lg font-semibold">Icons</span>
					</CardTitle>
				</CardHeader>
				<Separator />
				<CardContent className="p-4 flex gap-4 flex-wrap justify-center">
					{Object.keys(ICON_SRC).map((item) => (
						<div key={item} className="flex flex-col items-center">
							<Button variant="outline" className="gap-1">
								<ReactSVG src={ICON_SRC[item]} className="text-primary" />
								<span className="text-xs">{item}</span>
							</Button>
						</div>
					))}
				</CardContent>
			</Card>
			<Card className="bg-card shadow-md rounded-md">
				<CardHeader className="py-1 rounded-t-md">
					<CardTitle className="flex items-center gap-3 text-primary">
						<Avatar className="ring">
							<AvatarImage src={AVATAR_SRC["71"]} alt="71" />
							<AvatarFallback className="animate-pulse bg-linear-to-tr from-info to-primary"></AvatarFallback>
						</Avatar>
						<span className="text-lg font-semibold">SVGs</span>
					</CardTitle>
				</CardHeader>
				<Separator />
				<CardContent className="p-4 flex gap-4 flex-wrap justify-center">
					{Object.keys(SVG_SRC).map((item) => (
						<div key={item} className="flex flex-col items-center">
							<Button variant="outline" className="gap-1">
								<ReactSVG src={SVG_SRC[item]} />
								<span className="text-xs">{item}</span>
							</Button>
						</div>
					))}
				</CardContent>
			</Card>
		</div>
	);
}
