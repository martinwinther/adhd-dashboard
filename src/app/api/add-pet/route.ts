import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const id = searchParams.get("id");
	const task = searchParams.get("task");
	const iscomplete = searchParams.get("iscomplete");

	try {
		if (!id || !task) throw new Error("Pet and owner names required");
		await sql`INSERT INTO adhd_dailychecklist (id, task, iscomplete) VALUES (${id}, ${task}, {${iscomplete}});`;
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}

	const tasks = await sql`SELECT * FROM adhd_dailychecklist;`;
	return NextResponse.json({ tasks }, { status: 200 });
}
