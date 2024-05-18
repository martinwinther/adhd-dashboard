"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import TodoSubmitForm from "./DailyChecklistSubmitForm";

type Task = {
	id: number;
	task: string;
	isComplete: boolean;
};

const DailyChecklist = () => {
	const arrayOfDailyTasks: Task[] = [
		{
			id: 1,
			task: "Fix the car",
			isComplete: false,
		},
		{
			id: 2,
			task: "Clean the oven",
			isComplete: false,
		},
		{
			id: 3,
			task: "Go to work",
			isComplete: false,
		},
		{
			id: 4,
			task: "Walk the dog",
			isComplete: false,
		},
	];

	const [dailyTasks, setDailyTasks] = useState<Task[]>(arrayOfDailyTasks);
	const [dailyTasksYesterday, setDailyTasksYesterday] = useState<Task[]>([]);

	const toggleComplete = (id: number) => {
		const updatedDailyTasks = dailyTasks.map((dailyTask) => {
			if (dailyTask.id === id) {
				return { ...dailyTask, isComplete: !dailyTask.isComplete };
			}
			return dailyTask;
		});
		setDailyTasks(updatedDailyTasks);
	};

	const handleReset = () => {
		const updatedDailyTasks = dailyTasks.map((dailyTask) => {
			return { ...dailyTask, isComplete: false };
		});
		setDailyTasks(updatedDailyTasks);
		setDailyTasksYesterday(dailyTasks);
	};

	const addTask = (taskDescription: string) => {
		const newTask = {
			id: dailyTasks.length + 1,
			task: taskDescription,
			isComplete: false,
		};
		setDailyTasks([...dailyTasks, newTask]);
	};

	type TaskListProps = {
		tasklist: Task[];
		tasklistYesterday: Task[];
	};

	const TaskList = ({ tasklist, tasklistYesterday }: TaskListProps) => {
		return (
			<div className="flex">
				{/* Left side list */}
				<div className="border-2 rounded-lg p-2 me-2">
					<div className="">
						<ul>
							{tasklist.map((dailyTask) => (
								<li key={dailyTask.id}>
									<label className="cursor-pointer">
										<input
											type="checkbox"
											checked={dailyTask.isComplete}
											onChange={() => toggleComplete(dailyTask.id)}
										/>
										<span
											className={
												dailyTask.isComplete ? "line-through ps-1" : " ps-1"
											}
										>
											{dailyTask.task}
										</span>
									</label>
								</li>
							))}
						</ul>
						<TodoSubmitForm addTask={addTask} />
						<div className="flex justify-center pt-1">
							<Button variant="destructive" onClick={() => handleReset()}>
								Reset
							</Button>
						</div>
					</div>
				</div>

				{/* Right side list */}
				{dailyTasksYesterday.length > 0 ? (
					<div className="border-2 rounded-lg p-2">
						<ul>
							{tasklistYesterday.map((dailyTasksYesterday) => (
								<li key={dailyTasksYesterday.id}>
									<label className="cursor-pointer">
										<span
											className={
												dailyTasksYesterday.isComplete
													? "line-through ps-1"
													: "text-red-400 ps-1"
											}
										>
											{dailyTasksYesterday.task}
										</span>
									</label>
								</li>
							))}
						</ul>
					</div>
				) : (
					""
				)}
			</div>
		);
	};

	return (
		<div className="">
			<TaskList tasklist={dailyTasks} tasklistYesterday={dailyTasksYesterday} />
		</div>
	);
};

export default DailyChecklist;