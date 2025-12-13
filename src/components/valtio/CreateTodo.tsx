import { useRef } from "react";
import { todoState } from "./TodoState";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export function CreateTodo() {
	const inputRef = useRef<HTMLInputElement>(null);
	const addTodo = (description: string) => {
		if (description.trim()) {
			todoState.todos.push({
				description: description.trim(),
				status: "pending",
				id: Date.now(),
			});
			if (inputRef.current) {
				inputRef.current.value = "";
			}
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			addTodo(inputRef.current?.value ?? "");
		}
	};

	return (
		<div className="flex gap-2 mt-4">
			<Input
				placeholder="输入新的待办事项"
				className="grow"
				ref={inputRef}
				onKeyDown={handleKeyDown}
			/>
			<Button onClick={() => addTodo(inputRef.current?.value ?? "")}>
				添加
			</Button>
		</div>
	);
}

export default CreateTodo;
