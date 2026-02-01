import { proxy } from "valtio";

interface IApp {
  progress: boolean;
  loaderDelay: number;
  githubDataURL: string;
  redisBaseURL: string;
  qiniuBaseURL: string;
  qiniuCDNBaseURL: string;
}

export const valtioStoreInitialState: IApp = {
  progress: false,
  loaderDelay: 0,
  githubDataURL:
    "https://raw.githubusercontent.com/meme2046/data/refs/heads/main",
  redisBaseURL: "https://api.memeniu.xyz:8888",
  qiniuBaseURL: "https://memeniu.xyz",
  qiniuCDNBaseURL: "http://t9od1laib.sabkt.gdipper.com",
};

export const store = proxy<IApp>(valtioStoreInitialState);

export function setProgress(p: boolean) {
  store.progress = p;
}
