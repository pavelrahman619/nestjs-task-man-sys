import { useState } from 'react'
import { useTasks } from './hooks/use-api.js'
import { useAuth } from './hooks/useAuth.js'
import './App.css'
import AuthModal from './components/AuthModal.jsx'
import UserProfile from './components/UserProfile.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import TaskCard from './components/TaskCard.jsx'
import TaskForm from './components/TaskForm.jsx'

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showTaskForm, setShowTaskForm] = useState(false)
  
  // Auth state
  const { isAuthenticated, isLoading } = useAuth()
  
  // Example of using TanStack Query hooks
  const { data: tasks, isLoading: tasksLoading, error } = useTasks();

  const handleCreateTask = () => {
    setShowTaskForm(true);
  };

  const handleTaskFormClose = () => {
    setShowTaskForm(false);
  };

  const handleTaskFormSuccess = () => {
    setShowTaskForm(false);
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
        <div className="tasks-container">
          <div className="tasks-header">
            <div>
              <h2>Your Tasks</h2>
              {tasks && (
                <p className="tasks-count">
                  {tasks.length} task{tasks.length !== 1 ? 's' : ''} total
                </p>
              )}
            </div>
            <button 
              className="create-task-btn"
              onClick={handleCreateTask}
            >
              + Add Task
            </button>
          </div>

          {tasksLoading && (
            <div className="tasks-loading">
              <p>Loading your tasks...</p>
            </div>
          )}

          {error && (
            <div className="tasks-error">
              <p>Error loading tasks: {error.message}</p>
            </div>
          )}

          {tasks && tasks.length === 0 && !tasksLoading && (
            <div className="no-tasks">
              <p>No tasks yet!</p>
              <p>Click "Add Task" to create your first task.</p>
            </div>
          )}

          {tasks && tasks.length > 0 && (
            <div className="tasks-grid">
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
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

      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskForm
          onClose={handleTaskFormClose}
          onSuccess={handleTaskFormSuccess}
        />
      )}
    </>
  )
}

export default App
