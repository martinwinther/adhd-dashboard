const Todo = ({name}: {name: string}) => {


  type ToDoElements = {
    id: number,
    todo: string,
    isComplete: boolean,
    
  }
  const tasks: ToDoElements[] = [
    {
      id: 1,
      todo: "Fix the car",
      isComplete: false
    },
    {
      id: 2,
      todo: "Clean the oven",
      isComplete: false
    },
    {
      id: 3,
      todo: "Go to work",
      isComplete: false
    },
    {
      id: 4,
      todo: "Walk the dog",
      isComplete: false
    }
  ];

  const TodoList = ({todolists}: {todolists: ToDoElements[]}) => {
    return (   
      <ul>
        {todolists.map(task => (
      <li key={task.id}>{task.todo}</li>
    ))
  }
</ul>
     
    )
  }

  

  return (
    <div className="bg-red-100 border-2 rounded-lg">
      <h1>This is the todo component</h1>
      <TodoList todolists={tasks}/>
    </div>
  )
}

export default Todo

