export interface IInfiniteList<T extends object> {
	list: T[];
	prevCursor?: string;
	nextCursor?: string;
}
