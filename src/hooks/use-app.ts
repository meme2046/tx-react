import { AppContext } from "@/components/providers";
import { useContext } from "react";

export function useApp() {
	const context = useContext(AppContext);

	if (context === undefined)
		throw new Error("useApp must be used within a AppProvider");

	return context;
}
