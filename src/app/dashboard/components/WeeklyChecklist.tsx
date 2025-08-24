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
	isCompleteYesterday?: boolean | null;
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
		opacity: isDragging ? 0 : 1, // Make completely invisible when dragging
		// Add hardware acceleration
		willChange: "transform",
		transformOrigin: "center",
		// Ensure smooth animations
		transition: isDragging ? "none" : "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
		// Add visual feedback for dragging state
		boxShadow: isDragging 
			? "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)" 
			: "none",
		// Add a subtle scale effect when dragging
		scale: isDragging ? "1.05" : "1",
		// Add a subtle rotation when dragging for better visual feedback
		rotate: isDragging ? "2deg" : "0deg",
		// Hide the element completely when dragging
		visibility: isDragging ? "hidden" as const : "visible" as const,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={`flex items-center justify-between p-2 border rounded-lg transition-optimized mb-2 text-xs ${
				task.isTemporary 
					? "bg-accent/20 border-accent shadow-sm" 
					: "bg-surface border-accent shadow-sm hover:shadow-md"
			} ${isDragging ? "z-50 shadow-2xl" : ""}`}
		>
			{/* Non-draggable checkbox area */}
			<div 
				onMouseDown={(e) => e.stopPropagation()} // Prevent drag from starting
				className="flex items-center"
			>
				<input
					type="checkbox"
					checked={task.isComplete}
					onChange={(e) => {
						e.stopPropagation(); // Prevent double-triggering
						onToggleComplete(task.id, !task.isComplete);
					}}
					className="rounded border-accent text-primary focus:ring-primary h-3 w-3"
				/>
			</div>
			
			{/* Draggable handle area */}
			<div 
				{...listeners}
				{...attributes}
				className="cursor-grab flex items-center flex-1 min-w-0 px-2"
			>
				<span
					className={`truncate font-medium ${
						task.isComplete ? "line-through text-muted" : "text-primary"
					}`}
					style={{
						textDecoration: task.isComplete ? 'line-through' : 'none'
					}}
					title={task.task}
				>
					{task.task}
				</span>
				{task.isTemporary && (
					<span className="text-xs text-accent bg-accent/20 px-1.5 py-0.5 rounded-full ml-1 flex-shrink-0 font-medium">
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
					className="h-5 w-5 p-0 text-muted hover:text-red-500 flex-shrink-0 transition-colors"
				>
					<TrashIcon className="h-3 w-3" />
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
			accepts={["weekly", "kanban", "todays", "daily"]}
			className="flex flex-col bg-accent/5 border border-accent/30 p-3 sm:p-4 min-h-0"
		>
			<div className="flex items-center justify-between mb-3 sm:mb-4 flex-shrink-0">
				<h3 className="text-xs sm:text-sm font-bold capitalize truncate text-primary">{day}</h3>
				{day === "sunday" && (
					<Button
						variant="outline"
						size="sm"
						onClick={onReset}
						className="text-xs h-6 sm:h-7 px-2 sm:px-3 font-medium"
					>
						Reset
					</Button>
				)}
			</div>

			<div className="space-y-2 mb-4 flex-1 min-h-0 overflow-y-auto">
				{tasks.map((task) => (
					<TaskItem
						key={task.id}
						task={task}
						onToggleComplete={onToggleComplete}
						onDelete={onDelete}
					/>
				))}
			</div>

			<form onSubmit={handleAddTask} className="space-y-2 sm:space-y-3 flex-shrink-0">
				<Input
					placeholder="Add task..."
					value={newTaskTitle}
					onChange={(e) => setNewTaskTitle(e.target.value)}
					className="text-xs h-8 sm:h-9"
				/>
				<Button
					type="submit"
					variant="secondary"
					size="sm"
					disabled={!newTaskTitle.trim()}
					className="w-full h-8 sm:h-9 text-xs font-medium"
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
				{/* Responsive grid layout - adapts to screen size */}
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-3 lg:gap-4 h-full">
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
