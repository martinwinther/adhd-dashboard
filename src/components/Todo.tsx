const Todo = () => {
  function math(a: number, b: number) {
    return a + b
  }

  return (
    <div className="bg-red-100 border-2 rounded-lg">
      <h1>This is the todo component</h1>
      <div>{math(8, 9)}</div>
    </div>
  )
}

export default Todo
