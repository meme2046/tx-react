import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { CreateTodo, Filters, Todos } from "@/components/valtio";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/valtio")({
	component: RouteComponent,
	head: () => ({
		meta: [
			{
				title: "Valtio Todo List",
			},
		],
	}),
});

function RouteComponent() {
	return (
		<div className="p-4">
			<Card className="mt-4 rounded-lg shadow-md text-primary">
				<CardHeader>
					<CardTitle className="text-2xl text-primary">
						Valtio Todo List ✏️
					</CardTitle>
					<CardDescription>
						A simple todo list using valtio
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Filters />
					<Todos />
					<CreateTodo />
				</CardContent>
			</Card>
		</div>
	);
}
