import type { INav } from "@/types";

export const themes: Record<string, string> = {
  "🌞 light": "light",
  "🌌 dark": "dark",
};

const navDemo: INav[] = [
  { name: "icons", emoj: "⭐", desc: "", value: "/icons" },
  { name: "valtio", emoj: "💊", desc: "", value: "/valtio" },
  { name: "text", emoj: "📝", desc: "", value: "/text" },
  { name: "tests", emoj: "🧪", desc: "", value: "/tests" },
  { name: "basic table", emoj: "", desc: "", value: "/table-basic" },
  {
    name: "pagination table",
    emoj: "",
    desc: "",
    value: "/table-pagination",
  },
];

export const navOther: INav[] = [
  { name: "about", emoj: "🔎", desc: "", value: "/about" },
  { name: "dashboard", emoj: "🎛️", desc: "", value: "/dashboard" },
  { name: "invoices", emoj: "🧾", desc: "", value: "/invoices" },
  { name: "login", emoj: "🛡️", desc: "", value: "/login" },
];

const navCron: INav[] = [
  { name: "api", emoj: "🧩", desc: "设置定时任务API", value: "/cron-api" },
  { name: "job", emoj: "🤖", desc: "", value: "/cron-jobs" },
  { name: "log", emoj: "📋", desc: "", value: "/cron-logs" },
  { name: "config", emoj: "⚙️", desc: "", value: "/cron-config" },
  {
    name: "worker",
    emoj: "🖥️",
    desc: "当前任务执行节点",
    value: "/cron-worker",
  },
];

const navCrypto: INav[] = [
  { name: "恐贪指数", emoj: "🐝", desc: "", value: "/fear-greed" },
  { name: "关注币种", emoj: "🪙", desc: "", value: "/coingecko" },
  {
    name: "Bitget FF",
    emoj: "🍀",
    desc: "",
    value: "/bitget-ff",
  },
  {
    name: "Bitget SF",
    emoj: "🚀",
    desc: "",
    value: "/bitget-sf",
  },
  { name: "Bitget Grid", emoj: "🐶", desc: "", value: "/bitget-grid" },
  { name: "Gate Grid", emoj: "🐷", desc: "", value: "/gate-grid" },
  // { name: "股市图表", emoj: "📈", desc: "", value: "/echarts/gushi" },
  { name: "加密货币图表", emoj: "📊", desc: "", value: "/g2/crypto" },
];

export const navLottery: INav[] = [
  { name: "d3", emoj: "🍀", desc: "", value: "/lottery/d3" },
  { name: "p3", emoj: "🍀", desc: "", value: "/lottery/p3" },
];

export const navList: Record<string, INav[]> = {
  Crypto: navCrypto,
  Cron: navCron,
  // Demo: navDemo,
};

export const sideNavList: Record<string, INav[]> = {
  Crypto: navCrypto,
  Cron: navCron,
  Demo: navDemo,
  Other: navOther,
};
