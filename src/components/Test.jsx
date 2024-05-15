"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const Test = () => {
	const arrayOfDailyTasks = [
		{
			id: 1,
			todo: "Fix the car",
			isComplete: false,
		},
		{
			id: 2,
			todo: "Clean the oven",
			isComplete: false,
		},
		{
			id: 3,
			todo: "Go to work",
			isComplete: false,
		},
		{
			id: 4,
			todo: "Walk the dog",
			isComplete: false,
		},
	];

	const [dailyTasks, setDailyTasks] = useState(arrayOfDailyTasks);
	const [dailyTasksYesterday, setDailyTasksYesterday] = useState([]);

	const toggleComplete = (id) => {
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

	const TaskList = ({ tasklist, tasklistYesterday }) => {
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
											{dailyTask.todo}
										</span>
									</label>
								</li>
							))}
						</ul>
					</div>
					<div className="flex justify-center pt-1">
						<Button variant="destructive" onClick={() => handleReset()}>
							Reset
						</Button>
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
											{dailyTasksYesterday.todo}
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

export default Test;
