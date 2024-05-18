"use client";

import Kanban from "@/components/Kanban";
import Todo from "@/components/WeeklyChecklist";
import Test from "@/components/DailyChecklist";

export default function Home() {
	return (
		<main className="">
			<div className=" bg-yellow-100 flex justify-center items-center">Hej</div>
			<div className="flex flex-row justify-center items-center space-x-4">
				<Todo />
				<Kanban />
				<Test />
			</div>
		</main>
	);
}
