import { useState, useEffect } from 'react'
import './App.css'
import TodoItem from './components/TodoItem'

function App() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos')
    return savedTodos ? JSON.parse(savedTodos) : []
  })
  const [inputValue, setInputValue] = useState('')
  const [filter, setFilter] = useState('all') // 'all', 'active', 'completed'

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = (e) => {
    e.preventDefault()
    if (inputValue.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: inputValue.trim(),
          completed: false,
        },
      ])
      setInputValue('')
    }
  }

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed))
  }

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const activeTodosCount = todos.filter((todo) => !todo.completed).length

  return (
    <div className="app">
      <div className="container">
        <h1 className="title">To Do List</h1>
        
        <form onSubmit={addTodo} className="todo-form">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="What needs to be done?"
            className="todo-input"
          />
          <button type="submit" className="add-button">
            Add
          </button>
        </form>

        {todos.length > 0 && (
          <>
            <div className="filter-buttons">
              <button
                onClick={() => setFilter('all')}
                className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
              >
                All
              </button>
              <button
                onClick={() => setFilter('active')}
                className={filter === 'active' ? 'filter-btn active' : 'filter-btn'}
              >
                Active
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={filter === 'completed' ? 'filter-btn active' : 'filter-btn'}
              >
                Completed
              </button>
            </div>

            <div className="todo-list">
              {filteredTodos.length > 0 ? (
                filteredTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={toggleTodo}
                    onDelete={deleteTodo}
                  />
                ))
              ) : (
                <p className="empty-message">No todos found</p>
              )}
            </div>

            <div className="footer">
              <span className="todo-count">
                {activeTodosCount} {activeTodosCount === 1 ? 'item' : 'items'} left
              </span>
              {todos.some((todo) => todo.completed) && (
                <button onClick={clearCompleted} className="clear-button">
                  Clear Completed
                </button>
              )}
            </div>
          </>
        )}

        {todos.length === 0 && (
          <div className="empty-state">
            <p>No tasks yet. Add one above to get started!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
