"use client";
import React from "react";
import { useDroppable } from "@dnd-kit/core";

interface DroppableZoneProps {
	id: string;
	component: string;
	accepts: string[];
	children: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
	onDrop?: (taskId: number, fromComponent: string, taskData: any) => void;
}

export const DroppableZone: React.FC<DroppableZoneProps> = ({
	id,
	component,
	accepts,
	children,
	className = "",
	style,
	onDrop,
}) => {
	const { setNodeRef, isOver } = useDroppable({
		id: `zone-${component}-${id}`,
		data: {
			component,
			accepts,
		},
	});

	const dropZoneStyle = {
		backgroundColor: isOver ? "rgba(100, 116, 139, 0.1)" : "transparent",
		border: isOver ? "2px dashed #64748b" : "none",
		borderRadius: "8px",
		transition: "all 0.2s ease",
	};

	return (
		<div
			ref={setNodeRef}
			style={{ ...dropZoneStyle, ...style }}
			className={`${className} ${isOver ? "ring-2 ring-accent" : ""}`}
		>
			{children}
		</div>
	);
};
