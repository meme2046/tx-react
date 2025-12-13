import {proxy} from "valtio";

export type Status = "pending" | "completed";
export type Filter = Status | "all";
export type Todo = {
    description: string;
    status: Status;
    id: number;
    timeLeft?: number;
    timeout?: number;
};

export const todoState = proxy<{ filter: Filter; todos: Todo[] }>({
    filter: "all",
    todos: [],
});