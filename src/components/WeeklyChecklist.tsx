const WeeklyChecklist = () => {
	type ToDoElements = {
		id: number;
		todo: string;
		isComplete: boolean;
		weekday:
			| "monday"
			| "tuesday"
			| "wednesday"
			| "thursday"
			| "friday"
			| "saturday"
			| "sunday";
	};

	const weeklyTasks: ToDoElements[] = [
		{
			id: 1,
			todo: "Fix the car",
			isComplete: false,
			weekday: "monday",
		},
		{
			id: 2,
			todo: "Clean the oven",
			isComplete: false,
			weekday: "monday",
		},
		{
			id: 3,
			todo: "Go to work",
			isComplete: false,
			weekday: "tuesday",
		},
		{
			id: 4,
			todo: "Walk the dog",
			isComplete: false,
			weekday: "wednesday",
		},
		{
			id: 5,
			todo: "Play Super smash bros",
			isComplete: false,
			weekday: "friday",
		},
		{
			id: 6,
			todo: "Throw darts with the boys",
			isComplete: false,
			weekday: "friday",
		},
		{
			id: 7,
			todo: "Workout",
			isComplete: false,
			weekday: "tuesday",
		},
		{
			id: 8,
			todo: "Walk the dog",
			isComplete: false,
			weekday: "wednesday",
		},
		{
			id: 9,
			todo: "Workout",
			isComplete: false,
			weekday: "thursday",
		},
		{
			id: 10,
			todo: "Play Super smash bros",
			isComplete: false,
			weekday: "thursday",
		},
		{
			id: 11,
			todo: "Play Super smash bros",
			isComplete: false,
			weekday: "friday",
		},
		{
			id: 12,
			todo: "Therapy session",
			isComplete: false,
			weekday: "friday",
		},
		{
			id: 13,
			todo: "Hearthstone",
			isComplete: false,
			weekday: "saturday",
		},
		{
			id: 14,
			todo: "Play Super smash bros",
			isComplete: false,
			weekday: "sunday",
		},
		{
			id: 15,
			todo: "Open new packs",
			isComplete: false,
			weekday: "sunday",
		},
	];

	const TodoList = ({ todolists }: { todolists: ToDoElements[] }) => {
		return (
			<div className="flex flex-col md:flex-row justify-between space-y-2 md:space-x-2 md:space-y-0 items-stretch">
				{[
					"monday",
					"tuesday",
					"wednesday",
					"thursday",
					"friday",
					"saturday",
					"sunday",
				].map((day) => (
					<div key={day} className="flex-1 flex flex-col">
						<div className="text-lg font-bold">{day}</div>
						<ul className="flex-1 border-2 border-black p-2 flex flex-col">
							{todolists
								.filter((task) => task.weekday === day)
								.map((task) => (
									<li key={task.id} className="mt-1">
										{task.todo}
									</li>
								))}
						</ul>
					</div>
				))}
			</div>
		);
	};

	return (
		<div className="bg-red-100 border-2 rounded-lg p-2">
			<h1>This is the WeeklyChecklist component</h1>
			<TodoList todolists={weeklyTasks} />
		</div>
	);
};

export default WeeklyChecklist;
