import React from 'react';
import TaskCard from './TaskCard';
import { useUpdateTaskStatusMutation } from '../../features/tasks/taskApiSlice';
import toast from 'react-hot-toast';

const columnStyles = {
  todo: {
    label: 'To Do',
    color: 'bg-gray-100 dark:bg-gray-800',
    badge: 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
    dot: 'bg-gray-400'
  },
  'in-progress': {
    label: 'In Progress',
    color: 'bg-blue-50 dark:bg-blue-900/20',
    badge: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400',
    dot: 'bg-blue-400'
  },
  done: {
    label: 'Done',
    color: 'bg-green-50 dark:bg-green-900/20',
    badge: 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400',
    dot: 'bg-green-400'
  },
};
const KanbanColumn = ({ status, tasks }) => {
  const [updateTaskStatus] = useUpdateTaskStatusMutation();
  const style = columnStyles[status];

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const fromStatus = e.dataTransfer.getData('fromStatus');
    if (fromStatus === status) return;
    try {
      await updateTaskStatus({ id: taskId, status }).unwrap();
      toast.success(`Task moved to ${style.label}`);
    } catch {
      toast.error('Failed to update task status');
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`flex-1 ${style.color} rounded-2xl p-4 min-h-96 border-2 border-black-100 dark:border-gray-700`}
    >
      {/* Column Header */}
      <div className="flex items-center gap-2 mb-4 ">
        <div className={`w-2 h-2 rounded-full ${style.dot}`}></div>
        <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm">{style.label}</h3>
        <span className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full ${style.badge}`}>
          {tasks.length}
        </span>
      </div>

      {/* Task Cards */}
      <div className="flex flex-col gap-3">
        {tasks.map((task) => (
          <div
            key={task._id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('taskId', task._id);
              e.dataTransfer.setData('fromStatus', task.status);
            }}
          >
            <TaskCard task={task} />
          </div>
        ))}
      </div>

      {tasks.length === 0 && (
        <div className="text-center text-gray-400 dark:text-gray-500 text-sm mt-8">
        </div>
      )}
    </div>
  );
};

export default KanbanColumn;