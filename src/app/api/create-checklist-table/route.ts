import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	try {
		const result =
			await sql`CREATE TABLE adhd_DailyChecklist ( Id SERIAL PRIMARY KEY, Task varchar(255), isComplete BOOLEAN );`;
		return NextResponse.json({ result }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
}
