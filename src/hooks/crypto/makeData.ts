import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import { sleep } from "@/utils";
import type { IArweaveData, IStrategyTx } from "@/types";

export const newEmptyArweaveTx = (nodeId: string): IArweaveData => {
	return {
		id: `empty${crypto.randomUUID()}`,
		nodeId,
	};
};

const newArweaveTx = (index: number): IStrategyTx => {
	if (index % 2 == 0) {
		return {
			cex: "binance",
			closeUnix: dayjs(faker.date.anytime()).unix(),
			coin: "PEPE",
			futuresClosePx: faker.number.float({ fractionDigits: 8 }),
			futuresCloseUsdt: faker.number.float({ fractionDigits: 8 }),
			futuresOpenPx: faker.number.float({ fractionDigits: 8 }),
			futuresOpenUsdt: faker.number.float({ fractionDigits: 8 }),
			futuresPositionSide: "SHORT",
			id: `${index + 1}`,
			nodeId: `${index + 1}`,
			openUnix: dayjs(faker.date.anytime()).unix(),
			pnl: faker.number.float({ fractionDigits: 8 }),
			pnlRatio: faker.number.float({ fractionDigits: 8 }),
			spotClosePx: faker.number.float({ fractionDigits: 8 }),
			spotCloseUsdt: faker.number.float({ fractionDigits: 8 }),
			spotOpenPx: faker.number.float({ fractionDigits: 8 }),
			spotOpenUsdt: faker.number.float({ fractionDigits: 8 }),
		};
	} else {
		return {
			cex: "binance",
			coin: "PEPE",
			futuresOpenPx: faker.number.float({ fractionDigits: 8 }),
			futuresOpenUsdt: faker.number.float({ fractionDigits: 8 }),
			futuresPositionSide: "SHORT",
			id: `${index + 1}`,
			nodeId: `${index + 1}`,
			openUnix: dayjs(faker.date.anytime()).unix(),
			spotOpenPx: faker.number.float({ fractionDigits: 8 }),
			spotOpenUsdt: faker.number.float({ fractionDigits: 8 }),
		};
	}
};

const range = (len: number) => {
	const arr: number[] = [];
	for (let i = 0; i < len; i++) {
		arr.push(i);
	}
	return arr;
};

export function makeData(...lens: number[]) {
	const makeDataLevel = (depth = 0): IStrategyTx[] => {
		const len = lens[depth]!;
		return range(len).map((d): IStrategyTx => {
			return newArweaveTx(d);
		});
	};

	return makeDataLevel();
}

const data = makeData(100);
export const fetchData = async (size: number, after?: string) => {
	const dbData = [...data];

	await sleep(2000);
	const start = Number(after ?? 0);
	const list = dbData.slice(start, start + size);
	let nextCursor: string | undefined = (start + size).toString();
	if (list.length == 0) {
		nextCursor = undefined;
	}
	return {
		list,
		nextCursor,
	};
};
