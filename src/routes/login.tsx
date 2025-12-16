import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { redirect, useRouter, useRouterState } from "@tanstack/react-router";
import { z } from "zod";

import { useApp } from "@/hooks/use-app";

const fallback = "/dashboard" as const;

export const Route = createFileRoute("/login")({
	validateSearch: z.object({
		redirect: z.string().optional().catch(""),
	}),
	beforeLoad: ({ context, search }) => {
		if (context.app.user) {
			throw redirect({ to: search.redirect || fallback });
		}
	},
	component: RouteComponent,
	head: () => ({
		meta: [
			{
				title: "Login",
			},
		],
	}),
});

function RouteComponent() {
	const app = useApp();
	const router = useRouter();
	const isLoading = useRouterState({ select: (s) => s.isLoading });
	const navigate = Route.useNavigate();
	const [isSubmitting, setIsSubmitting] = React.useState(false);

	const search = Route.useSearch();

	const onFormSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
		setIsSubmitting(true);
		try {
			evt.preventDefault();
			const data = new FormData(evt.currentTarget);
			const uFieldValue = data.get("username");
			const pFieldValue = data.get("password");

			if (!uFieldValue || !pFieldValue) return;
			const username = uFieldValue.toString();
			const password = pFieldValue.toString();
			await app?.login({ username, password });

			console.log(app?.user);

			await router.invalidate();

			await navigate({ to: search.redirect || fallback });
		} catch (error) {
			console.error("Error logging in: ", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const isLoggingIn = isLoading || isSubmitting;

	return (
		<div className="p-2 grid gap-2 place-items-center">
			<h3 className="text-xl">Login page</h3>
			{search.redirect ? (
				<p className="text-red-500">You need to login to access this page.</p>
			) : (
				<p>Login to see all the cool content in here.</p>
			)}
			<form className="mt-4 max-w-lg" onSubmit={onFormSubmit}>
				<fieldset disabled={isLoggingIn} className="w-full grid gap-2">
					<div className="grid gap-2 items-center min-w-75">
						<input
							id="username-input"
							name="username"
							placeholder="Enter your name"
							type="text"
							className="border rounded-md p-2 w-full"
							required
						/>
						<input
							id="password-input"
							name="password"
							placeholder="Enter your password"
							type="password"
							className="border rounded-md p-2 w-full"
							required
						/>
					</div>
					<button
						type="submit"
						className="bg-blue-500 text-white py-2 px-4 rounded-md w-full disabled:bg-gray-300 disabled:text-gray-500"
					>
						{isLoggingIn ? "Loading..." : "Login"}
					</button>
				</fieldset>
			</form>
		</div>
	);
}
