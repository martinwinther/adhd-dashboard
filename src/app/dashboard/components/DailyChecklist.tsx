"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrashIcon } from "@heroicons/react/24/outline";
import { DroppableZone } from "@/components/ui/droppable-zone";
import { Card } from "@/components/ui/card";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
	deleteDailyTasks,
	fetchDailyTasks,
	resetDailyTasks,
	updateDailyTasks,
	createDailyTasks,
} from "@/lib/data";
import { Task } from "@/lib/types";

interface DailyTask {
	id: number;
	task: string;
	isComplete: boolean;
	isCompleteYesterday?: boolean;
	isTemporary?: boolean; // Flag to indicate if this is a dragged task not yet saved to DB
}

// Move TaskItem outside the main component to prevent recreation on every render
const TaskItem = React.memo(({ 
	task, 
	onToggleComplete, 
	onDelete 
}: { 
	task: DailyTask; 
	onToggleComplete: (id: number, isComplete: boolean) => void;
	onDelete: (id: number) => void;
}) => {
	const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
		id: `task-daily-${task.id}`,
		data: {
			id: task.id,
			type: "task",
			sourceComponent: "daily",
			sourceData: task,
		},
	});

	const style = {
		transform: CSS.Translate.toString(transform),
		opacity: isDragging ? 0.5 : 1,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={`flex items-center justify-between p-3 border rounded-lg transition-all duration-200 mb-2 ${
				task.isTemporary 
					? "bg-accent/20 border-accent shadow-sm" 
					: "bg-surface border-accent shadow-sm hover:shadow-md"
			} ${isDragging ? "z-50" : ""}`}
		>
			{/* Non-draggable checkbox area */}
			<div 
				onMouseDown={(e) => e.stopPropagation()} // Prevent drag from starting
				className="flex items-center space-x-3"
			>
				<input
					type="checkbox"
					checked={task.isComplete}
					onChange={(e) => {
						e.stopPropagation(); // Prevent double-triggering
						onToggleComplete(task.id, task.isComplete);
					}}
					className="rounded border-accent text-primary focus:ring-primary h-4 w-4"
				/>
			</div>
			
			{/* Draggable handle area */}
			<div 
				{...listeners}
				{...attributes}
				className="cursor-grab flex items-center space-x-3 flex-1"
			>
				<span
					className={`text-sm font-medium ${
						task.isComplete ? "line-through text-muted" : "text-primary"
					}`}
					style={{
						textDecoration: task.isComplete ? 'line-through' : 'none'
					}}
				>
					{task.task}
				</span>
				{task.isTemporary && (
					<span className="text-xs text-accent bg-accent/20 px-2 py-1 rounded-full font-medium">
						temp
					</span>
				)}
			</div>
			
			{/* Non-draggable trash can area */}
			<div 
				onMouseDown={(e) => e.stopPropagation()} // Prevent drag from starting
				onClick={(e) => {
					e.stopPropagation(); // Prevent triggering the task toggle
					e.preventDefault(); // Prevent any default behavior
					onDelete(task.id);
				}}
			>
				<Button
					variant="ghost"
					size="sm"
					className="h-7 w-7 p-0 text-muted hover:text-red-500 transition-colors"
				>
					<TrashIcon className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
});

TaskItem.displayName = "TaskItem";

const DailyChecklist = () => {
	const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([]);
	const [dailyTasksYesterday, setDailyTasksYesterday] = useState<DailyTask[]>([]);
	const [newTaskTitle, setNewTaskTitle] = useState("");

	// Load tasks from database on component mount
	useEffect(() => {
		const loadTasks = async () => {
			try {
				const fetchedTasks = await fetchDailyTasks();
				setDailyTasks(fetchedTasks);
				setDailyTasksYesterday(fetchedTasks);
				console.log("Fetched daily tasks:", fetchedTasks);
			} catch (error) {
				console.error("Error loading daily tasks:", error);
			}
		};
		loadTasks();
	}, []);

	// Listen for task drops from other components
	useEffect(() => {
		const handleTaskMoved = async (event: CustomEvent) => {
			const { taskId, fromComponent, toComponent, toData } = event.detail;
			if (toComponent === "daily") {
				// Only add the task if it's coming from a different component
				if (fromComponent !== "daily") {
					const newTask: DailyTask = {
						id: Date.now(),
						task: toData.title || toData.task || "Imported Task",
						isComplete: false,
						isTemporary: false, // Mark as permanent (save to database)
					};
					
					try {
						// Save to database
						await createDailyTasks(newTask.id, newTask.task);
						// Update local state
						setDailyTasks(prev => [...prev, newTask]);
					} catch (error) {
						console.error("Error creating daily task from drag:", error);
					}
				}
			} else if (fromComponent === "daily") {
				// Remove the task from daily if it's being moved to another component
				const numericTaskId = typeof taskId === 'string' ? parseInt(taskId) : taskId;
				
				try {
					// Delete from database
					await deleteDailyTasks([numericTaskId]);
					// Update local state
					setDailyTasks(prev => prev.filter(task => {
						const taskIdNum = typeof task.id === 'string' ? parseInt(task.id) : task.id;
						return taskIdNum !== numericTaskId;
					}));
				} catch (error) {
					console.error("Error deleting daily task when moved out:", error);
				}
			}
		};

		window.addEventListener("task-moved", handleTaskMoved as unknown as EventListener);
		return () => {
			window.removeEventListener("task-moved", handleTaskMoved as unknown as EventListener);
		};
	}, []);

	const addTask = useCallback(async (e: React.FormEvent) => {
		e.preventDefault();
		if (newTaskTitle.trim()) {
			const newTask: DailyTask = {
				id: Date.now(),
				task: newTaskTitle.trim(),
				isComplete: false,
				isTemporary: false, // Mark as permanent (saved to database)
			};
			setDailyTasks(prev => [...prev, newTask]);
			// Add to database
			await createDailyTasks(newTask.id, newTask.task);
			setNewTaskTitle("");
		}
	}, [newTaskTitle]);

	const toggleComplete = useCallback(async (id: number, isComplete: boolean) => {
		const updatedDailyTasks = dailyTasks.map((dailyTask) => {
			if (dailyTask.id === id) {
				return { ...dailyTask, isComplete: !dailyTask.isComplete };
			}
			return dailyTask;
		});
		
		try {
			await updateDailyTasks(id, isComplete);
			setDailyTasks(updatedDailyTasks);
		} catch (error) {
			console.error("Error updating task:", error);
		}
	}, [dailyTasks]);

	const deleteTask = useCallback(async (id: number) => {
		try {
			await deleteDailyTasks([id]);
			setDailyTasks(prev => prev.filter(task => task.id !== id));
		} catch (error) {
			console.error("Error deleting task:", error);
		}
	}, []);

	const handleReset = useCallback(async () => {
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
					isComplete: false, // Ensure isComplete is false for all
				})),
			);

			// Update dailyTasksYesterday with the tasks as they were before today's reset
			setDailyTasksYesterday(updatedTasks);
		} catch (error) {
			console.error("Error resetting tasks:", error);
		}
	}, [dailyTasks]);

	const handleDeleteCompleted = useCallback(async () => {
		const tasksToDelete = dailyTasks.filter((dailyTask) => dailyTask.isComplete);
		const deleteIds = tasksToDelete.map((task) => task.id);
		
		try {
			await deleteDailyTasks(deleteIds);
			setDailyTasks(prev => prev.filter((task) => !task.isComplete));
		} catch (error) {
			console.error("Error deleting completed tasks:", error);
		}
	}, [dailyTasks]);

	return (
		<Card 
			title="Daily Checklist"
			className="h-full flex flex-col"
		>
			<DroppableZone
				id="main"
				component="daily"
				accepts={["kanban", "todays", "weekly"]}
				className="h-full flex flex-col"
			>
				<div className="mb-6 flex-shrink-0">
				<form onSubmit={addTask} className="space-y-3">
					<Input
						placeholder="Add daily task..."
						value={newTaskTitle}
						onChange={(e) => setNewTaskTitle(e.target.value)}
						className="text-sm"
					/>
					<Button
						type="submit"
						variant="secondary"
						size="sm"
						disabled={!newTaskTitle.trim()}
						className="w-full font-medium"
					>
						Add Task
					</Button>
				</form>
			</div>

			<div className="flex gap-6 flex-1 min-h-0">
				{/* Today's tasks */}
				<div className="flex-1 flex flex-col min-h-0">
					<h3 className="font-semibold text-primary mb-3 flex-shrink-0 text-sm uppercase tracking-wide">Today</h3>
					<div className="space-y-2 mb-4 flex-1 min-h-0 overflow-y-auto">
						{dailyTasks.map((task) => (
							<TaskItem
								key={task.id}
								task={task}
								onToggleComplete={toggleComplete}
								onDelete={deleteTask}
							/>
						))}
					</div>
					<div className="flex gap-2 flex-shrink-0">
						<Button
							variant="outline"
							size="sm"
							onClick={handleReset}
							className="text-xs font-medium"
						>
							Reset
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={handleDeleteCompleted}
							className="text-xs font-medium"
						>
							Delete Completed
						</Button>
					</div>
				</div>

				{/* Yesterday's tasks */}
				{dailyTasksYesterday.length > 0 && (
					<div className="flex-1 flex flex-col min-h-0">
						<h3 className="font-semibold text-primary mb-3 flex-shrink-0 text-sm uppercase tracking-wide">Yesterday</h3>
						<div className="space-y-2 flex-1 min-h-0 overflow-y-auto">
							{dailyTasksYesterday.map((task) => (
								<div
									key={task.id}
									className={`p-3 border border-accent rounded-lg mb-2 text-sm font-medium ${
										task.isCompleteYesterday
											? "bg-accent/10 line-through text-muted"
											: "bg-accent/20 text-accent"
									}`}
								>
									{task.task}
								</div>
							))}
						</div>
					</div>
				)}
			</div>
			</DroppableZone>
		</Card>
	);
};

export default DailyChecklist;
