import React, { useState, useRef, useEffect } from 'react';
import {
  getDueTodayTasks,
  getDueTomorrowTasks,
  getDueSoonTasks,
  getUrgentTasks
} from '../../utils/deadlineUtils';

const NotificationBell = ({ tasks }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const dueTodayTasks = getDueTodayTasks(tasks);
  const dueTomorrowTasks = getDueTomorrowTasks(tasks);
  const dueSoonTasks = getDueSoonTasks(tasks);
  const totalCount = getUrgentTasks(tasks).length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition"
      >
        <span className="text-xl">🔔</span>
        {totalCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {totalCount > 9 ? '9+' : totalCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">

          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800 text-sm">
              Tasks to Complete
            </h3>
            {totalCount > 0 && (
              <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium">
                {totalCount} pending
              </span>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">

            {/* Due Today */}
            {dueTodayTasks.length > 0 && (
              <div className="p-3">
                <p className="text-xs font-semibold text-orange-500 uppercase tracking-wider mb-2">
                  🔴 Must Complete Today ({dueTodayTasks.length})
                </p>
                {dueTodayTasks.map((task) => (
                  <div
                    key={task._id}
                    className="flex items-start gap-3 p-2.5 rounded-xl bg-orange-50 mb-2"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{task.title}</p>
                      <p className="text-xs text-orange-500 mt-0.5">
                        Due today — complete before end of day!
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Due Tomorrow */}
            {dueTomorrowTasks.length > 0 && (
              <div className="p-3 border-t border-gray-50">
                <p className="text-xs font-semibold text-yellow-600 uppercase tracking-wider mb-2">
                  ⚠️ Due Tomorrow ({dueTomorrowTasks.length})
                </p>
                {dueTomorrowTasks.map((task) => (
                  <div
                    key={task._id}
                    className="flex items-start gap-3 p-2.5 rounded-xl bg-yellow-50 mb-2"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{task.title}</p>
                      <p className="text-xs text-yellow-600 mt-0.5">
                        Complete this by tomorrow
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Due Soon (2-3 days) */}
            {dueSoonTasks.length > 0 && (
              <div className="p-3 border-t border-gray-50">
                <p className="text-xs font-semibold text-blue-500 uppercase tracking-wider mb-2">
                  🕐 Complete Soon ({dueSoonTasks.length})
                </p>
                {dueSoonTasks.map((task) => (
                  <div
                    key={task._id}
                    className="flex items-start gap-3 p-2.5 rounded-xl bg-blue-50 mb-2"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{task.title}</p>
                      <p className="text-xs text-blue-500 mt-0.5">
                        Due {formatDate(task.dueDate)} — plan ahead!
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {totalCount === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <span className="text-4xl mb-2">✅</span>
                <p className="text-sm font-medium text-gray-700">All caught up!</p>
                <p className="text-xs text-gray-400 mt-1">
                  No tasks need your attention right now
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;