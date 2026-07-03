export const getTaskDeadlineStatus = (dueDate) => {
  if (!dueDate) return null;

  const now = new Date();
  const due = new Date(dueDate);
  const diffTime = due - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'overdue';
  if (diffDays === 0) return 'due-today';
  if (diffDays === 1) return 'due-tomorrow';
  if (diffDays <= 3) return 'due-soon';
  return 'on-track';
};

// Tasks overdue (for card indication only, no notification)
export const getOverdueTasks = (tasks) => {
  return tasks.filter((task) => {
    if (!task.dueDate || task.status === 'done') return false;
    return getTaskDeadlineStatus(task.dueDate) === 'overdue';
  });
};

// Tasks due today — must complete today
export const getDueTodayTasks = (tasks) => {
  return tasks.filter((task) => {
    if (!task.dueDate || task.status === 'done') return false;
    return getTaskDeadlineStatus(task.dueDate) === 'due-today';
  });
};

// Tasks due tomorrow — urgent
export const getDueTomorrowTasks = (tasks) => {
  return tasks.filter((task) => {
    if (!task.dueDate || task.status === 'done') return false;
    return getTaskDeadlineStatus(task.dueDate) === 'due-tomorrow';
  });
};

// Tasks due in 2-3 days — complete soon
export const getDueSoonTasks = (tasks) => {
  return tasks.filter((task) => {
    if (!task.dueDate || task.status === 'done') return false;
    return getTaskDeadlineStatus(task.dueDate) === 'due-soon';
  });
};

// All tasks that need attention (for bell count)
export const getUrgentTasks = (tasks) => {
  return tasks.filter((task) => {
    if (!task.dueDate || task.status === 'done') return false;
    const status = getTaskDeadlineStatus(task.dueDate);
    return ['due-today', 'due-tomorrow', 'due-soon'].includes(status);
  });
};