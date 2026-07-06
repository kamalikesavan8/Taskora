import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import KanbanColumn from '../components/tasks/KanbanColumn';
import TaskModal from '../components/tasks/TaskModal';
import TaskFilters from '../components/tasks/TaskFilters';
import ProjectProgress from '../components/projects/ProjectProgress';
import { useGetTasksQuery } from '../features/tasks/taskApiSlice';
import { getDueTodayTasks, getDueTomorrowTasks, getDueSoonTasks } from '../utils/deadlineUtils';
import { openCreateTaskModal } from '../features/ui/uiSlice';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { selectedProject, isCreateTaskModalOpen, isEditTaskModalOpen, filterPriority, searchQuery } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);
  const notifiedRef = useRef(false);

  const { data: tasks = [], isLoading } = useGetTasksQuery(
    selectedProject?._id,
    { skip: !selectedProject }
  );

  // Apply search and filter
  const filteredTasks = tasks
    .filter((t) => filterPriority === 'all' || t.priority === filterPriority)
    .filter((t) => t.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const todoTasks = filteredTasks.filter((t) => t.status === 'todo');
  const inProgressTasks = filteredTasks.filter((t) => t.status === 'in-progress');
  const doneTasks = filteredTasks.filter((t) => t.status === 'done');

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return `Good morning, ${user?.name}! ☀️`;
    if (hour < 17) return `Good afternoon, ${user?.name}! 👋`;
    return `Good evening, ${user?.name}! 🌙`;
  };

  useEffect(() => {
    if (tasks.length === 0 || notifiedRef.current) return;

    const dueToday = getDueTodayTasks(tasks);
    const dueTomorrow = getDueTomorrowTasks(tasks);
    const dueSoon = getDueSoonTasks(tasks);

    if (dueToday.length > 0) {
      toast.error(
        `🔴 ${dueToday.length} task${dueToday.length > 1 ? 's' : ''} must be completed today!`,
        { duration: 5000 }
      );
    } else if (dueTomorrow.length > 0) {
      toast(
        `⚠️ ${dueTomorrow.length} task${dueTomorrow.length > 1 ? 's are' : ' is'} due tomorrow!`,
        { duration: 4000, icon: '⚠️' }
      );
    } else if (dueSoon.length > 0) {
      toast(
        `🕐 ${dueSoon.length} task${dueSoon.length > 1 ? 's' : ''} coming up soon — plan ahead!`,
        { duration: 3000, icon: '🕐' }
      );
    }

    notifiedRef.current = true;
  }, [tasks]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Navbar tasks={tasks} />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          {!selectedProject ? (
            <div className="flex flex-col h-full">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border-2 border-black-100 dark:border-gray-700 mb-4">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                  {getWelcomeMessage()}
                </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Select a project from the sidebar or create a new one to get started.
                </p>
              </div>
              <div className="flex flex-col items-center justify-center flex-1 text-center">
                <div className="text-7xl mb-4">📋</div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">
                  No Project Selected
                </h3>
                <p className="text-gray-500 text-sm max-w-xs">
                  Create or select a project from the sidebar to view your Kanban board
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Welcome Message */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border-2 border-black-100 dark:border-gray-700 mb-4">
  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
    {getWelcomeMessage()}
  </h2>
  <p className="text-gray-500 dark:text-gray-400 text-sm">
    You have{' '}
    <span className="font-semibold text-emerald-600">
      {tasks.filter(t => t.status === 'in-progress').length} task
      {tasks.filter(t => t.status === 'in-progress').length !== 1 ? 's' : ''}
    </span>{' '}
    in progress today.
  </p>
</div>

              {/* Progress Bar */}
              <ProjectProgress tasks={tasks} />

              {/* Project Header */}
              {/* Project Header */}
<div className="flex items-center justify-between mb-4">
  <div>
    <h3 className="text-xl font-bold text-gray-800 dark:text-white">
      {selectedProject.title}
    </h3>
    <div className="flex items-center gap-3 mt-1">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Kanban Board
      </p>
      <span className="text-gray-300 dark:text-gray-600">•</span>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        📅 Created {new Date(selectedProject.createdAt).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        })}
      </p>
      <span className="text-gray-300 dark:text-gray-600">•</span>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {tasks.length} task{tasks.length !== 1 ? 's' : ''} total
      </p>
    </div>
  </div>
  <button
    onClick={() => dispatch(openCreateTaskModal())}
    className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition shadow-sm"
  >
    + Add Task
  </button>
</div>

              {/* Search and Filter */}
              <TaskFilters />

              {/* Search result message */}
              {searchQuery && (
                <p className="text-sm text-gray-500 mb-3">
                  Showing results for{' '}
                  <span className="font-semibold text-emerald-600">"{searchQuery}"</span>
                  {' '}— {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} found
                </p>
              )}

              {/* Kanban Board */}
              {isLoading ? (
                <div className="text-center text-gray-400 mt-20">
                  Loading tasks...
                </div>
              ) : (
                <div className="flex gap-4">
                  <KanbanColumn status="todo" tasks={todoTasks} />
                  <KanbanColumn status="in-progress" tasks={inProgressTasks} />
                  <KanbanColumn status="done" tasks={doneTasks} />
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {isCreateTaskModalOpen && <TaskModal mode="create" />}
      {isEditTaskModalOpen && <TaskModal mode="edit" />}
    </div>
  );
};

export default DashboardPage;