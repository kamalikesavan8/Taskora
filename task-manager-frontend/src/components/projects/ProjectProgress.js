import React from 'react';

const ProjectProgress = ({ tasks }) => {
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.status === 'done').length;
  const percentage = totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);

  const getProgressColor = () => {
    if (percentage === 100) return 'bg-emerald-500';
    if (percentage >= 60) return 'bg-blue-500';
    if (percentage >= 30) return 'bg-yellow-500';
    return 'bg-red-400';
  };

  const getProgressMessage = () => {
    if (totalTasks === 0) return 'No tasks yet';
    if (percentage === 100) return '🎉 All tasks completed!';
    if (percentage >= 60) return 'Great progress, keep going!';
    if (percentage >= 30) return 'Making progress...';
    return 'Just getting started!';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border-2 border-black-100 dark:border-gray-700 mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Project Progress</span>
          <span className="text-xs text-gray-400 dark:text-gray-500">{getProgressMessage()}</span>
        </div>
        <span className="text-sm font-bold text-gray-800 dark:text-white">
          {doneTasks}/{totalTasks} tasks
          <span className={`ml-2 text-xs font-semibold ${
            percentage === 100 ? 'text-emerald-500' :
            percentage >= 60 ? 'text-blue-500' :
            percentage >= 30 ? 'text-yellow-500' : 'text-red-400'
          }`}>
            ({percentage}%)
          </span>
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ${getProgressColor()}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProjectProgress;