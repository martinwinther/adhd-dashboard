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
		opacity: isDragging ? 0.5 : 1,
		cursor: "grab",
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...listeners}
			{...attributes}
			className={`${className} ${isDragging ? "z-50" : ""}`}
		>
			{children}
		</div>
	);
};
