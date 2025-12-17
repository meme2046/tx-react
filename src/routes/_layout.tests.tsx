import { Combobox } from "@/components/combobox";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ICON_SRC, SVG_SRC } from "@/consts";
import { createFileRoute } from "@tanstack/react-router";
import { ReactSVG } from "react-svg";
import lineSVG from "@/assets/line.svg";

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
					<ReactSVG
						src={ICON_SRC["processing"]}
						className="text-primary animate-spin"
					/>
				</Button>
				<Button variant="ghost" size="icon" className="rounded-full">
					<ReactSVG src={ICON_SRC["processing"]} className="text-primary" />
				</Button>
				<Button variant="outline" className="gap-1">
					<ReactSVG
						src={ICON_SRC["processing"]}
						className=" text-lime-500 animate-spin"
					/>
					<span className="text-xs">processing</span>
				</Button>
				<ReactSVG src={lineSVG} className="text-primary w-64" />
				<ReactSVG src={SVG_SRC["line"]} className="text-primary w-64" />
			</div>
			<div className="flex gap-4">
				<div className="size-50 border bg-[repeating-linear-gradient(45deg,var(--background)_0px,var(--background)_13px,var(--muted)_13px,var(--muted)_14px)]">
					斜线背景
				</div>
				<div className="size-50 border bg-size-[5px_5px] bg-radial-[at_50%_50%] from-foreground/50 from-0% to-transparent to-10%">
					dot背景
				</div>
				<div className="size-50 border bg-slash">斜线背景</div>
				<div className="size-50 border bg-dot">dot背景</div>
			</div>
		</div>
	);
}
