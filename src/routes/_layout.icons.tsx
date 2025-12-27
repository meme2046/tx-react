import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AVATAR_SRC, ICON_SRC, IMG_SRC, SVG_SRC } from "@/consts";
import { createFileRoute } from "@tanstack/react-router";
import { upperCase } from "lodash";
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
		<div className="flex flex-col gap-6 bg-slash">
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
			<Card className="py-0 gap-0">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<img
							className="w-12 rounded-full"
							src={AVATAR_SRC["65"]}
							alt="@shadcn"
						/>
						<span className="text-lg font-semibold text-primary">ICON</span>
					</CardTitle>
				</CardHeader>
				<Separator />
				<CardContent className="p-4 flex gap-4 flex-wrap justify-center">
					{Object.keys(ICON_SRC).map((item) => (
						<div key={item} className="flex flex-col items-center">
							<Button variant="outline" className="gap-1">
								<ReactSVG src={ICON_SRC[item]} className="text-primary w-6" />
								<span className="text-xs">{item}</span>
							</Button>
						</div>
					))}
				</CardContent>
			</Card>
			<Card className="py-0 gap-0">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<img
							className="w-12 rounded-full"
							src={AVATAR_SRC["71"]}
							alt="@shadcn"
						/>
						<span className="text-lg font-semibold text-primary">SVG</span>
					</CardTitle>
				</CardHeader>
				<Separator />
				<CardContent className="p-4 flex gap-4 flex-wrap justify-center">
					{Object.keys(SVG_SRC).map((item) => (
						<div key={item} className="flex flex-col items-center">
							<Button variant="outline" className="gap-1">
								<ReactSVG src={SVG_SRC[item]} className="w-8" />
								<span className="text-xs">{item}</span>
							</Button>
						</div>
					))}
				</CardContent>
			</Card>
			<Card className="py-0 gap-0">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<img
							className="w-12 rounded-full"
							src="https://github.com/shadcn.png"
							alt="@shadcn"
						/>
						<span className="text-lg font-semibold text-primary">头像</span>
					</CardTitle>
				</CardHeader>

				<Separator className="bg-primary/20" />
				<CardContent className="p-3">
					<div className="flex flex-wrap gap-4">
						{Object.keys(AVATAR_SRC).map((key, index) => (
							<div key={index} className="text-center">
								<Avatar>
									<AvatarImage src={AVATAR_SRC[key]} alt={upperCase(key)} />
									<AvatarFallback className="animate-pulse bg-linear-to-tr from-secondary to-primary"></AvatarFallback>
								</Avatar>
								<span className="mt-1 text-xs text-muted-foreground">
									{key}
								</span>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			<Card className="py-0 gap-0 hover:bg-accent">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<img
							className="w-12 rounded-full"
							src={IMG_SRC["au888"]}
							alt="au888"
						/>
						<span className="text-lg font-semibold text-primary">图片</span>
					</CardTitle>
				</CardHeader>

				<Separator className="bg-primary/20" />
				<CardContent className="p-3">
					<div className="flex flex-wrap gap-4">
						{Object.keys(IMG_SRC).map((key, index) => (
							<div key={index} className="text-center">
								<img src={IMG_SRC[key]} alt={upperCase(key)} className="w-24" />
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
