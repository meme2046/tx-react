import React from "react";
import { useSnapshot } from "valtio";
import { type Status, todoState } from "./TodoState";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";

export const Todos: React.FC = () => {
	const snap = useSnapshot(todoState);
	const toggleDone = (id: number, currentStatus: Status) => {
		const nextStatus =
			currentStatus === "pending" ? "completed" : "pending";
		const todo = todoState.todos.find((todo) => todo.id === id);
		if (todo) {
			todo.status = nextStatus;
		}
	};

	const removeTodo = (id: number) => {
		const index = todoState.todos.findIndex((todo) => todo.id === id);
		if (index >= 0) {
			todoState.todos.splice(index, 1);
		}
	};

	return (
		<Table aria-label="Valtio todo list" className="w-full">
			<TableHeader>
				<TableRow className="bg-muted">
					<TableHead className="w-16">ID</TableHead>
					<TableHead className="w-24">状态</TableHead>
					<TableHead>描述</TableHead>
					<TableHead className="w-48">操作</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{snap.todos
					.filter(
						({ status }) =>
							status === snap.filter || snap.filter === "all"
					)
					.map(({ description, status, id }) => {
						return (
							<TableRow key={id} className="hover:bg-muted/50">
								<TableCell>{id}</TableCell>
								<TableCell>
									<span
										className={`px-2 py-1 rounded-full text-xs ${
											status === "completed"
												? "bg-success text-success-foreground"
												: "bg-warning text-warning-foreground"
										}`}
									>
										{status === "completed"
											? "已完成"
											: "待处理"}
									</span>
								</TableCell>
								<TableCell>{description}</TableCell>
								<TableCell>
									<Button
										variant="outline"
										size="sm"
										className="mr-2"
										onClick={() => toggleDone(id, status)}
									>
										{status === "completed"
											? "标记未完成"
											: "标记完成"}
									</Button>
									<Button
										variant="destructive"
										size="sm"
										onClick={() => removeTodo(id)}
									>
										删除
									</Button>
								</TableCell>
							</TableRow>
						);
					})}
			</TableBody>
		</Table>
	);
};

export default Todos;
