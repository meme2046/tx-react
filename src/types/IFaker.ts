export interface IFakerUser {
	id: number;
	name: string;
	age: number;
	role: string;
	team: string;
	email: string;
	status: string;
	avatar: string;
}

export interface IFakerInvoice {
	id: number;
	userId: number;
	title: string;
	body: string;
}
