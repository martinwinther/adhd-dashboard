import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";

type DailyChecklistSubmitFormProps = {
	addTask: (taskDescription: string) => void;
};

const DailyChecklistSubmitForm = ({
	addTask,
}: DailyChecklistSubmitFormProps) => {
	const [todoValue, setTodoValue] = useState("");

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault(); // Prevent the default form submission behavior
		if (todoValue.trim()) {
			addTask(todoValue);
			setTodoValue(""); // Clear the input after submitting, if desired
		}
	};

	return (
		<>
			<form onSubmit={handleSubmit}>
				<label>
					<Input
						key="todo-input"
						type="text"
						name="newTodo"
						value={todoValue}
						placeholder="Tasks.."
						onChange={(event) => setTodoValue(event.target.value)}
					/>
				</label>
				<div className="flex justify-center pt-1">
					<Button type="submit" variant="secondary">
						Add Task
					</Button>
				</div>
			</form>
		</>
	);
};

export default DailyChecklistSubmitForm;