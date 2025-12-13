import { faker } from "@faker-js/faker";
import type { IFakerUser } from "@/types";
import { sleep } from "@/utils";

const roles = [
	"CEO",
	"Tech Lead",
	"Sr. Dev",
	"C.M.",
	"S. Manager",
	"P. Manager",
	"Designer",
	"HR Manager",
	"F. Manager",
	"Ops Manager",
	"Jr. Dev",
	"M. Specialist",
	"IT Specialist",
	"Manager",
	"Data Analyst",
	"QA Analyst",
	"Administrator",
	"Coordinator",
];
const status = ["active", "paused", "vacation"];
const team = [
	"Management",
	"Development",
	"Marketing",
	"Sales",
	"Design",
	"HR",
	"Finance",
	"Operations",
	"Product",
	"Security",
	"I. Technology",
	"Analysis",
	"Testing",
	"Information Technology",
];

const newFakerUser = (index: number): IFakerUser => {
	return {
		id: index + 1,
		name: faker.person.fullName(),
		role: faker.string.fromCharacters(roles),
		team: faker.string.fromCharacters(team),
		status: faker.string.fromCharacters(status),
		age: faker.number.int({ min: 18, max: 60 }),
		avatar: faker.image.avatar(),
		email: faker.internet.email(),
	};
};
const range = (len: number) => {
	const arr: number[] = [];
	for (let i = 0; i < len; i++) {
		arr.push(i);
	}
	return arr;
};

function makeData(...lens: number[]) {
	const makeDataLevel = (depth = 0): IFakerUser[] => {
		const len = lens[depth]!;
		return range(len).map((d): IFakerUser => {
			return newFakerUser(d);
		});
	};

	return makeDataLevel();
}

const data = makeData(100);

export const fetchFakerUser = async (size: number, cursor?: number) => {
	await sleep(2000);
	const start = cursor ?? 0;
	const list = data.slice(start, start + size);
	let nextCursor: number | undefined = start + size;
	if (list.length == 0) {
		nextCursor = undefined;
	}
	return {
		list,
		nextCursor,
	};
};
