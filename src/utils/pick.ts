import { TROY_OUNCE_TO_GRAM } from "@/consts/comm";
import type { BasicInfo } from "@/types/Charts";
import { has, includes, pick, pickBy, round, toNumber } from "lodash";

export function mergeNonEmpty<T extends BasicInfo>(b: object, a: T) {
  const pickedB = pick(b, Object.keys(a));

  const filteredB: Partial<T> = pickBy(pickedB, (v) => v);
  if (includes(["XAUCNY", "XAGCNY"], a.code)) {
    filteredB.price = round(toNumber(filteredB.price) / TROY_OUNCE_TO_GRAM, 2);
    filteredB.increase = round(
      toNumber(filteredB.increase) / TROY_OUNCE_TO_GRAM,
      2,
    ).toString();
  } else {
    filteredB.price = toNumber(filteredB.price);
  }

  if (has(filteredB, "volume")) {
    (filteredB as Partial<BasicInfo>).volume = toNumber(filteredB.volume);
  }
  // 会被排除的值(假值)：
  // - undefined
  // - null
  // - "" (空字符串)
  // - false
  // - 0
  // - NaN
  // - 0n (BigInt 零)

  // 不会被排除的值（真值）：
  // - -1 (非零数字都是真值)
  // - 非空字符串
  // - 非空对象
  // - 非空数组
  // - true

  return { ...a, ...filteredB };
}
