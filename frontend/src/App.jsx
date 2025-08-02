import { useState } from 'react'
import { useTasks, useCreateTask } from './hooks/use-api.js'
import { useAuth } from './hooks/useAuth.js'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AuthModal from './components/AuthModal.jsx'
import UserProfile from './components/UserProfile.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

function App() {
  const [count, setCount] = useState(0)
  const [showAuthModal, setShowAuthModal] = useState(false)
  
  // Auth state
  const { isAuthenticated, isLoading } = useAuth()
  
  // Example of using TanStack Query hooks
  const { data: tasks, isLoading: tasksLoading, error } = useTasks();
  const createTaskMutation = useCreateTask();

  const handleCreateTask = () => {
    createTaskMutation.mutate({
      title: 'Sample Task',
      description: 'This is a sample task created from React',
      status: 'PENDING',
    });
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <h1>Task Management System</h1>
      
      {/* Authentication Section */}
      <div className="card">
        {isAuthenticated ? (
          <UserProfile />
        ) : (
          <div>
            <p>Please sign in to access your tasks</p>
            <button onClick={() => setShowAuthModal(true)}>
              Sign In / Sign Up
            </button>
          </div>
        )}
      </div>

      {/* Protected Tasks Section */}
      <ProtectedRoute 
        fallback={
          <div className="card">
            <h2>Tasks</h2>
            <p>Please sign in to view your tasks</p>
          </div>
        }
      >
        <div className="card">
          <h2>Your Tasks</h2>
          {tasksLoading && <p>Loading tasks...</p>}
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
      </ProtectedRoute>

      {/* Auth Modal */}
      <AuthModal 
        isVisible={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  )
}

export default App
