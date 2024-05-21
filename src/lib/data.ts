"use server";

import { sql } from "@vercel/postgres";
import { unstable_noStore as noStore } from "next/cache";

type Task = {
	id: number;
	task: string;
	isComplete: boolean;
};

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
