"use client";
import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

interface DraggableTaskProps {
	id: number;
	children: React.ReactNode;
	component: string;
	taskData: any;
	className?: string;
}

export const DraggableTask: React.FC<DraggableTaskProps> = ({
	id,
	children,
	component,
	taskData,
	className = "",
}) => {
	const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
		id: `task-${component}-${id}`,
		data: {
			id,
			type: "task",
			sourceComponent: component,
			sourceData: taskData,
		},
	});

	const style = {
		transform: CSS.Translate.toString(transform),
		opacity: isDragging ? 0 : 1, // Make completely invisible when dragging
		cursor: "grab",
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
			{...listeners}
			{...attributes}
			className={`${className} ${isDragging ? "z-50" : ""} ${
				isDragging ? "shadow-2xl" : ""
			}`}
		>
			{children}
		</div>
	);
};
