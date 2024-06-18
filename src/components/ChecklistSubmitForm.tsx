import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { createDailyTasks } from "@/lib/data";

type DailyChecklistSubmitFormProps = {
	addTask: (
		taskDescription: string,
		day?:
			| "monday"
			| "tuesday"
			| "wednesday"
			| "thursday"
			| "friday"
			| "saturday"
			| "sunday",
	) => void;
	day?:
		| "monday"
		| "tuesday"
		| "wednesday"
		| "thursday"
		| "friday"
		| "saturday"
		| "sunday"; // Optional day property
};

const DailyChecklistSubmitForm = ({
	addTask,
	day,
}: DailyChecklistSubmitFormProps) => {
	const [todoValue, setTodoValue] = useState({ id: 0, task: "" });

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault(); // Prevent the default form submission behavior
		if (todoValue.task.trim()) {
			createDailyTasks(todoValue.id, todoValue.task);
			addTask(todoValue.task, day); // Pass the day if provided
			setTodoValue({ id: 0, task: "" }); // Clear the input after submitting
		}
	};

	const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
		if (event.currentTarget === event.target) {
			setTimeout(() => {
				setTodoValue({ id: 0, task: "" });
			}, 200);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<label>
				<Input
					key="todo-input"
					type="text"
					name="newTodo"
					value={todoValue.task}
					placeholder="Tasks.."
					onBlur={handleBlur}
					onChange={(event) =>
						setTodoValue({ id: Date.now(), task: event.target.value })
					}
				/>
			</label>
			<div className="flex justify-center pt-1">
				{todoValue.task ? (
					<Button type="submit" variant="secondary">
						Add Task
					</Button>
				) : (
					" "
				)}
			</div>
		</form>
	);
};

export default DailyChecklistSubmitForm;
