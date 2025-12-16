import { Combobox } from "@/components/combobox";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ICON_SRC } from "@/consts";
import { createFileRoute } from "@tanstack/react-router";
import { ReactSVG } from "react-svg";
import processSvg from "@/assets/processing.svg";

export const Route = createFileRoute("/_layout/tests")({
	component: RouteComponent,
	head: () => ({
		meta: [
			{
				title: "Tests",
			},
		],
	}),
});

function RouteComponent() {
	return (
		<div className="flex flex-col gap-4">
			<p>Hello "/_layout/test"!</p>
			<Checkbox id="terms-2" />
			<Combobox
				list={[
					{ name: "item1", value: "1" },
					{ name: "item2", value: "2" },
				]}
			/>

			<div className="flex gap-1">
				<Button variant="outline" size="icon">
					<ReactSVG
						src={ICON_SRC["refresh"]}
						className={`text-primary animate-spin`}
					/>
				</Button>
				<Button variant="ghost" size="icon" className="rounded-full">
					<ReactSVG src={processSvg} className="text-primary animate-spin" />
				</Button>
				<Button variant="ghost" size="icon" className="rounded-full">
					<ReactSVG src={processSvg} className="text-primary" />
				</Button>
				<Button variant="outline" className="gap-1">
					<ReactSVG
						src={ICON_SRC["processing"]}
						className=" text-lime-500 animate-spin"
					/>
					<span className="text-xs">processing</span>
				</Button>
			</div>
		</div>
	)
}
