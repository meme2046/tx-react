import { proxy } from "valtio";

interface IApp {
	progress: boolean;
}

const initialState: IApp = {
	progress: false,
};

export const store = proxy<IApp>(initialState);

export function setProgress(p: boolean) {
	store.progress = p;
}
