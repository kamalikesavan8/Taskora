import React from 'react';
import { useDispatch } from 'react-redux';
import { openEditTaskModal } from '../../features/ui/uiSlice';
import { useDeleteTaskMutation, useRestoreTaskMutation, usePermanentDeleteTaskMutation } from '../../features/tasks/taskApiSlice';
import { getTaskDeadlineStatus } from '../../utils/deadlineUtils';
import toast from 'react-hot-toast';

const priorityColors = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
};

const deadlineStyles = {
  overdue: {
    border: 'border-red-200',
    badge: 'bg-red-50 text-red-400',
    label: '❌ Overdue',
    dateColor: 'text-red-400',
  },
  'due-today': {
    border: 'border-orange-400',
    badge: 'bg-orange-100 text-orange-600',
    label: '🔴 Complete Today!',
    dateColor: 'text-orange-500 font-semibold',
  },
  'due-tomorrow': {
    border: 'border-yellow-400',
    badge: 'bg-yellow-100 text-yellow-600',
    label: '⚠️ Due Tomorrow',
    dateColor: 'text-yellow-600 font-semibold',
  },
  'due-soon': {
    border: 'border-blue-300',
    badge: 'bg-blue-50 text-blue-500',
    label: '🕐 Complete Soon',
    dateColor: 'text-blue-500',
  },
  'on-track': {
    border: 'border-gray-100',
    badge: '',
    label: '',
    dateColor: 'text-gray-400',
  },
};

const TaskCard = ({ task }) => {
  const dispatch = useDispatch();
  const [deleteTask] = useDeleteTaskMutation();
  const [restoreTask] = useRestoreTaskMutation();
  const [permanentDeleteTask] = usePermanentDeleteTaskMutation();

  const deadlineStatus = task.status !== 'done'
    ? getTaskDeadlineStatus(task.dueDate)
    : null;

  const style = deadlineStyles[deadlineStatus] || deadlineStyles['on-track'];

  const handleDelete = async (e) => {
    e.stopPropagation();
    try {
      await deleteTask(task._id).unwrap();

      // Show undo toast
      toast((t) => (
        <div className="flex items-center gap-3">
          <span className="text-sm">Task deleted</span>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              await restoreTask(task._id).unwrap();
              toast.success('Task restored!');
            }}
            className="px-3 py-1 bg-emerald-600 text-white text-xs rounded-lg font-medium hover:bg-emerald-700"
          >
            Undo
          </button>
        </div>
      ), {
        duration: 5000,
        onClose: async () => {
          // Permanently delete after toast expires
          await permanentDeleteTask(task._id).unwrap();
        }
      });

    } catch {
      toast.error('Failed to delete task');
    }
  };

  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div
      onClick={() => dispatch(openEditTaskModal(task))}
      className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border-2 ${style.border} cursor-pointer hover:shadow-md transition group`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>
        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition text-lg leading-none"
        >
          ×
        </button>
      </div>

      {deadlineStatus && deadlineStatus !== 'on-track' && (
        <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-2 ${style.badge}`}>
          {style.label}
        </span>
      )}

      <h4 className="text-sm font-semibold text-gray-800 dark:text-white mb-1">{task.title}</h4>

      {task.description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{task.description}</p>
      )}

      {task.notes && (
        <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 mt-1">
          <span>📝</span>
          <span>Has notes</span>
        </div>
      )}

      {task.dueDate && (
        <div className={`flex items-center gap-1 text-xs ${style.dateColor}`}>
          <span>📅</span>
          <span>{formatDate(task.dueDate)}</span>
        </div>
      )}
    </div>
  );
};

export default TaskCard;