"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import ChecklistSubmitForm from "./ChecklistSubmitForm";
import { deleteDailyTasks, fetchDailyTasks, resetDailyTasks } from "@/lib/data";

type Task = {
	id: number;
	task: string;
	isComplete: boolean;
	isCompleteYesterday?: boolean;
};

const DailyChecklist = () => {
	const [dailyTasks, setDailyTasks] = useState<Task[]>([]);
	const [dailyTasksYesterday, setDailyTasksYesterday] = useState<Task[]>([]);

	useEffect(() => {
		const loadTasks = async () => {
			const fetchedTasks = await fetchDailyTasks();
			// Make a fetch for previous days completed tasks
			setDailyTasks(fetchedTasks);
		};
		loadTasks();
	}, []);

	const toggleComplete = (id: number) => {
		const updatedDailyTasks = dailyTasks.map((dailyTask) => {
			if (dailyTask.id === id) {
				return { ...dailyTask, isComplete: !dailyTask.isComplete };
			}
			return dailyTask;
		});
		setDailyTasks(updatedDailyTasks);
	};

	const handleReset = async () => {
		// Filter out the tasks that were completed
		const completedTasks = dailyTasks.filter((task) => task.isComplete);

		// Prepare tasks with updated 'isCompleteYesterday' based on their current 'isComplete'
		const resetTasks = dailyTasks.map((task) => ({
			...task,
			isCompleteYesterday: task.isComplete,
			isComplete: false,
		}));

		try {
			// Call the resetDailyTasks function with the prepared list
			await resetDailyTasks(dailyTasks); // Pass the entire list, function handles the logic

			// Update state with the new task data
			setDailyTasks(resetTasks);
			setDailyTasksYesterday(dailyTasks); // Optionally, update the 'yesterday' list to show only previously completed tasks
		} catch (error) {
			console.error("Error resetting tasks:", error);
			// Optionally, handle errors in the UI
		}
	};

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

	const addTask = (taskDescription: string) => {
		const newTask = {
			id: dailyTasks.length + 1,
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
						<ChecklistSubmitForm addTask={addTask} />
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

				{/* Right side list */}
				{dailyTasksYesterday.length > 0 ? (
					<div className="border-2 rounded-lg ms-2 p-2">
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
