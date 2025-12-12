import { useCallback, useEffect } from "react";

import { sleep } from "@/utils";
import { storePersist, setTheme, setUser } from "@/lib/valtio";
import { useSnapshot } from "valtio";
import type { IAuthForm } from "@/types";
import { AppContext } from "./app-context";

export function AppProvider({ children }: { children: React.ReactNode }) {
	const { user, theme } = useSnapshot(storePersist);

	const logout = useCallback(async () => {
		await sleep(5000);
		setUser(undefined);
		// navigate("/", { replace: true });
	}, []);

	const login = useCallback(async (data: IAuthForm) => {
		// http<IUser>("", { method: "post", data }).then((data) => {
		// 	setUser(data);
		// 	// navigate("/profile");
		// });
		console.log(data.username);
		await sleep(5000);
		setUser({ id: 1, name: data.username });
	}, []);

	useEffect(() => {
		const root = window.document.documentElement;
		root.classList.remove("light", "dark");

		if (theme === "system") {
			const systemTheme = window.matchMedia(
				"(prefers-color-scheme: dark)"
			).matches
				? "dark"
				: "light";

			root.classList.add(systemTheme);
			setTheme(systemTheme);
			return;
		}

		root.classList.add(theme);
	}, [theme]);

	return (
		<AppContext.Provider value={{ login, logout, user, theme }}>
			{children}
		</AppContext.Provider>
	);
}
