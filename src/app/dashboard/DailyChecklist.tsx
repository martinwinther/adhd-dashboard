"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import DailySubmit from "../../components/forms/DailySubmit";
import {
	deleteDailyTasks,
	fetchDailyTasks,
	resetDailyTasks,
	updateDailyTasks,
} from "@/lib/data";
import { Task } from "@/lib/types";

const DailyChecklist = () => {
	const [dailyTasks, setDailyTasks] = useState<Task[]>([]);
	const [dailyTasksYesterday, setDailyTasksYesterday] = useState<Task[]>([]);

	useEffect(() => {
		const loadTasks = async () => {
			const fetchedTasks = await fetchDailyTasks();
			// Make a fetch for previous days completed tasks
			setDailyTasks(fetchedTasks);
			setDailyTasksYesterday(fetchedTasks);
			console.log("Fetched daily tasks:", fetchedTasks);
		};
		loadTasks();
	}, []);

	const toggleComplete = (id: number, isComplete: boolean) => {
		const updatedDailyTasks = dailyTasks.map((dailyTask) => {
			if (dailyTask.id === id) {
				return { ...dailyTask, isComplete: !dailyTask.isComplete };
			}

			return dailyTask;
		});
		updateDailyTasks(id, isComplete);
		setDailyTasks(updatedDailyTasks);
	};

	const handleReset = async () => {
		// Create a new array that includes updates for isCompleteYesterday before resetting isComplete
		const updatedTasks = dailyTasks.map((task) => ({
			...task,
			isCompleteYesterday: task.isComplete, // Update based on current isComplete
			isComplete: false, // Reset isComplete
		}));

		try {
			// Pass the updated tasks array to reset in the database
			await resetDailyTasks(updatedTasks); // Make sure this function uses the updated isCompleteYesterday correctly

			// Update state with the newly updated tasks
			setDailyTasks(
				updatedTasks.map((task) => ({
					...task,
					isComplete: false, // Ensure isComplete is false for all, even though it should already be set
				})),
			);

			// Update dailyTasksYesterday with the tasks as they were before today's reset
			setDailyTasksYesterday(updatedTasks);
		} catch (error) {
			console.error("Error resetting tasks:", error);
		}
	};

	/* 	const handleTest = () => {
		console.log(dailyTasksYesterday[0].isCompleteYesterday);
		console.log(dailyTasks);
	}; */

	const handleDelete = () => {
		const tasksToDelete = dailyTasks.filter(
			(dailyTask) => dailyTask.isComplete,
		);
		const deleteIds = tasksToDelete.map((task) => {
			return task.id;
		});
		deleteDailyTasks(deleteIds);
		setDailyTasks([...dailyTasks.filter((task) => !task.isComplete)]);
	};

	const addTask = (id: number, taskDescription: string) => {
		const newTask = {
			id: id,
			task: taskDescription,
			isComplete: false,
		};
		setDailyTasks([...dailyTasks, newTask]); //  Add to db
	};

	type TaskListProps = {
		tasklist: Task[];
		tasklistYesterday: Task[];
	};

	const TaskList = ({ tasklist, tasklistYesterday }: TaskListProps) => {
		return (
			<div className="flex">
				{/* Left side list */}
				<div className="border-2 rounded-lg p-2 ">
					<div className="">
						<ul>
							{tasklist.map((dailyTask) => (
								<li key={dailyTask.id}>
									<label className="cursor-pointer">
										<input
											type="checkbox"
											checked={dailyTask.isComplete}
											onChange={() =>
												toggleComplete(dailyTask.id, dailyTask.isComplete)
											}
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
						<DailySubmit addTask={addTask} />
						<div className="flex justify-center pt-1">
							<Button variant="destructive" onClick={() => handleReset()}>
								Reset
							</Button>
							<Button variant="destructive" onClick={() => handleDelete()}>
								Delete
							</Button>
							{/* 					<Button variant="destructive" onClick={() => handleTest()}>
								Test
							</Button> */}
						</div>
					</div>
				</div>

				{/* Right side list */}
				{dailyTasksYesterday.length > 0 ? (
					<div className="border-2 rounded-lg ms-2 p-2">
						<ul>
							{tasklistYesterday.map((dailyTasksYesterday) => (
								<li key={dailyTasksYesterday.id}>
									<label className="cursor-pointer">
										<span
											className={
												dailyTasksYesterday.isCompleteYesterday
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
