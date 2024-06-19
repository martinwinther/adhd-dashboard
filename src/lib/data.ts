"use server";

import { sql } from "@vercel/postgres";
import { unstable_noStore as noStore } from "next/cache";

type Task = {
	id: number;
	task: string;
	isComplete: boolean;
};

// Daily Tasks
export async function fetchDailyTasks() {
	noStore();
	try {
		// Using 'await' directly within the sql query execution to wait for the promise to resolve
		const result = await sql<Task>`SELECT * FROM adhd_dailychecklist`;
		return result.rows;
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to fetch daily task data." + error);
	}
}

export async function createDailyTasks(id: number, task: string) {
	sql<Task>`insert into adhd_dailychecklist (id, task, iscomplete, iscompleteyesterday) values (${id}, ${task}, false, null);`;
}

export async function resetDailyTasks(tasks: Task[]) {
	noStore();
	try {
		await Promise.all(
			tasks.map((task) => {
				return sql<Task>`UPDATE adhd_dailychecklist SET iscomplete=false, iscompleteyesterday=${task.isComplete} WHERE id=${task.id};`;
			}),
		);
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
		const result = await sql<Task>`SELECT * FROM adhd_weeklychecklist`;
		return result.rows;
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to fetch weekly task data." + error);
	}
}
