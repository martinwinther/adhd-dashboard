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

// New types for drag and drop functionality
export interface UnifiedTask {
	id: number;
	title: string;
	description?: string;
	isComplete: boolean;
	priority: boolean;
	component: "kanban" | "todays" | "daily" | "weekly";
	status?: "todo" | "in-progress" | "done";
	day?: Day;
	createdAt: Date;
	isCompleteYesterday?: boolean;
}

export interface DragItem {
	id: number;
	type: "task";
	sourceComponent: string;
	sourceData: any;
}

export interface DropZone {
	id: string;
	component: "kanban" | "todays" | "daily" | "weekly";
	accepts: string[];
}

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
