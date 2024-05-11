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

	const toggleComplete = (id) => {
		const updatedDailyTasks = dailyTasks.map((dailyTask) => {
			if (dailyTask.id === id) {
				return { ...dailyTask, isComplete: !dailyTask.isComplete };
			}
			return dailyTask;
		});
		setDailyTasks(updatedDailyTasks);
	};

	const resetComplete = () => {
		const updatedDailyTasks = dailyTasks.map((dailyTask) => {
			return { ...dailyTask, isComplete: false };
		});
		setDailyTasks(updatedDailyTasks);
	};

	const TaskList = ({ tasklist }) => {
		return (<div>
			<div>
			<ul>
				{tasklist.map((dailyTask) => (
					<li key={dailyTask.id}>
						<input
							type="checkbox"
							checked={dailyTask.isComplete}
							onChange={() => toggleComplete(dailyTask.id)}
						/>
						<span className={dailyTask.isComplete ? "line-through ps-1" : " ps-1"}>
							{dailyTask.todo}
						</span>
					</li>
				))}				
			</ul>
			</div>
			<div className="flex justify-center pt-1">
				<Button variant="destructive" onClick={() => resetComplete()}>Reset</Button>
				</div>
			</div>
		);
	};

	return (
		<div className="border-2 rounded-lg p-2">
			<TaskList tasklist={dailyTasks} />
		</div>
	);
};

export default Test;
