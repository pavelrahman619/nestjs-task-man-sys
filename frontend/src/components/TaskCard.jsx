import React from 'react';
import { useUpdateTask, useDeleteTask } from '../hooks/use-api.js';
import '../styles/task-card.css';

const TaskCard = ({ task }) => {
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  const handleStatusChange = (newStatus) => {
    updateTaskMutation.mutate({
      id: task.id,
      status: newStatus,
    });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTaskMutation.mutate(task.id);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return '#ffc107'; // Yellow
      case 'IN_PROGRESS':
        return '#007bff'; // Blue
      case 'COMPLETED':
        return '#28a745'; // Green
      default:
        return '#6c757d'; // Gray
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="task-card">
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
        <div 
          className="task-status"
          style={{ backgroundColor: getStatusColor(task.status) }}
        >
          {task.status.replace('_', ' ')}
        </div>
      </div>
      
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}
      
      <div className="task-dates">
        <small className="task-date">
          Created: {formatDate(task.createdAt)}
        </small>
        {task.updatedAt !== task.createdAt && (
          <small className="task-date">
            Updated: {formatDate(task.updatedAt)}
          </small>
        )}
      </div>
      
      <div className="task-actions">
        <div className="status-buttons">
          <button
            className={`status-btn ${task.status === 'PENDING' ? 'active' : ''}`}
            onClick={() => handleStatusChange('PENDING')}
            disabled={updateTaskMutation.isPending}
          >
            Pending
          </button>
          <button
            className={`status-btn ${task.status === 'IN_PROGRESS' ? 'active' : ''}`}
            onClick={() => handleStatusChange('IN_PROGRESS')}
            disabled={updateTaskMutation.isPending}
          >
            In Progress
          </button>
          <button
            className={`status-btn ${task.status === 'COMPLETED' ? 'active' : ''}`}
            onClick={() => handleStatusChange('COMPLETED')}
            disabled={updateTaskMutation.isPending}
          >
            Completed
          </button>
        </div>
        
        <button
          className="delete-btn"
          onClick={handleDelete}
          disabled={deleteTaskMutation.isPending}
          title="Delete task"
        >
          🗑️
        </button>
      </div>
      
      {(updateTaskMutation.isPending || deleteTaskMutation.isPending) && (
        <div className="task-loading">
          {updateTaskMutation.isPending ? 'Updating...' : 'Deleting...'}
        </div>
      )}
      
      {updateTaskMutation.isError && (
        <div className="task-error">
          Error: {updateTaskMutation.error.message}
        </div>
      )}
    </div>
  );
};

export default TaskCard;
