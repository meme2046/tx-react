export interface IUser {
	id: number;
	name: string;
	email?: string;
	organization?: string;
	token?: string;
}

export interface IAuthForm {
	username: string;
	password: string;
}

export interface User {
	id: string;
	name: string;
	email: string;
	phone?: string;
	website?: string;
}
