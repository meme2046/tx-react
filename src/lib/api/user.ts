import type { User } from "@/types";

// 模拟 API 延迟
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getUsers(): Promise<User[]> {
	// 模拟 API 请求
	await delay(300);
	const users: User[] = [
		{ id: "1", name: "John Doe", email: "john@example.com" },
		{ id: "2", name: "Jane Smith", email: "jane@example.com" },
		{ id: "3", name: "Bob Johnson", email: "bob@example.com" },
	];
	return users;
}

export async function getUser(id: string): Promise<User> {
	// 模拟 API 请求
	await delay(200);
	// 模拟根据ID获取用户
	const users = await getUsers();
	const user = users.find((u) => u.id === id);

	if (!user) {
		throw new Response("User Not Found", { status: 404 });
	}

	return user;
}

export async function createUser(userData: Omit<User, "id">): Promise<User> {
	// 模拟创建用户
	await delay(400);
	const newUser: User = {
		...userData,
		id: Math.random().toString(36).substring(2, 9),
	};
	console.log("Creating user:", newUser);
	return newUser;
}
