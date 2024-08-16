import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { createDailyTasks } from "@/lib/data";

type DailyChecklistSubmitFormProps = {
	addTask: (id: number, taskDescription: string) => void;
};

const DailyChecklistSubmitForm = ({
	addTask,
}: DailyChecklistSubmitFormProps) => {
	const [todoValue, setTodoValue] = useState("");

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault(); // Prevent the default form submission behavior
		const id = Date.now();
		if (todoValue.trim()) {
			createDailyTasks(id, todoValue);
			addTask(id, todoValue);
			setTodoValue(""); // Clear the input after submitting
		}
	};

	const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
		if (event.currentTarget === event.target) {
			setTimeout(() => {
				setTodoValue("");
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
					value={todoValue}
					placeholder="Tasks.."
					onBlur={handleBlur}
					onChange={(event) => setTodoValue(event.target.value)}
				/>
			</label>
			<div className="flex justify-center pt-1">
				{todoValue ? (
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
