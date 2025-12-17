import { createFileRoute } from "@tanstack/react-router";
import { ProgressSpinner } from "@/components/progress-spinner";
import { Button } from "@/components/ui/button";
import { useSnapshot } from "valtio";
import { storePersist, setProgress } from "@/lib/valtio";
import { ReactSVG } from "react-svg";
import { SVG_SRC } from "@/consts";
import { useState } from "react";

export const Route = createFileRoute("/about")({
	component: RouteComponent,
	head: () => ({
		meta: [
			{
				title: "About",
			},
		],
	}),
});

function RouteComponent() {
	const { theme } = useSnapshot(storePersist);
	const [count, setCount] = useState(0);
	return (
		<div className="font-[DSC] space-y-10">
			<ProgressSpinner />
			<div className="flex flex-col justify-center items-center">
				<p>This is the About page! </p>
				<p>theme: {theme}</p>
			</div>
			<div className="flex gap-10 justify-center p-4">
				<ReactSVG
					wrapper="div"
					src={SVG_SRC["vite"]}
					className="w-16 hover:drop-shadow-[0_0_2em_#646cffaa]"
				/>
				<ReactSVG
					wrapper="div"
					src={SVG_SRC["react"]}
					className="w-16 hover:drop-shadow-[0_0_2em_#61dafbaa] animate-spin animate-infinite animate-duration-20000 animate-ease-linear"
				/>
			</div>
			<div className="flex justify-center space-x-4">
				<Button
					onClick={() => {
						setProgress(true);
					}}
					variant="outline"
					className="cursor-pointer"
				>
					ProgressSpinner
				</Button>
				<Button
					variant="default"
					className="cursor-pointer"
					onClick={() => setCount((count) => count + 1)}
				>
					<span className="text-lg">count is</span>
					<span className="text-xl">_{count}</span>
				</Button>
			</div>
		</div>
	);
}
