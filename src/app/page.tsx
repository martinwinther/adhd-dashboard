import Kanban from '@/components/Kanban'
import Todo from '@/components/Todo'

export default function Home() {

  const name = 'Martin'

  return (
    <main className="dark">
      <div className=" bg-yellow-100 flex justify-center items-center">Hej</div>
      <div className="flex flex-row justify-center items-center space-x-4">
  
      <Todo />  
      <Kanban />

      </div>
    </main>
  )
}
