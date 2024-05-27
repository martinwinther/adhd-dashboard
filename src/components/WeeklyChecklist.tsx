import { useState } from "react";
import { Button } from "./ui/button";
import ChecklistSubmitForm from "./ChecklistSubmitForm";

const WeeklyChecklist = () => {
	const [weeklyTasks, setWeeklyTasks] = useState<ToDoElements[]>([
		{
			id: 1,
			task: "Fix the car",
			isComplete: false,
			day: "monday",
		},
		{
			id: 2,
			task: "Clean the oven",
			isComplete: false,
			day: "monday",
		},
		{
			id: 3,
			task: "Go to work",
			isComplete: false,
			day: "tuesday",
		},
		{
			id: 4,
			task: "Walk the dog",
			isComplete: false,
			day: "wednesday",
		},
		{
			id: 5,
			task: "Play Super smash bros",
			isComplete: false,
			day: "friday",
		},
		{
			id: 6,
			task: "Throw darts with the boys",
			isComplete: false,
			day: "friday",
		},
		{
			id: 7,
			task: "Workout",
			isComplete: false,
			day: "tuesday",
		},
		{
			id: 8,
			task: "Walk the dog",
			isComplete: false,
			day: "wednesday",
		},
		{
			id: 9,
			task: "Workout",
			isComplete: false,
			day: "thursday",
		},
		{
			id: 10,
			task: "Play Super smash bros",
			isComplete: false,
			day: "thursday",
		},
		{
			id: 11,
			task: "Play Super smash bros",
			isComplete: false,
			day: "friday",
		},
		{
			id: 12,
			task: "Therapy session",
			isComplete: false,
			day: "friday",
		},
		{
			id: 13,
			task: "Hearthstone",
			isComplete: false,
			day: "saturday",
		},
		{
			id: 14,
			task: "Play Super smash bros",
			isComplete: false,
			day: "sunday",
		},
		{
			id: 15,
			task: "Open new packs",
			isComplete: false,
			day: "sunday",
		},
	]);

	type ToDoElements = {
		id: number;
		task: string;
		isComplete: boolean;
		day:
			| "monday"
			| "tuesday"
			| "wednesday"
			| "thursday"
			| "friday"
			| "saturday"
			| "sunday";
	};

	const addTask = (
		taskDescription: string,
		day:
			| "monday"
			| "tuesday"
			| "wednesday"
			| "thursday"
			| "friday"
			| "saturday"
			| "sunday"
			| undefined,
	) => {
		if (!day) {
			console.error("Day must be provided for the task");
			return; // Or handle the case where day is undefined
		}
		const newTask = {
			id: weeklyTasks.length + 1,
			task: taskDescription,
			isComplete: false,
			day: day,
		};
		setWeeklyTasks([...weeklyTasks, newTask]);
	};

	const daysOfWeek: ToDoElements["day"][] = [
		"monday",
		"tuesday",
		"wednesday",
		"thursday",
		"friday",
		"saturday",
		"sunday",
	];

	const TodoList = ({ todolists }: { todolists: ToDoElements[] }) => {
		return (
			<div className="flex flex-col md:flex-row justify-between space-y-2 md:space-x-2 md:space-y-0 items-stretch">
				{daysOfWeek.map((day) => (
					<div key={day} className="flex-1 flex flex-col">
						<div className="text-lg font-bold">{day}</div>
						<ul className="flex-1 border-2 border-black p-2 flex flex-col">
							{todolists
								.filter((task) => task.day === day)
								.map((task) => (
									<li key={task.id} className="mt-1 border border-black">
										<div className="flex items-center justify-between">
											<span className="flex-1">{task.task}</span>
											<Button className="m-2 h-8 w-8" variant="destructive">
												X
											</Button>
										</div>
									</li>
								))}
							<ChecklistSubmitForm addTask={addTask} day={day} />
						</ul>
					</div>
				))}
			</div>
		);
	};

	return (
		<div className="bg-red-100 border-2 rounded-lg p-2">
			<TodoList todolists={weeklyTasks} />
		</div>
	);
};

export default WeeklyChecklist;
