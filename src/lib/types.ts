// this contains all the types used in the application

export interface Task {
	id: number;
	task: string;
	isComplete: boolean;
	isCompleteYesterday?: boolean | null;
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



export interface KanbanTask {
	id: number;
	title: string;
	description?: string;
	status: "todo" | "in-progress" | "done";
	created_at?: string;
	updated_at?: string;
}

export interface TodaysTask {
	id: number;
	title: string;
	isComplete: boolean;
	isPriority: boolean;
	created_at?: string;
	updated_at?: string;
}

export type Theme = 'light' | 'dark' | 'monastic';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}
