"use client";
import Navigation from "@/components/Navigation";
import Kanban from "@/app/dashboard/components/Kanban";
import WeeklyChecklist from "@/app/dashboard/components/WeeklyChecklist";
import DailyCheckList from "@/app/dashboard/components/DailyChecklist";
import TodaysList from "@/app/dashboard/components/TodaysList";
import { 
	DndContext, 
	DragEndEvent, 
	DragOverlay,
	DragStartEvent,
	useSensor,
	useSensors,
	PointerSensor,
	KeyboardSensor,
	closestCenter,
	DragOverEvent
} from "@dnd-kit/core";
import { useState } from "react";

export default function Home() {
	const [activeId, setActiveId] = useState<string | null>(null);
	const [draggedItem, setDraggedItem] = useState<any>(null);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
		useSensor(KeyboardSensor)
	);

	const handleDragStart = (event: DragStartEvent) => {
		const { active } = event;
		setActiveId(active.id as string);
		setDraggedItem(active.data.current);
	};

	const handleDragOver = (event: DragOverEvent) => {
		const { active, over } = event;
		
		if (!over) return;

		// Provide visual feedback during drag over
		const overElement = over.id as string;
		const activeElement = active.id as string;
		
		// You can add additional visual feedback here if needed
		console.log(`Dragging ${activeElement} over ${overElement}`);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		
		// Reset drag state
		setActiveId(null);
		setDraggedItem(null);
		
		if (!over) {
			return;
		}

		const activeId = active.id as string;
		const overId = over.id as string;

		// Extract component and task info from IDs
		const activeMatch = activeId.match(/task-(\w+)-(\d+)/);
		const overMatch = overId.match(/zone-(\w+)-(.+)/);

		if (activeMatch && overMatch) {
			const [, fromComponent, taskId] = activeMatch;
			const [, toComponent, zoneId] = overMatch;

			// Get the dragged item data
			const draggedItem = active.data.current;
			if (draggedItem) {
				const toData = {
					...draggedItem.sourceData,
				};

				// Handle different component types
				if (toComponent === "kanban") {
					// For kanban internal moves, use the zone ID as status
					toData.status = zoneId;
				} else if (toComponent === "weekly") {
					// For weekly component, use the zone ID as day
					toData.day = zoneId;
				}

				// Determine if this should be a copy operation
				// Copy when dragging TO TodaysList from another component
				const isCopyOperation = toComponent === "todays" && fromComponent !== "todays";
				
				const event = new CustomEvent("task-moved", {
					detail: {
						taskId: parseInt(taskId),
						fromComponent,
						toComponent,
						toData,
						isCopy: isCopyOperation,
					},
				});
				window.dispatchEvent(event);
			}
		}
	};

	// Create a drag preview component
	const DragPreview = () => {
		if (!draggedItem) return null;

		const { sourceData, sourceComponent } = draggedItem;
		
		// Create a preview based on the component type
		let previewContent;
		switch (sourceComponent) {
			case "kanban":
				previewContent = (
					<div className="bg-surface border border-accent rounded-lg p-4 shadow-lg max-w-xs">
						<h4 className="font-semibold text-sm text-primary">{sourceData.title}</h4>
						{sourceData.description && (
							<p className="text-xs text-muted mt-1">{sourceData.description}</p>
						)}
					</div>
				);
				break;
			case "todays":
				previewContent = (
					<div className="bg-surface border border-accent rounded-lg p-3 shadow-lg max-w-xs">
						<span className="text-sm font-medium text-primary">{sourceData.title}</span>
					</div>
				);
				break;
			case "daily":
				previewContent = (
					<div className="bg-surface border border-accent rounded-lg p-3 shadow-lg max-w-xs">
						<span className="text-sm font-medium text-primary">{sourceData.task}</span>
					</div>
				);
				break;
			case "weekly":
				previewContent = (
					<div className="bg-surface border border-accent rounded-lg p-2 shadow-lg max-w-xs">
						<span className="text-xs font-medium text-primary">{sourceData.task}</span>
					</div>
				);
				break;
			default:
				previewContent = (
					<div className="bg-surface border border-accent rounded-lg p-3 shadow-lg max-w-xs">
						<span className="text-sm text-primary">Task</span>
					</div>
				);
		}

		return previewContent;
	};

	return (
		<DndContext 
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragStart={handleDragStart}
			onDragOver={handleDragOver}
			onDragEnd={handleDragEnd}
		>
			<main className="min-h-screen bg-background">
				<Navigation />
				<div className="flex flex-col p-6 gap-6">
					{/* Top row - three cards in a row, equal height */}
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
						<Kanban />
						<TodaysList />
						<DailyCheckList />
					</div>

					{/* Bottom section - Weekly Checklist with flexible height */}
					<div className="flex-1 min-h-0">
						<WeeklyChecklist />
					</div>
				</div>
			</main>
			
			{/* Drag Overlay for visual feedback */}
			<DragOverlay dropAnimation={null}>
				{activeId ? <DragPreview /> : null}
			</DragOverlay>
		</DndContext>
	);
}
