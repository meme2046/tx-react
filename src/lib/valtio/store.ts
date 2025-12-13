import { proxy } from "valtio";

interface IApp {
	progress: boolean;
	loaderDelay: number;
}

const initialState: IApp = {
	progress: false,
	loaderDelay: 0,
};

export const store = proxy<IApp>(initialState);

export function setProgress(p: boolean) {
	store.progress = p;
}
