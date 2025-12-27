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

// 通用的卡片组件
interface CardComponentProps {
	title: string;
	icon: string;
	type: "icon" | "svg" | "avatar" | "image";
	items: Record<string, string>;
}

function CardComponent({ title, icon, type, items }: CardComponentProps) {
	const renderItem = (key: string, src: string) => {
		switch (type) {
			case "icon":
			case "svg":
				return (
					<Button variant="outline" className="gap-1">
						<ReactSVG
							src={src}
							className={type === "icon" ? "text-primary w-6" : "w-8"}
						/>
						<span className="text-xs">{key}</span>
					</Button>
				);
			case "avatar":
				return (
					<div className="text-center">
						<Avatar>
							<AvatarImage src={src} alt={upperCase(key)} />
							<AvatarFallback className="animate-pulse bg-linear-to-tr from-secondary to-primary"></AvatarFallback>
						</Avatar>
						<span className="mt-1 text-xs text-muted-foreground">{key}</span>
					</div>
				);
			case "image":
				return (
					<div className="text-center">
						<img src={src} alt={upperCase(key)} className="w-24" />
						<span className="mt-1 text-xs text-muted-foreground">{key}</span>
					</div>
				);
		}
	};

	return (
		<Card className="py-0 gap-0 hover:bg-muted">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<img className="w-12 rounded-full" src={icon} alt={`@${title}`} />
					<span className="text-lg font-semibold text-primary">{title}</span>
				</CardTitle>
			</CardHeader>
			<Separator
				className={type === "avatar" || type === "image" ? "bg-primary/20" : ""}
			/>
			<CardContent className="p-4 flex gap-4 flex-wrap justify-center">
				{Object.keys(items).map((key) => (
					<div key={key} className="flex flex-col items-center">
						{renderItem(key, items[key])}
					</div>
				))}
			</CardContent>
		</Card>
	);
}

function RouteComponent() {
	return (
		<div className="flex flex-col gap-6 bg-slash p-4">
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

			<CardComponent
				title="ICON"
				icon={AVATAR_SRC["65"]}
				type="icon"
				items={ICON_SRC}
			/>

			<CardComponent
				title="SVG"
				icon={AVATAR_SRC["71"]}
				type="svg"
				items={SVG_SRC}
			/>

			<CardComponent
				title="头像"
				icon="https://github.com/shadcn.png"
				type="avatar"
				items={AVATAR_SRC}
			/>

			<CardComponent
				title="图片"
				icon={IMG_SRC["au888"]}
				type="image"
				items={IMG_SRC}
			/>
		</div>
	);
}
