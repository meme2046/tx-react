import type { INav } from "@/types";

export const themes: Record<string, string> = {
	"🌞 light": "light",
	"🌌 dark": "dark",
};

const navSample: INav[] = [
	{ name: "home", emoj: "🏠", desc: "", value: "/sample/home" },
	{ name: "icon", emoj: "⭐", desc: "", value: "/sample/icon" },
	{ name: "avatar", emoj: "😎", desc: "头像", value: "/sample/avatar" },
	{ name: "valtio-todo", emoj: "💊", desc: "", value: "/sample/valtio-todo" },
	{ name: "table", emoj: "📦", desc: "", value: "/sample/table" },
	{ name: "text", emoj: "📝", desc: "", value: "/text" },
	{ name: "test", emoj: "🧪", desc: "", value: "/sample/test" },
];

const navCron: INav[] = [
	{ name: "api", emoj: "🧩", desc: "设置定时任务API", value: "/cron/api" },
	{ name: "job", emoj: "🤖", desc: "", value: "/cron/job" },
	{ name: "log", emoj: "📋", desc: "", value: "/cron/log" },
	{ name: "config", emoj: "⚙️", desc: "", value: "/cron/config" },
	{
		name: "worker",
		emoj: "🖥️",
		desc: "当前任务执行节点",
		value: "/cron/worker",
	},
];

const navCrypto: INav[] = [
	{ name: "关注币种", emoj: "🪙", desc: "", value: "/crypto/coin" },
	{ name: "Bitget网格", emoj: "🐶", desc: "", value: "/crypto/bitget" },
	{ name: "Gate网格", emoj: "🐷", desc: "", value: "/crypto/gate" },
	// { name: "币安合约", emoj: "🐸", desc: "", value: "/crypto/bnfutures" },
	// { name: "赚币", emoj: "🐸", desc: "", value: "/crypto/zb" },
	// { name: "策略交易", emoj: "🦄", desc: "", value: "/crypto/strategy" },
	// { name: "土狗", emoj: "🐶", desc: "", value: "/crypto/meme" },
	{ name: "恐贪指数", emoj: "🐝", desc: "", value: "/crypto/fg" },

	// { name: "网格交易", emoj: "🧮", desc: "", value: "/crypto/grid-tx" },
	// { name: "收益曲线", emoj: "🚀", desc: "", value: "/crypto/chart" },
	// { name: "联系我们", emoj: "🌱", desc: "", value: "/crypto/contact" },
];

export const navLottery: INav[] = [
	{ name: "d3", emoj: "🍀", desc: "", value: "/lottery/d3" },
	{ name: "p3", emoj: "🍀", desc: "", value: "/lottery/p3" },
	// { name: "3d-telegram", emoj: "🍃", desc: "", value: "/lottery/3d" },
	// ☘️🍀🍃
	// { name: "ssq", emoj: "🎰", desc: "", value: "/lottery/ssq" },
];

export const navList: Record<string, INav[]> = {
	Crypto: navCrypto,
	Cron: navCron,
	// Lottery: navLottery,
	Sample: navSample,
};
