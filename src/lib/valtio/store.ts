import { proxy } from "valtio";

interface IApp {
	progress: boolean;
	loaderDelay: number;
	githubDataURL: string;
	baiduGushitongURL: string;
}

const initialState: IApp = {
	progress: false,
	loaderDelay: 0,
	githubDataURL:
		"https://raw.githubusercontent.com/meme2046/data/refs/heads/main",
	baiduGushitongURL: "https://gushitong.baidu.com/opendata",
};

export const store = proxy<IApp>(initialState);

export function setProgress(p: boolean) {
	store.progress = p;
}
