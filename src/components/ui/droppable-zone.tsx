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
	const { setNodeRef, isOver, active } = useDroppable({
		id: `zone-${component}-${id}`,
		data: {
			component,
			accepts,
		},
	});

	// Check if the dragged item is compatible with this zone
	const draggedComponent = active?.data.current?.sourceComponent;
	const isCompatible = active && (
		// Allow internal moves (same component)
		draggedComponent === component ||
		// Allow external moves (component in accepts array)
		accepts.includes(draggedComponent || "")
	);

	const dropZoneStyle = {
		backgroundColor: isOver && isCompatible 
			? "rgba(100, 116, 139, 0.15)" 
			: isOver 
			? "rgba(239, 68, 68, 0.1)" 
			: "transparent",
		border: isOver && isCompatible 
			? "2px dashed #64748b" 
			: isOver 
			? "2px dashed #ef4444" 
			: "none",
		borderRadius: "8px",
		// Optimize transitions for better performance
		transition: "background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.2s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
		// Add hardware acceleration
		willChange: "background-color, border-color, transform",
		// Ensure smooth animations
		transform: isOver && isCompatible ? "scale(1.02) translateZ(0)" : "scale(1) translateZ(0)",
		// Add a subtle glow effect for compatible drops
		boxShadow: isOver && isCompatible 
			? "0 0 0 3px rgba(100, 116, 139, 0.1)" 
			: isOver 
			? "0 0 0 3px rgba(239, 68, 68, 0.1)" 
			: "none",
	};

	return (
		<div
			ref={setNodeRef}
			style={{ ...dropZoneStyle, ...style }}
			className={`${className} ${
				isOver && isCompatible 
					? "ring-2 ring-accent ring-opacity-50" 
					: isOver 
					? "ring-2 ring-red-500 ring-opacity-50" 
					: ""
			}`}
		>
			{/* Drop indicator overlay */}
			{isOver && isCompatible && (
				<div className="absolute inset-0 bg-accent/5 border-2 border-dashed border-accent rounded-lg pointer-events-none z-10 flex items-center justify-center">
					<div className="bg-white text-gray-900 px-3 py-1 rounded-full text-xs font-medium shadow-lg border border-gray-200">
						Drop here
					</div>
				</div>
			)}
			
			{/* Incompatible drop indicator */}
			{isOver && !isCompatible && (
				<div className="absolute inset-0 bg-red-500/5 border-2 border-dashed border-red-500 rounded-lg pointer-events-none z-10 flex items-center justify-center">
					<div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
						Incompatible
					</div>
				</div>
			)}
			
			{children}
		</div>
	);
};
