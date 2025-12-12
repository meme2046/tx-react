export interface ICronLogList {
	total: number;
	items: ICronLog[];
	prevCursor?: number;
	nextCursor?: number;
}

export interface ICronLog {
	id: string;
	jobName: string;
	command: string;
	err: string;
	output: string;
	planTime: number;
	scheduleTime: number;
	startTime: number;
	endTime: number;
}

export interface ICronJob {
	name: string;
	command: string;
	cronExpr: string;
}
