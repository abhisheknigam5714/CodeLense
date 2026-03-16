import React from 'react';
import { FiCalendar, FiUser, FiFlag, FiEdit2, FiTrash2 } from 'react-icons/fi';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange, showActions = true }) => {
  const getPriorityClass = (priority) => {
    return `priority-${priority}`;
  };

  const getStatusClass = (status) => {
    return `status-${status}`;
  };

  const formatDate = (date) => {
    if (!date) return 'No due date';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const statusOptions = ['TODO', 'IN_PROGRESS', 'DONE'];

  return (
    <div className={`task-card ${getPriorityClass(task.priority)}`}>
      <div className="d-flex justify-content-between align-items-start mb-2">
        <h6 className="task-title mb-0">{task.title}</h6>
        <span className={`status-badge ${getStatusClass(task.status)}`}>
          {task.status?.replace('_', ' ')}
        </span>
      </div>
      
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}
      
      <div className="task-meta">
        <div className="task-meta-item">
          <FiFlag />
          <span>{task.priority}</span>
        </div>
        <div className="task-meta-item">
          <FiCalendar />
          <span>{formatDate(task.dueDate)}</span>
        </div>
        {task.assignedToName && (
          <div className="task-meta-item">
            <FiUser />
            <span>{task.assignedToName}</span>
          </div>
        )}
      </div>

      {showActions && (
        <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top border-dark">
          <select
            className="form-select form-select-sm form-select-custom"
            style={{ width: 'auto' }}
            value={task.status}
            onChange={(e) => onStatusChange && onStatusChange(task.id, e.target.value)}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status.replace('_', ' ')}
              </option>
            ))}
          </select>
          
          <div className="d-flex gap-2">
            {onEdit && (
              <button
                className="btn btn-sm btn-secondary-custom btn-sm-custom"
                onClick={() => onEdit(task)}
              >
                <FiEdit2 />
              </button>
            )}
            {onDelete && (
              <button
                className="btn btn-sm btn-danger-custom btn-sm-custom"
                onClick={() => onDelete(task.id)}
              >
                <FiTrash2 />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;