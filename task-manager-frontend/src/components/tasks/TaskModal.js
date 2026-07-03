import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeCreateTaskModal, closeEditTaskModal } from '../../features/ui/uiSlice';
import { useCreateTaskMutation, useUpdateTaskMutation } from '../../features/tasks/taskApiSlice';
import toast from 'react-hot-toast';

const TaskModal = ({ mode = 'create' }) => {
  const dispatch = useDispatch();
  const { selectedProject, selectedTask } = useSelector((state) => state.ui);
  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
  });

  useEffect(() => {
    if (mode === 'edit' && selectedTask) {
      setFormData({
        title: selectedTask.title || '',
        description: selectedTask.description || '',
        priority: selectedTask.priority || 'medium',
        dueDate: selectedTask.dueDate
          ? new Date(selectedTask.dueDate).toISOString().split('T')[0]
          : '',
      });
    }
  }, [mode, selectedTask]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    if (mode === 'create') dispatch(closeCreateTaskModal());
    else dispatch(closeEditTaskModal());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === 'create') {
        await createTask({
          projectId: selectedProject._id,
          ...formData,
        }).unwrap();
        toast.success('Task created!');
      } else {
        await updateTask({
          id: selectedTask._id,
          ...formData,
        }).unwrap();
        toast.success('Task updated!');
      }
      handleClose();
    } catch {
      toast.error(`Failed to ${mode} task`);
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
   <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">
            {mode === 'create' ? 'Create New Task' : 'Edit Task'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Task title"
              className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
           <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Task description (optional)"
              rows={3}
              className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                />
            </div>
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition disabled:opacity-70"
            >
              {isLoading
                ? mode === 'create' ? 'Creating...' : 'Updating...'
                : mode === 'create' ? 'Create Task' : 'Update Task'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;