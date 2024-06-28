"use server";

import { sql } from "@vercel/postgres";
import { unstable_noStore as noStore } from "next/cache";
import { Day, Task, TaskWithDay } from "@/lib/types";

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
	sql<Task>`insert into adhd_dailychecklist (id, task, "isComplete", "isCompleteYesterday") values (${id}, ${task}, false, null);`;
}

export async function updateDailyTasks(id: number, isComplete: boolean) {
	noStore();
	try {
		if (!isComplete) {
			sql<Task>`UPDATE adhd_dailychecklist SET "isComplete" = true WHERE "id" = ${id};`;
			console.log("set to true");
		} else {
			sql<Task>`UPDATE adhd_dailychecklist SET "isComplete" = false WHERE "id" = ${id};`;
			console.log("set to false");
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
		ids.map((id) => {
			sql<Task>`delete from adhd_dailychecklist where id = ${id};`;
		});
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
	sql<Task>`insert into adhd_weeklychecklist (id, task, "isComplete", "day") values (${id}, ${task}, false, ${day});`;
}

export async function updateWeeklyTasks(id: number, isComplete: boolean) {
	noStore();
	try {
		if (!isComplete) {
			sql<Task>`UPDATE adhd_weeklychecklist SET "isComplete" = true WHERE "id" = ${id};`;
			console.log("set to true");
		} else {
			sql<Task>`UPDATE adhd_weeklychecklist SET "isComplete" = false WHERE "id" = ${id};`;
			console.log("set to false");
		}
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to update weekly task data." + error);
	}
}

export async function resetWeeklyTasks() {
	noStore();
	try {
		return sql`UPDATE adhd_weeklychecklist SET "isComplete" = false`;
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to reset weekly task data." + error);
	}
}

export async function deleteWeeklyTasks() {
	noStore();
}
