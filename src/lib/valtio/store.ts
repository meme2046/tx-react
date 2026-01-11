import { proxy } from "valtio";

interface IApp {
  progress: boolean;
  loaderDelay: number;
  githubDataURL: string;
  redisBaseURL: string;
}

const initialState: IApp = {
  progress: false,
  loaderDelay: 0,
  githubDataURL:
    "https://raw.githubusercontent.com/meme2046/data/refs/heads/main",
  redisBaseURL: "http://192.168.123.7:8877",
  // https://meme.us.kg:8888
};

export const store = proxy<IApp>(initialState);

export function setProgress(p: boolean) {
  store.progress = p;
}
