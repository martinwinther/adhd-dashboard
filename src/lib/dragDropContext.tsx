"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { UnifiedTask, DropZone } from "./types";

interface DragDropContextType {
	// State
	dropZones: DropZone[];
	
	// Actions
	registerDropZone: (zone: DropZone) => void;
	unregisterDropZone: (zoneId: string) => void;
	
	// Task management
	moveTask: (taskId: number, fromComponent: string, toComponent: string, toData?: any) => void;
	convertTask: (task: any, fromComponent: string, toComponent: string) => UnifiedTask;
}

const DragDropContext = createContext<DragDropContextType | undefined>(undefined);

export const useDragDrop = () => {
	const context = useContext(DragDropContext);
	if (!context) {
		throw new Error("useDragDrop must be used within a DragDropProvider");
	}
	return context;
};

interface DragDropProviderProps {
	children: ReactNode;
}

export const DragDropProvider: React.FC<DragDropProviderProps> = ({ children }) => {
	const [dropZones, setDropZones] = useState<DropZone[]>([]);

	const registerDropZone = (zone: DropZone) => {
		setDropZones(prev => {
			const existing = prev.find(z => z.id === zone.id);
			if (existing) {
				return prev.map(z => z.id === zone.id ? zone : z);
			}
			return [...prev, zone];
		});
	};

	const unregisterDropZone = (zoneId: string) => {
		setDropZones(prev => prev.filter(zone => zone.id !== zoneId));
	};

	const convertTask = (task: any, fromComponent: string, toComponent: string): UnifiedTask => {
		const baseTask: UnifiedTask = {
			id: task.id,
			title: task.task || task.title,
			description: task.description,
			isComplete: task.isComplete || false,
			priority: task.isPriority || task.priority || false,
			component: toComponent as any,
			createdAt: task.createdAt || new Date(),
		};

		// Add component-specific properties
		switch (toComponent) {
			case "kanban":
				return {
					...baseTask,
					status: "todo",
				};
			case "todays":
				return {
					...baseTask,
					priority: false,
				};
			case "daily":
				return {
					...baseTask,
					isCompleteYesterday: task.isCompleteYesterday,
				};
			case "weekly":
				return {
					...baseTask,
					day: task.day || "monday",
				};
			default:
				return baseTask;
		}
	};

	const moveTask = (taskId: number, fromComponent: string, toComponent: string, toData?: any) => {
		// This will be implemented to handle actual task movement
		// For now, we'll use localStorage to coordinate between components
		const event = new CustomEvent("task-moved", {
			detail: {
				taskId,
				fromComponent,
				toComponent,
				toData,
			},
		});
		window.dispatchEvent(event);
	};

	const value: DragDropContextType = {
		dropZones,
		registerDropZone,
		unregisterDropZone,
		moveTask,
		convertTask,
	};

	return (
		<DragDropContext.Provider value={value}>
			{children}
		</DragDropContext.Provider>
	);
};
