import { Expand } from "@theme-toggles/react";
import { themes } from "./layout/list.ts";
import { storePersist, setTheme } from "@/lib/valtio";
import { useSnapshot } from "valtio";

export const ToggleTheme = () => {
	const { theme } = useSnapshot(storePersist);

	return (
		// @ts-expect-error: Type mismatch, but safe to ignore
		<Expand
			reversed={false}
			title="toggle theme"
			placeholder="toggle theme"
			className={`fixed top-1 right-1 rounded text-3xl text-primary z-50`}
			duration={500}
			toggled={Object.values(themes)[1] === theme}
			onToggle={(isToggled) => {
				if (isToggled) {
					setTheme(Object.values(themes)[1]);
				} else {
					setTheme(Object.values(themes)[0]);
				}
			}}
		/>
	);
};
