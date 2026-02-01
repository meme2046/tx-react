import { valtioStoreInitialState } from "@/lib/valtio/store";

export function getQiniuSrc(
  key: string,
  type: "icon" | "svg" | "avatar" | "img",
): string {
  switch (type) {
    case "icon":
      return `${valtioStoreInitialState.qiniuCDNBaseURL}/icons/${key}.svg`;
    case "svg":
      return `${valtioStoreInitialState.qiniuCDNBaseURL}/svgs/${key}.svg`;
    case "avatar":
      return `${valtioStoreInitialState.qiniuCDNBaseURL}/avatars/${key}.png`;
    case "img":
      return `${valtioStoreInitialState.qiniuCDNBaseURL}/images/${key}.png`;
    default:
      throw new Error(`✘ type ${type} not supported`);
  }
}
