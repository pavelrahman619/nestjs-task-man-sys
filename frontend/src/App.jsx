import { useState } from 'react'
import { useTasks, useCreateTask } from './hooks/use-api.js'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  
  // Example of using TanStack Query hooks
  const { data: tasks, isLoading, error } = useTasks();
  const createTaskMutation = useCreateTask();

  const handleCreateTask = () => {
    createTaskMutation.mutate({
      title: 'Sample Task',
      description: 'This is a sample task created from React',
      status: 'PENDING',
    });
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React + TanStack Query</h1>
      
      {/* TanStack Query Example */}
      <div className="card">
        <h2>Tasks</h2>
        {isLoading && <p>Loading tasks...</p>}
        {error && <p>Error loading tasks: {error.message}</p>}
        {tasks && (
          <div>
            <p>Loaded {tasks.length || 0} tasks</p>
            <button 
              onClick={handleCreateTask}
              disabled={createTaskMutation.isPending}
            >
              {createTaskMutation.isPending ? 'Creating...' : 'Create Sample Task'}
            </button>
            {createTaskMutation.isError && (
              <p>Error creating task: {createTaskMutation.error.message}</p>
            )}
          </div>
        )}
      </div>

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
