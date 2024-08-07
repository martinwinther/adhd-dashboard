import { useEffect, useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";

import { Button } from "../../components/ui/button";
import WeeklySubmit from "../../components/ui/WeeklySubmit";
import {
	fetchWeeklyTasks,
	updateWeeklyTasks,
	resetWeeklyTasks,
	deleteWeeklyTasks,
} from "@/lib/data";
import { Day, TaskWithDay } from "@/lib/types";

const WeeklyChecklist = () => {
	const [weeklyTasks, setWeeklyTasks] = useState<TaskWithDay[]>([]);

	useEffect(() => {
		const loadTasks = async () => {
			const fetchedTasks = await fetchWeeklyTasks();
			// Make a fetch for previous days completed tasks
			setWeeklyTasks(fetchedTasks);
			console.log("Fetched weekly tasks:", fetchedTasks);
		};
		loadTasks();
	}, []);

	const addTask = (id: number, taskDescription: string, day: Day) => {
		if (!day) {
			console.error("Day must be provided for the task");
			return; // Or handle the case where day is undefined
		}
		const newTask = {
			id: id,
			task: taskDescription,
			isComplete: false,
			day: day,
		};
		setWeeklyTasks([...weeklyTasks, newTask]);
	};

	const daysOfWeek: TaskWithDay["day"][] = [
		"monday",
		"tuesday",
		"wednesday",
		"thursday",
		"friday",
		"saturday",
		"sunday",
	];

	const toggleComplete = (id: number, isComplete: boolean) => {
		const updatedWeeklyTasks = weeklyTasks.map((weeklyTask) => {
			if (weeklyTask.id === id) {
				return { ...weeklyTask, isComplete: !weeklyTask.isComplete };
			}
			return weeklyTask;
		});
		updateWeeklyTasks(id, isComplete);
		setWeeklyTasks(updatedWeeklyTasks);
	};

	const handleReset = async () => {
		await resetWeeklyTasks();
		const fetchedTasks = await fetchWeeklyTasks();
		// Make a fetch for previous days completed tasks
		setWeeklyTasks(fetchedTasks);
	};

	const handleDelete = async (id: number) => {
		await deleteWeeklyTasks(id);
		const fetchedTasks = await fetchWeeklyTasks();
		setWeeklyTasks(fetchedTasks);
	};

	const TodoList = ({ todolists }: { todolists: TaskWithDay[] }) => {
		return (
			<div className="flex flex-col md:flex-row justify-between space-y-2 md:space-x-2 md:space-y-0 items-stretch">
				{daysOfWeek.map((day) => (
					<div key={day} className="flex-1 flex flex-col">
						<div className="flex items-center justify-between">
							<div className="text-lg font-bold">{day}</div>
							{day === "sunday" && (
								<Button
									className=" px-6 h-6 w-6"
									variant="destructive"
									onClick={() => handleReset()}
								>
									Reset
								</Button>
							)}
						</div>

						<ul className="flex-1 border-2 border-black p-2 flex flex-col">
							{todolists
								.filter((weeklyTask) => weeklyTask.day === day)
								.map((weeklyTask) => (
									<li key={weeklyTask.id} className="mt-1 border border-black">
										<label className="cursor-pointer">
											<div className="flex items-center justify-between ps-2">
												<div>
													<input
														type="checkbox"
														checked={weeklyTask.isComplete}
														onChange={() =>
															toggleComplete(
																weeklyTask.id,
																weeklyTask.isComplete,
															)
														}
													/>
													<span
														className={
															weeklyTask.isComplete
																? "line-through ps-1"
																: " ps-1"
														}
													>
														{weeklyTask.task}
													</span>
												</div>
												<Button
													className="m-2 h-8 w-8"
													variant="destructive"
													onClick={() => handleDelete(weeklyTask.id)}
												>
													<span>
														<TrashIcon className="size-6" />
													</span>
												</Button>
											</div>
										</label>
									</li>
								))}
							<WeeklySubmit addTask={addTask} day={day} />
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
