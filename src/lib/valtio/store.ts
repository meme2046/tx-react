import { proxy } from "valtio";

interface IApp {
  progress: boolean;
  loaderDelay: number;
  githubDataURL: string;
  redisBaseURL: string;
  qiniuBaseURL: string;
}

const initialState: IApp = {
  progress: false,
  loaderDelay: 0,
  githubDataURL:
    "https://raw.githubusercontent.com/meme2046/data/refs/heads/main",
  redisBaseURL: "https://api.memeniu.xyz:8888",
  qiniuBaseURL: "https://memeniu.xyz",
};

export const store = proxy<IApp>(initialState);

export function setProgress(p: boolean) {
  store.progress = p;
}
