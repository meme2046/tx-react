import type { IUser } from "@/types";
import { persist } from "valtio-persist";

interface IAppPersist {
  theme: string;
  lang?: string;
  cronURL?: string;
  user?: IUser;
  USDToCNY: number;
}

const initialState: IAppPersist = {
  theme: "system",
  cronURL: "https://192.168.123.7:8000",
  USDToCNY: 6.96,
};

// Create a persisted store
export const { store: storePersist } = await persist<IAppPersist>(
  // Initial state
  initialState,
  // Storage key
  "tx-react-state",
);

export function setUser(user?: IUser) {
  storePersist.user = user;
}

export function setCronURL(url?: string) {
  storePersist.cronURL = url;
}

export function setLang(lang: string) {
  storePersist.lang = lang;
}

export function setTheme(theme: string) {
  storePersist.theme = theme;
}

export function setUSDToCNY(USDToCNY: number) {
  storePersist.USDToCNY = USDToCNY;
}
