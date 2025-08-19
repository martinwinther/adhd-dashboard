"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrashIcon } from "@heroicons/react/24/outline";
import { DroppableZone } from "@/components/ui/droppable-zone";
import { Card } from "@/components/ui/card";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { fetchKanbanTasks, createKanbanTask, updateKanbanTaskStatus, deleteKanbanTask } from "@/lib/data";
import { KanbanTask } from "@/lib/types";

// Move TaskCard outside the main component to prevent recreation on every render
const TaskCard = React.memo(({ 
	task, 
	onDelete, 
	onMove 
}: { 
	task: KanbanTask; 
	onDelete: (id: number) => void;
	onMove: (id: number, status: KanbanTask["status"]) => void;
}) => {
	const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
		id: `task-kanban-${task.id}`,
		data: {
			id: task.id,
			type: "task",
			sourceComponent: "kanban",
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
			className={`bg-surface border border-accent rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 mb-3 ${isDragging ? "z-50" : ""}`}
		>
			{/* Draggable handle area */}
			<div 
				{...listeners}
				{...attributes}
				className="cursor-grab"
			>
				<div className="flex justify-between items-start mb-3">
					<h4 className="font-semibold text-sm text-primary leading-tight">{task.title}</h4>
				</div>
				{task.description && (
					<p className="text-xs text-muted mb-3 leading-relaxed">{task.description}</p>
				)}
			</div>
			
			{/* Non-draggable action buttons area */}
			<div 
				onMouseDown={(e) => e.stopPropagation()} // Prevent drag from starting
				className="flex justify-between items-center"
			>
				{/* Action buttons */}
				<div className="flex gap-2">
					{task.status !== "todo" && (
						<Button
							variant="outline"
							size="sm"
							onClick={(e) => {
								e.stopPropagation();
								onMove(task.id, "todo");
							}}
							className="text-xs h-7 px-3 font-medium"
						>
							← Todo
						</Button>
					)}
					{task.status !== "in-progress" && (
						<Button
							variant="outline"
							size="sm"
							onClick={(e) => {
								e.stopPropagation();
								onMove(task.id, "in-progress");
							}}
							className="text-xs h-7 px-3 font-medium"
						>
							{task.status === "todo" ? "→ Progress" : "← Progress"}
						</Button>
					)}
					{task.status !== "done" && (
						<Button
							variant="outline"
							size="sm"
							onClick={(e) => {
								e.stopPropagation();
								onMove(task.id, "done");
							}}
							className="text-xs h-7 px-3 font-medium"
						>
							→ Done
						</Button>
					)}
				</div>
				
				{/* Trash can button */}
				<Button
					variant="ghost"
					size="sm"
					onClick={(e) => {
						console.log("Trash can clicked! Event:", e);
						e.stopPropagation();
						e.preventDefault();
						console.log("About to call onDelete with task ID:", task.id);
						onDelete(task.id);
					}}
					className="h-7 w-7 p-0 text-muted hover:text-red-500 transition-colors"
				>
					<TrashIcon className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
});

TaskCard.displayName = "TaskCard";

const Kanban = () => {
	const [tasks, setTasks] = useState<KanbanTask[]>([]);
	const [newTaskTitle, setNewTaskTitle] = useState("");
	const [newTaskDescription, setNewTaskDescription] = useState("");

	// Load tasks from database on component mount
	useEffect(() => {
		const loadTasks = async () => {
			try {
				const fetchedTasks = await fetchKanbanTasks();
				console.log("Fetched kanban tasks from database:", fetchedTasks);
				setTasks(fetchedTasks);
			} catch (error) {
				console.error("Error loading kanban tasks:", error);
			}
		};
		loadTasks();
	}, []);

	// Handle internal kanban column moves
	const handleInternalMove = useCallback(async (taskId: number | string, newStatus: KanbanTask["status"]) => {
		// Convert taskId to number for database operations
		const numericTaskId = typeof taskId === 'string' ? parseInt(taskId) : taskId;
		console.log("Moving task", numericTaskId, "to status:", newStatus);
		console.log("Current tasks:", tasks.map(t => ({ id: t.id, type: typeof t.id, status: t.status })));
		
		try {
			// Update database
			await updateKanbanTaskStatus(numericTaskId, newStatus);
			console.log("Database updated successfully");
			// Update local state - handle both string and number IDs
			setTasks(prev => 
				prev.map((task) => {
					const taskIdNum = typeof task.id === 'string' ? parseInt(task.id) : task.id;
					return taskIdNum === numericTaskId ? { ...task, status: newStatus } : task;
				})
			);
		} catch (error) {
			console.error("Error updating kanban task status:", error);
		}
	}, [tasks]);

	// Listen for task drops from other components
	useEffect(() => {
		const handleTaskMoved = async (event: Event) => {
			const customEvent = event as CustomEvent;
			const { taskId, fromComponent, toComponent, toData } = customEvent.detail;
			console.log("Kanban received task-moved event:", { taskId, fromComponent, toComponent, toData });
			
			if (toComponent === "kanban") {
				if (fromComponent === "kanban") {
					// Internal kanban move - update the task status
					const numericTaskId = typeof taskId === 'string' ? parseInt(taskId) : taskId;
					console.log("Internal kanban move for task:", numericTaskId, "to status:", toData.status);
					// Update database and local state
					handleInternalMove(numericTaskId, toData.status);
				} else {
					// Task coming from another component - save to database
					const newTask: KanbanTask = {
						id: Date.now(), // Generate new ID to avoid conflicts
						title: toData.title || toData.task || "Imported Task",
						description: toData.description,
						status: toData.status || "todo",
					};
					
					try {
						// Save to database
						await createKanbanTask(newTask.id, newTask.title, newTask.description || null, newTask.status);
						// Update local state
						setTasks(prev => [...prev, newTask]);
					} catch (error) {
						console.error("Error creating kanban task from drag:", error);
					}
				}
			} else if (fromComponent === "kanban") {
				// Remove the task from kanban if it's being moved to another component
				const numericTaskId = typeof taskId === 'string' ? parseInt(taskId) : taskId;
				console.log("Task being moved out of kanban:", numericTaskId);
				
				try {
					// Delete from database
					await deleteKanbanTask(numericTaskId);
					// Update local state
					setTasks(prev => prev.filter(task => {
						const taskIdNum = typeof task.id === 'string' ? parseInt(task.id) : task.id;
						return taskIdNum !== numericTaskId;
					}));
				} catch (error) {
					console.error("Error deleting kanban task when moved out:", error);
				}
			}
		};

		window.addEventListener("task-moved", handleTaskMoved);
		return () => {
			window.removeEventListener("task-moved", handleTaskMoved);
		};
	}, [handleInternalMove]);

	const addTask = useCallback(async (e: React.FormEvent) => {
		e.preventDefault();
		if (newTaskTitle.trim()) {
			const newTask: KanbanTask = {
				id: Date.now(),
				title: newTaskTitle.trim(),
				description: newTaskDescription.trim() || undefined,
				status: "todo",
			};
			
			try {
				// Save to database
				await createKanbanTask(newTask.id, newTask.title, newTask.description || null, newTask.status);
				// Update local state
				setTasks(prev => [...prev, newTask]);
				setNewTaskTitle("");
				setNewTaskDescription("");
			} catch (error) {
				console.error("Error creating kanban task:", error);
			}
		}
	}, [newTaskTitle, newTaskDescription]);

	const deleteTask = useCallback(async (taskId: number | string) => {
		// Convert taskId to number for database operations
		const numericTaskId = typeof taskId === 'string' ? parseInt(taskId) : taskId;
		console.log("Deleting task with ID:", numericTaskId);
		
		try {
			// Delete from database
			await deleteKanbanTask(numericTaskId);
			// Update local state - handle both string and number IDs
			setTasks(prev => prev.filter((task) => {
				const taskIdNum = typeof task.id === 'string' ? parseInt(task.id) : task.id;
				return taskIdNum !== numericTaskId;
			}));
		} catch (error) {
			console.error("Error deleting kanban task:", error);
		}
	}, []);

	const getTasksByStatus = useCallback((status: KanbanTask["status"]) => {
		return tasks.filter((task) => task.status === status);
	}, [tasks]);

	const KanbanColumn = React.memo(({
		title,
		status,
		tasks,
	}: {
		title: string;
		status: KanbanTask["status"];
		tasks: KanbanTask[];
	}) => (
		<DroppableZone
			id={status}
			component="kanban"
			accepts={["todays", "daily", "weekly"]}
			className="flex-1 bg-accent/5 border border-accent/30 rounded-lg p-4 flex flex-col min-h-0"
		>
			<h3 className="font-semibold text-primary mb-4 text-center flex-shrink-0 text-sm uppercase tracking-wide">{title}</h3>
			<div className="space-y-2 flex-1 min-h-0 overflow-y-auto">
				{tasks.map((task) => (
					<TaskCard 
						key={task.id} 
						task={task} 
						onDelete={deleteTask}
						onMove={handleInternalMove}
					/>
				))}
			</div>
		</DroppableZone>
	));

	KanbanColumn.displayName = "KanbanColumn";

	return (
		<Card 
			title="Kanban Board"
			className="h-full flex flex-col"
		>
			<div className="mb-6 flex-shrink-0">
				<form onSubmit={addTask} className="space-y-3">
					<Input
						placeholder="Task title..."
						value={newTaskTitle}
						onChange={(e) => setNewTaskTitle(e.target.value)}
						className="text-sm"
					/>
					<Input
						placeholder="Description (optional)..."
						value={newTaskDescription}
						onChange={(e) => setNewTaskDescription(e.target.value)}
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

			<div className="flex gap-4 flex-1 min-h-0">
				<KanbanColumn
					title="To Do"
					status="todo"
					tasks={getTasksByStatus("todo")}
				/>
				<KanbanColumn
					title="In Progress"
					status="in-progress"
					tasks={getTasksByStatus("in-progress")}
				/>
				<KanbanColumn
					title="Done"
					status="done"
					tasks={getTasksByStatus("done")}
				/>
			</div>
		</Card>
	);
};

export default Kanban;
