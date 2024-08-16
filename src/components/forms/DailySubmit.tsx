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
		const id = Date.now(); // sets the id to the current timestamp
		if (todoValue.trim()) {
			// checks if the input is not empty
			createDailyTasks(id, todoValue); // creates a new task in the database
			addTask(id, todoValue); // adds the task to the state
			setTodoValue(""); // clears the input after submitting
		}
	};

	// clears the input after it is no longer selected
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
				{" "}
				{/* Only renders the Add Task button if the input is not empty */}
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
