"use server";

import { sql } from "@vercel/postgres";
import { unstable_noStore as noStore } from "next/cache";
import { Day, Task, TaskWithDay, KanbanTask, TodaysTask } from "@/lib/types";

// this file contains all the functions that interact with the database

// Daily Tasks
export async function fetchDailyTasks() {
	noStore();
	try {
		// Using 'await' directly within the sql query execution to wait for the promise to resolve
		const result =
			await sql<Task>`SELECT * FROM adhd_dailychecklist ORDER BY id`;
		return result.rows;
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to fetch daily task data." + error);
	}
}

export async function createDailyTasks(id: number, task: string) {
	try {
		await sql<Task>`insert into adhd_dailychecklist (id, task, "isComplete", "isCompleteYesterday") values (${id}, ${task}, false, null);`;
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to create daily task." + error);
	}
}

export async function updateDailyTasks(id: number, isComplete: boolean) {
	noStore();
	try {
		if (!isComplete) {
			await sql<Task>`UPDATE adhd_dailychecklist SET "isComplete" = true WHERE "id" = ${id};`;
		} else {
			await sql<Task>`UPDATE adhd_dailychecklist SET "isComplete" = false WHERE "id" = ${id};`;
		}
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to update daily task data." + error);
	}
}

export async function resetDailyTasks(tasks: Task[]) {
	noStore();
	try {
		const updatePromises = tasks.map((task) => {
			return sql`UPDATE adhd_dailychecklist SET "isComplete" = false, "isCompleteYesterday" = ${task.isCompleteYesterday} WHERE "id" = ${task.id};`;
		});
		await Promise.all(updatePromises);
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to reset daily task data." + error);
	}
}

export async function deleteDailyTasks(ids: number[]) {
	noStore();
	try {
		const deletePromises = ids.map((id) => {
			return sql<Task>`delete from adhd_dailychecklist where id = ${id};`;
		});
		await Promise.all(deletePromises);
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to delete daily task data." + error);
	}
}

// Weekly tasks
export async function fetchWeeklyTasks() {
	noStore();
	try {
		const result =
			await sql<TaskWithDay>`SELECT * FROM adhd_weeklychecklist ORDER BY id`;
		return result.rows;
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to fetch weekly task data." + error);
	}
}

export async function createWeeklyTasks(id: number, task: string, day: Day) {
	try {
		await sql<Task>`insert into adhd_weeklychecklist (id, task, "isComplete", "day") values (${id}, ${task}, false, ${day});`;
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to create weekly task." + error);
	}
}

export async function updateWeeklyTasks(id: number, isComplete: boolean) {
	noStore();
	try {
		if (!isComplete) {
			await sql<Task>`UPDATE adhd_weeklychecklist SET "isComplete" = true WHERE "id" = ${id};`;
		} else {
			await sql<Task>`UPDATE adhd_weeklychecklist SET "isComplete" = false WHERE "id" = ${id};`;
		}
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to update weekly task data." + error);
	}
}

export async function updateWeeklyTaskDay(id: number, day: Day) {
	noStore();
	try {
		await sql<Task>`UPDATE adhd_weeklychecklist SET "day" = ${day} WHERE "id" = ${id};`;
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to update weekly task day." + error);
	}
}

export async function resetWeeklyTasks() {
	noStore();
	try {
		await sql`UPDATE adhd_weeklychecklist SET "isComplete" = false`;
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to reset weekly task data." + error);
	}
}

export async function deleteWeeklyTasks(id: number) {
	noStore();
	try {
		await sql<Task>`delete from adhd_weeklychecklist where id = ${id};`;
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to delete weekly task data." + error);
	}
}

// Kanban tasks
export async function fetchKanbanTasks() {
	noStore();
	try {
		const result = await sql<KanbanTask>`SELECT * FROM adhd_kanban_tasks ORDER BY created_at DESC`;
		return result.rows;
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to fetch kanban task data." + error);
	}
}

export async function createKanbanTask(id: number, title: string, description: string | null, status: string) {
	try {
		await sql`INSERT INTO adhd_kanban_tasks (id, title, description, status) VALUES (${id}, ${title}, ${description}, ${status});`;
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to create kanban task." + error);
	}
}

export async function updateKanbanTaskStatus(id: number, status: string) {
	noStore();
	try {
		await sql`UPDATE adhd_kanban_tasks SET status = ${status}, updated_at = CURRENT_TIMESTAMP WHERE id = ${id};`;
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to update kanban task status." + error);
	}
}

export async function deleteKanbanTask(id: number) {
	try {
		await sql<KanbanTask>`DELETE FROM adhd_kanban_tasks WHERE id = ${id}`;
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to delete kanban task." + error);
	}
}

// Today's Focus Tasks
export async function fetchTodaysTasks() {
	noStore();
	try {
		const result = await sql<TodaysTask>`SELECT * FROM adhd_todays_tasks ORDER BY id`;
		return result.rows;
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to fetch today's task data." + error);
	}
}

export async function createTodaysTask(id: number, title: string, isPriority: boolean = false) {
	try {
		await sql<TodaysTask>`INSERT INTO adhd_todays_tasks (id, title, "isComplete", "isPriority") VALUES (${id}, ${title}, false, ${isPriority})`;
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to create today's task." + error);
	}
}

export async function updateTodaysTaskComplete(id: number, isComplete: boolean) {
	try {
		await sql<TodaysTask>`UPDATE adhd_todays_tasks SET "isComplete" = ${isComplete} WHERE id = ${id}`;
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to update today's task completion." + error);
	}
}

export async function updateTodaysTaskPriority(id: number, isPriority: boolean) {
	try {
		await sql<TodaysTask>`UPDATE adhd_todays_tasks SET "isPriority" = ${isPriority} WHERE id = ${id}`;
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to update today's task priority." + error);
	}
}

export async function deleteTodaysTask(id: number) {
	try {
		await sql<TodaysTask>`DELETE FROM adhd_todays_tasks WHERE id = ${id}`;
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to delete today's task." + error);
	}
}
