"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrashIcon, StarIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { DroppableZone } from "@/components/ui/droppable-zone";
import { Card } from "@/components/ui/card";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { fetchTodaysTasks, createTodaysTask, updateTodaysTaskComplete, updateTodaysTaskPriority, deleteTodaysTask } from "@/lib/data";
import { TodaysTask } from "@/lib/types";

// Move TaskItem outside the main component to prevent recreation on every render
const TaskItem = React.memo(({ 
	task, 
	onToggleComplete, 
	onTogglePriority, 
	onDelete 
}: { 
	task: TodaysTask; 
	onToggleComplete: (id: number) => void;
	onTogglePriority: (id: number) => void;
	onDelete: (id: number) => void;
}) => {
	const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
		id: `task-todays-${task.id}`,
		data: {
			id: task.id,
			type: "task",
			sourceComponent: "todays",
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
			className={`flex items-center justify-between p-3 border rounded-lg transition-colors mb-2 ${
				task.isComplete
					? "bg-accent/10 border-accent"
					: task.isPriority
					? "bg-accent/20 border-accent"
					: "bg-surface border-accent"
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
						onToggleComplete(task.id);
					}}
					className="rounded border-accent text-primary focus:ring-primary"
				/>
			</div>
			
			{/* Draggable handle area */}
			<div 
				{...listeners}
				{...attributes}
				className="cursor-grab flex items-center space-x-2 flex-1"
			>
				<span
					className={`flex-1 text-sm ${
						task.isComplete
							? "line-through text-muted"
							: "text-primary"
					}`}
					style={{
						textDecoration: task.isComplete ? 'line-through' : 'none'
					}}
				>
					{task.title}
				</span>
			</div>
			
			{/* Non-draggable action buttons area */}
			<div 
				onMouseDown={(e) => e.stopPropagation()} // Prevent drag from starting
				className="flex items-center space-x-1"
			>
				<Button
					variant="ghost"
					size="sm"
					onClick={(e) => {
						e.stopPropagation();
						onTogglePriority(task.id);
					}}
					className={`h-6 w-6 p-0 ${
						task.isPriority
							? "text-accent"
							: "text-muted hover:text-accent"
					}`}
				>
					{task.isPriority ? (
						<StarIconSolid className="h-4 w-4" />
					) : (
						<StarIcon className="h-4 w-4" />
					)}
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={(e) => {
						e.stopPropagation();
						e.preventDefault();
						onDelete(task.id);
					}}
					className="h-6 w-6 p-0 text-muted hover:text-red-500"
				>
					<TrashIcon className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
});

TaskItem.displayName = "TaskItem";

const TodaysList = () => {
	const [tasks, setTasks] = useState<TodaysTask[]>([]);
	const [newTaskTitle, setNewTaskTitle] = useState("");

	// Load tasks from database on component mount
	useEffect(() => {
		const loadTasks = async () => {
			try {
				const fetchedTasks = await fetchTodaysTasks();
				console.log("Fetched today's tasks:", fetchedTasks);
				setTasks(fetchedTasks);
			} catch (error) {
				console.error("Error loading today's tasks:", error);
			}
		};
		loadTasks();
	}, []);

	// Listen for task drops from other components
	useEffect(() => {
		const handleTaskMoved = async (event: CustomEvent) => {
			const { taskId, fromComponent, toComponent, toData } = event.detail;
			console.log("Today's Focus received task-moved event:", { taskId, fromComponent, toComponent, toData });
			
			if (toComponent === "todays") {
				// Only add the task if it's coming from a different component
				if (fromComponent !== "todays") {
					const newTask: TodaysTask = {
						id: Date.now(),
						title: toData.title || toData.task || "Imported Task",
						isComplete: false,
						isPriority: false,
					};
					
					try {
						// Save to database
						await createTodaysTask(newTask.id, newTask.title, newTask.isPriority);
						// Update local state
						setTasks(prev => [newTask, ...prev]);
					} catch (error) {
						console.error("Error creating today's task from drag:", error);
					}
				}
			} else if (fromComponent === "todays") {
				// Remove the task from todays if it's being moved to another component
				const numericTaskId = typeof taskId === 'string' ? parseInt(taskId) : taskId;
				console.log("Task being moved out of today's focus:", numericTaskId);
				
				try {
					// Delete from database
					await deleteTodaysTask(numericTaskId);
					// Update local state
					setTasks(prev => prev.filter(task => {
						const taskIdNum = typeof task.id === 'string' ? parseInt(task.id) : task.id;
						return taskIdNum !== numericTaskId;
					}));
				} catch (error) {
					console.error("Error deleting today's task when moved out:", error);
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
			const newTask: TodaysTask = {
				id: Date.now(),
				title: newTaskTitle.trim(),
				isComplete: false,
				isPriority: false,
			};
			
			try {
				// Save to database
				await createTodaysTask(newTask.id, newTask.title, newTask.isPriority);
				// Update local state
				setTasks(prev => [newTask, ...prev]);
				setNewTaskTitle("");
			} catch (error) {
				console.error("Error creating today's task:", error);
			}
		}
	}, [newTaskTitle]);

	const toggleComplete = useCallback(async (taskId: number | string) => {
		const numericTaskId = typeof taskId === 'string' ? parseInt(taskId) : taskId;
		const task = tasks.find(t => {
			const taskIdNum = typeof t.id === 'string' ? parseInt(t.id) : t.id;
			return taskIdNum === numericTaskId;
		});
		
		if (task) {
			const newIsComplete = !task.isComplete;
			try {
				await updateTodaysTaskComplete(numericTaskId, newIsComplete);
				setTasks(prev =>
					prev.map((t) => {
						const taskIdNum = typeof t.id === 'string' ? parseInt(t.id) : t.id;
						return taskIdNum === numericTaskId ? { ...t, isComplete: newIsComplete } : t;
					})
				);
			} catch (error) {
				console.error("Error updating task completion:", error);
			}
		}
	}, [tasks]);

	const togglePriority = useCallback(async (taskId: number | string) => {
		const numericTaskId = typeof taskId === 'string' ? parseInt(taskId) : taskId;
		const task = tasks.find(t => {
			const taskIdNum = typeof t.id === 'string' ? parseInt(t.id) : t.id;
			return taskIdNum === numericTaskId;
		});
		
		if (task) {
			const newIsPriority = !task.isPriority;
			try {
				await updateTodaysTaskPriority(numericTaskId, newIsPriority);
				setTasks(prev =>
					prev.map((t) => {
						const taskIdNum = typeof t.id === 'string' ? parseInt(t.id) : t.id;
						return taskIdNum === numericTaskId ? { ...t, isPriority: newIsPriority } : t;
					})
				);
			} catch (error) {
				console.error("Error updating task priority:", error);
			}
		}
	}, [tasks]);

	const deleteTask = useCallback(async (taskId: number | string) => {
		const numericTaskId = typeof taskId === 'string' ? parseInt(taskId) : taskId;
		try {
			await deleteTodaysTask(numericTaskId);
			setTasks(prev => prev.filter((task) => {
				const taskIdNum = typeof task.id === 'string' ? parseInt(task.id) : task.id;
				return taskIdNum !== numericTaskId;
			}));
		} catch (error) {
			console.error("Error deleting task:", error);
		}
	}, []);

	const clearCompleted = useCallback(() => {
		setTasks(prev => prev.filter((task) => !task.isComplete));
	}, []);

	// Sort tasks: priority first, then incomplete, then complete
	const sortedTasks = React.useMemo(() => {
		return [...tasks].sort((a, b) => {
			if (a.isPriority && !b.isPriority) return -1;
			if (!a.isPriority && b.isPriority) return 1;
			if (!a.isComplete && b.isComplete) return -1;
			if (a.isComplete && !b.isComplete) return 1;
			// Sort by ID (newer tasks first) since we don't have createdAt in the database
			return b.id - a.id;
		});
	}, [tasks]);

	const completedCount = tasks.filter(task => task.isComplete).length;
	const totalCount = tasks.length;

	return (
		<Card 
			title="Today's Focus"
			subtitle={`${completedCount}/${totalCount} done`}
			className="h-full flex flex-col"
		>
			<DroppableZone
				id="main"
				component="todays"
				accepts={["kanban", "daily", "weekly"]}
				className="h-full flex flex-col"
			>
				<div className="mb-4 flex-shrink-0">
				
				<form onSubmit={addTask} className="space-y-2">
					<Input
						placeholder="What&apos;s your focus today?"
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
						Add Focus Task
					</Button>
				</form>
			</div>

			<div className="space-y-2 mb-4 flex-1 min-h-0 overflow-y-auto">
				{sortedTasks.map((task) => (
					<TaskItem
						key={task.id}
						task={task}
						onToggleComplete={toggleComplete}
						onTogglePriority={togglePriority}
						onDelete={deleteTask}
					/>
				))}
			</div>

			{completedCount > 0 && (
				<div className="flex justify-center flex-shrink-0">
					<Button
						variant="outline"
						size="sm"
						onClick={clearCompleted}
						className="text-xs"
					>
						Clear Completed
					</Button>
				</div>
			)}

			{tasks.length === 0 && (
				<div className="text-center text-muted text-sm py-4 flex-1 flex items-center justify-center">
					No focus tasks for today. Add your most important tasks here!
				</div>
			)}
			</DroppableZone>
		</Card>
	);
};

export default TodaysList;
