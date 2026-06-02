import { useState, useEffect } from 'react'
import { supabase } from './libs/supabase'
import './App.css'

function App() {
  const [todos, setTodos] = useState([])

  useEffect(() => {
    async function getTodos() {
      const { data, error } = await supabase.from('todos').select()

      if (error) {
        console.error('Supabase fetch error:', error)
        return
      }

      if (data) {
        setTodos(data)
      }
    }

    getTodos()
  }, [])

  return (
    <main className="app-container">
      <h1>Todo list</h1>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.name}</li>
        ))}
      </ul>
    </main>
  )
}

export default App
