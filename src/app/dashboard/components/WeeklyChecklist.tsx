"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrashIcon } from "@heroicons/react/24/outline";
import { DraggableTask } from "@/components/ui/draggable-task";
import { DroppableZone } from "@/components/ui/droppable-zone";
import { Card } from "@/components/ui/card";
import {
	fetchWeeklyTasks,
	updateWeeklyTasks,
	resetWeeklyTasks,
	deleteWeeklyTasks,
	createWeeklyTasks,
	updateWeeklyTaskDay,
} from "@/lib/data";
import { Day, TaskWithDay } from "@/lib/types";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

interface WeeklyTask {
	id: number;
	task: string;
	isComplete: boolean;
	day: Day;
	isTemporary?: boolean; // Flag to indicate if this is a dragged task not yet saved to DB
}

// Move TaskItem outside the main component to prevent recreation on every render
const TaskItem = React.memo(({ 
	task, 
	onToggleComplete, 
	onDelete 
}: { 
	task: WeeklyTask; 
	onToggleComplete: (id: number | string, isComplete: boolean) => void;
	onDelete: (id: number | string) => void;
}) => {
	const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
		id: `task-weekly-${task.id}`,
		data: {
			id: task.id,
			type: "task",
			sourceComponent: "weekly",
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
			className={`flex items-center justify-between p-2 border rounded mb-1 ${
				task.isTemporary 
					? "bg-blue-50 border-blue-200" 
					: "bg-white border-gray-200"
			} ${isDragging ? "z-50" : ""}`}
		>
			{/* Non-draggable checkbox area */}
			<div 
				onMouseDown={(e) => e.stopPropagation()} // Prevent drag from starting
				className="flex items-center space-x-2"
			>
				<input
					type="checkbox"
					checked={task.isComplete}
					onChange={(e) => {
						e.stopPropagation(); // Prevent double-triggering
						onToggleComplete(task.id, !task.isComplete);
					}}
					className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
				/>
			</div>
			
			{/* Draggable handle area */}
			<div 
				{...listeners}
				{...attributes}
				className="cursor-grab flex items-center space-x-2 flex-1"
			>
				<span
					className={`${
						task.isComplete ? "line-through text-gray-500" : "text-gray-900"
					}`}
					style={{
						textDecoration: task.isComplete ? 'line-through' : 'none'
					}}
				>
					{task.task}
				</span>
				{task.isTemporary && (
					<span className="text-xs text-blue-600 bg-blue-100 px-1 rounded">
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
					className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
				>
					<TrashIcon className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
});

TaskItem.displayName = "TaskItem";

// Move DayColumn outside the main component to prevent recreation on every render
const DayColumn = React.memo(({
	day,
	tasks,
	onToggleComplete,
	onDelete,
	onAddTask,
	onReset,
}: {
	day: Day;
	tasks: WeeklyTask[];
	onToggleComplete: (id: number | string, isComplete: boolean) => void;
	onDelete: (id: number | string) => void;
	onAddTask: (taskDescription: string, day: Day) => void;
	onReset: () => void;
}) => {
	const [newTaskTitle, setNewTaskTitle] = useState("");

	const handleAddTask = (e: React.FormEvent) => {
		e.preventDefault();
		if (newTaskTitle.trim()) {
			onAddTask(newTaskTitle.trim(), day);
			setNewTaskTitle("");
		}
	};

	return (
		<DroppableZone
			id={day}
			component="weekly"
			accepts={["kanban", "todays", "daily"]}
			className="flex-1 flex flex-col bg-gray-50 border border-gray-200 rounded-lg p-3"
		>
			<div className="flex items-center justify-between mb-3">
				<h3 className="text-lg font-bold capitalize">{day}</h3>
				{day === "sunday" && (
					<Button
						variant="outline"
						size="sm"
						onClick={onReset}
						className="text-xs"
					>
						Reset
					</Button>
				)}
			</div>

			<div className="space-y-1 mb-4 flex-1">
				{tasks.map((task) => (
					<TaskItem
						key={task.id}
						task={task}
						onToggleComplete={onToggleComplete}
						onDelete={onDelete}
					/>
				))}
			</div>

			<form onSubmit={handleAddTask} className="space-y-2">
				<Input
					placeholder="Add task..."
					value={newTaskTitle}
					onChange={(e) => setNewTaskTitle(e.target.value)}
					className="text-sm"
				/>
				<Button
					type="submit"
					variant="secondary"
					size="sm"
					disabled={!newTaskTitle.trim()}
					className="w-full"
				>
					Add Task
				</Button>
			</form>
		</DroppableZone>
	);
});

DayColumn.displayName = "DayColumn";

const WeeklyChecklist = () => {
	const [weeklyTasks, setWeeklyTasks] = useState<WeeklyTask[]>([]);

	// Load tasks from database on component mount
	useEffect(() => {
		const loadTasks = async () => {
			try {
				const fetchedTasks = await fetchWeeklyTasks();
				setWeeklyTasks(fetchedTasks);
			} catch (error) {
				console.error("Error loading weekly tasks:", error);
			}
		};
		loadTasks();
	}, []);

	// Listen for task drops from other components
	useEffect(() => {
		const handleTaskMoved = async (event: Event) => {
			const customEvent = event as CustomEvent;
			const { taskId, fromComponent, toComponent, toData } = customEvent.detail;
			
			if (toComponent === "weekly") {
				// Handle internal weekly moves (between days)
				if (fromComponent === "weekly") {
					// Find the task being moved - handle both string and number IDs
					const numericTaskId = typeof taskId === 'string' ? parseInt(taskId) : taskId;
					const taskToMove = weeklyTasks.find(task => {
						// Convert task.id to number for comparison if it's a string
						const taskIdNum = typeof task.id === 'string' ? parseInt(task.id) : task.id;
						return taskIdNum === numericTaskId;
					});
					
					if (taskToMove && toData.day && taskToMove.day !== toData.day) {
						// Update the task's day in local state
						setWeeklyTasks(prev => prev.map(task => {
							// Convert task.id to number for comparison if it's a string
							const taskIdNum = typeof task.id === 'string' ? parseInt(task.id) : task.id;
							return taskIdNum === numericTaskId 
								? { ...task, day: toData.day as Day }
								: task;
						}));
						
						// Update the task's day in database (only for permanent tasks)
						if (!taskToMove.isTemporary) {
							try {
								await updateWeeklyTaskDay(numericTaskId, toData.day as Day);
							} catch (error) {
								console.error("Error updating task day in database:", error);
							}
						}
					}
				} else {
					// Handle external component drops
					const newTask: WeeklyTask = {
						id: Date.now(),
						task: toData.title || toData.task || "Imported Task",
						isComplete: false,
						day: toData.day || "monday",
						isTemporary: false, // Mark as permanent (save to database)
					};
					
					try {
						// Save to database
						await createWeeklyTasks(newTask.id, newTask.task, newTask.day);
						// Update local state
						setWeeklyTasks(prev => [...prev, newTask]);
					} catch (error) {
						console.error("Error creating weekly task from drag:", error);
					}
				}
			} else if (fromComponent === "weekly") {
				// Remove the task from weekly if it's being moved to another component
				const numericTaskId = typeof taskId === 'string' ? parseInt(taskId) : taskId;
				
				try {
					// Delete from database
					await deleteWeeklyTasks(numericTaskId);
					// Update local state
					setWeeklyTasks(prev => prev.filter(task => {
						// Convert task.id to number for comparison if it's a string
						const taskIdNum = typeof task.id === 'string' ? parseInt(task.id) : task.id;
						return taskIdNum !== numericTaskId;
					}));
				} catch (error) {
					console.error("Error deleting weekly task when moved out:", error);
				}
			}
		};

		window.addEventListener("task-moved", handleTaskMoved);
		return () => {
			window.removeEventListener("task-moved", handleTaskMoved);
		};
	}, [weeklyTasks]);

	const addTask = useCallback(async (taskDescription: string, day: Day) => {
		const newTask: WeeklyTask = {
			id: Date.now(),
			task: taskDescription,
			isComplete: false,
			day: day,
			isTemporary: false, // Mark as permanent (saved to database)
		};
		setWeeklyTasks(prev => [...prev, newTask]);
		// Add to database
		await createWeeklyTasks(newTask.id, newTask.task, newTask.day);
	}, []);

	const toggleComplete = useCallback(async (id: number | string, newIsComplete: boolean) => {
		// Convert ID to number for database operation
		const numericId = typeof id === 'string' ? parseInt(id) : id;
		
		const updatedWeeklyTasks = weeklyTasks.map((weeklyTask) => {
			const taskIdNum = typeof weeklyTask.id === 'string' ? parseInt(weeklyTask.id) : weeklyTask.id;
			if (taskIdNum === numericId) {
				return { ...weeklyTask, isComplete: newIsComplete };
			}
			return weeklyTask;
		});
		
		try {
			await updateWeeklyTasks(numericId, newIsComplete);
			setWeeklyTasks(updatedWeeklyTasks);
		} catch (error) {
			console.error("Error updating task:", error);
		}
	}, [weeklyTasks]);

	const deleteTask = useCallback(async (id: number | string) => {
		try {
			// Convert ID to number for database operation
			const numericId = typeof id === 'string' ? parseInt(id) : id;
			await deleteWeeklyTasks(numericId);
			
			// Remove from local state - handle both string and number IDs
			setWeeklyTasks(prev => prev.filter(task => {
				const taskIdNum = typeof task.id === 'string' ? parseInt(task.id) : task.id;
				return taskIdNum !== numericId;
			}));
		} catch (error) {
			console.error("Error deleting task:", error);
		}
	}, []);

	const handleReset = useCallback(async () => {
		try {
			await resetWeeklyTasks();
			const fetchedTasks = await fetchWeeklyTasks();
			setWeeklyTasks(fetchedTasks);
		} catch (error) {
			console.error("Error resetting tasks:", error);
		}
	}, []);

	// Days of the week
	const daysOfWeek: Day[] = [
		"monday",
		"tuesday",
		"wednesday",
		"thursday",
		"friday",
		"saturday",
		"sunday",
	];

	// Get tasks for a specific day
	const getTasksByDay = useCallback((day: Day) => {
		return weeklyTasks.filter((task) => task.day === day);
	}, [weeklyTasks]);

	return (
		<Card 
			title="Weekly Checklist"
			className="h-full flex flex-col"
		>
			<div className="flex-1 flex flex-col min-h-0">

			<div className="flex flex-col md:flex-row justify-between space-y-2 md:space-x-2 md:space-y-0 items-stretch">
				{daysOfWeek.map((day) => (
					<DayColumn
						key={day}
						day={day}
						tasks={getTasksByDay(day)}
						onToggleComplete={toggleComplete}
						onDelete={deleteTask}
						onAddTask={addTask}
						onReset={handleReset}
					/>
				))}
			</div>
			</div>
		</Card>
	);
};

export default WeeklyChecklist;
