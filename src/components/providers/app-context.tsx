import { createContext } from "react";
import type { IAuthForm, IUser } from "@/types";

export interface IAppContext {
	login: (data: IAuthForm) => Promise<void>;
	logout: () => Promise<void>;
	user?: IUser;
	theme: string;
}
export const AppContext = createContext<IAppContext | undefined>(undefined);
