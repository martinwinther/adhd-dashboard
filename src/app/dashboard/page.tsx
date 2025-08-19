"use client";
import Navigation from "@/components/Navigation";
import Kanban from "@/app/dashboard/components/Kanban";
import WeeklyChecklist from "@/app/dashboard/components/WeeklyChecklist";
import DailyCheckList from "@/app/dashboard/components/DailyChecklist";
import TodaysList from "@/app/dashboard/components/TodaysList";
import { DndContext, DragEndEvent } from "@dnd-kit/core";

export default function Home() {
	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		
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

				const event = new CustomEvent("task-moved", {
					detail: {
						taskId: parseInt(taskId),
						fromComponent,
						toComponent,
						toData,
					},
				});
				window.dispatchEvent(event);
			}
		}
	};

	return (
		<DndContext onDragEnd={handleDragEnd}>
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
		</DndContext>
	);
}
