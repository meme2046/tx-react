import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ICON_SRC } from "@/consts";
import { createFileRoute } from "@tanstack/react-router";
import { ReactSVG } from "react-svg";
export const Route = createFileRoute("/_layout/text")({
	component: RouteComponent,
	head: () => ({
		meta: [
			{
				title: "Text",
			},
		],
	}),
});

function RouteComponent() {
	const alertData: { type: string; label: string }[] = [
		{ type: "primary", label: "default" },
		{ type: "secondary", label: "secondary" },
		{ type: "destructive", label: "destructive" },
		{ type: "muted", label: "outline" },
		{ type: "accent", label: "outline" },
	];
	const renderAlert = (type: string, label: string) => (
		<Alert key={type}>
			<AlertTitle className="flex">
				<Button variant={label as "default"}>
					<ReactSVG src={ICON_SRC["rocket"]} />
					{type}
				</Button>
			</AlertTitle>
			<AlertDescription>
				<p className={`text-${type}`}>text-{type}</p>
				<p className={`bg-${type} text-${type}-foreground`}>
					bg-{type} | text-{type}-foreground
				</p>
				<p className={`bg-${type}-foreground text-${type}`}>
					bg-{type}-foreground | text-{type}
				</p>
			</AlertDescription>
		</Alert>
	);
	return (
		<div className="p-4 flex flex-col gap-4">
			<Alert>
				<AlertTitle>字体</AlertTitle>
				<AlertDescription>
					<p className="font-sans">
						font-sans:-&gt;&nbsp;-&gt;&nbsp;中文 | English
					</p>
					<p className="font-serif">font-serif:-&gt;&nbsp;中文 | English</p>
					<p className="font-mono">font-mono:-&gt;&nbsp;中文 | English</p>
					<p className="font-[Caps]">
						Delius Swash Caps:-&gt;&nbsp;中文 | English
					</p>
				</AlertDescription>
			</Alert>
			{alertData.map(({ type, label }) => renderAlert(type, label))}
		</div>
	);
}
