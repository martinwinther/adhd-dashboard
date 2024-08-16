// this contains all the types used in the application

export interface Task {
	id: number;
	task: string;
	isComplete: boolean;
	isCompleteYesterday?: boolean;
}

export interface TaskWithDay extends Task {
	day: Day;
}

export type Day =
	| "monday"
	| "tuesday"
	| "wednesday"
	| "thursday"
	| "friday"
	| "saturday"
	| "sunday";
