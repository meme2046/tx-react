import { createFileRoute } from "@tanstack/react-router";
import { ProgressSpinner } from "@/components";
import { Button } from "@/components/ui/button";
import { useSnapshot } from "valtio";
import { storePersist, setProgress } from "@/lib/valtio";
export const Route = createFileRoute("/about")({
	component: About,
});
function About() {
	const { theme } = useSnapshot(storePersist);
	return (
		<>
			<ProgressSpinner />
			<div className="p-2">Hello from About!</div>
			<Button
				onClick={() => {
					setProgress(true);
				}}
				variant="outline"
			>
				ProgressSpinner
			</Button>
			<p>{theme}</p>
		</>
	);
}
