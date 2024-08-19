"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import DailySubmit from "../../../components/forms/DailySubmit";
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

	// when the component loads, the daily tasks are fetched from the database and stored in the state
	useEffect(() => {
		const loadTasks = async () => {
			const fetchedTasks = await fetchDailyTasks();
			setDailyTasks(fetchedTasks);
			setDailyTasksYesterday(fetchedTasks);
			console.log("Fetched daily tasks:", fetchedTasks);
		};
		loadTasks();
	}, []);

	//
	// takes in the id and isComplete value and updates the isComplete value TODO: Make Async and add error handling
	const toggleComplete = (id: number, isComplete: boolean) => {
		const updatedDailyTasks = dailyTasks.map((dailyTask) => {
			if (dailyTask.id === id) {
				return { ...dailyTask, isComplete: !dailyTask.isComplete };
			}

			return dailyTask;
		});
		updateDailyTasks(id, isComplete); // sets the isComplete value in the database
		setDailyTasks(updatedDailyTasks); // updates the state with the new isComplete value TODO: Maybe setDailyTasks from the database directly?
	};

	// resets the daily tasks and updates the previous day tasks
	const handleReset = async () => {
		// Create a new array that includes updates for isCompleteYesterday before resetting isComplete
		const updatedTasks = dailyTasks.map((task) => ({
			...task,
			isCompleteYesterday: task.isComplete, // Update based on current isComplete
			isComplete: false, // Reset isComplete
		}));

		try {
			// Pass the updated tasks array to reset in the database
			await resetDailyTasks(updatedTasks);

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

	// deletes the completed tasks from the database and updates the state TODO: Make Async and add error handling
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

	// tells the DailySubmit component to add a new task to the database and updates the state with the new task
	const addTask = (id: number, taskDescription: string) => {
		const newTask = {
			id: id,
			task: taskDescription,
			isComplete: false,
		};
		setDailyTasks([...dailyTasks, newTask]); //  Add to db
	};

	// the TaskList component handles the display of the tasks
	const TaskList = ({
		tasklist,
		tasklistYesterday,
	}: {
		tasklist: Task[];
		tasklistYesterday: Task[];
	}) => {
		return (
			<div className="flex">
				{/* Todays tasks */}
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
						{/* The DailySubmit component handles the form submission, updating the state, and adding the task to the database */}
						<DailySubmit addTask={addTask} />
						<div className="flex justify-center pt-1">
							<Button variant="destructive" onClick={() => handleReset()}>
								Reset
							</Button>
							<Button variant="destructive" onClick={() => handleDelete()}>
								Delete
							</Button>
						</div>
					</div>
				</div>

				{/* Yesterdays tasks */}
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
