import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilterPriority, setSearchQuery } from '../../features/ui/uiSlice';

const priorities = [
  { value: 'all', label: 'All Priorities', color: 'bg-gray-100 text-gray-600' },
  { value: 'low', label: 'Low', color: 'bg-emerald-100 text-emerald-600' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-600' },
  { value: 'high', label: 'High', color: 'bg-red-100 text-red-600' },
];

const TaskFilters = () => {
  const dispatch = useDispatch();
  const { filterPriority, searchQuery } = useSelector((state) => state.ui);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const activeFilter = priorities.find((p) => p.value === filterPriority);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border-2 border-black-200 dark:border-gray-700 rounded-xl px-4 py-2.5 flex-1 min-w-48 shadow-sm mb-4">
      {/* Search Bar */}
      <div className="flex items-center gap-2 bg-white dark:bg-gray-300 border-2 border-black-100 dark:border-gray-700 rounded-xl px-4 py-2.5 flex-1 min-w-48 shadow-sm">
        <span className="text-gray-400">🔍</span>
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          className="flex-1 text-sm text-gray-700 dark:text-black-200 outline-none placeholder-gray-400 bg-transparent"
          />
        {searchQuery && (
          <button
            onClick={() => dispatch(setSearchQuery(''))}
            className="text-gray-400 hover:text-gray-600 text-lg leading-none"
          >
            ×
          </button>
        )}
      </div>

      {/* Filter Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border shadow-sm text-sm font-medium transition ${
  filterPriority !== 'all'
    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
}`}
        >
          {/* Filter Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
          <span>
            {filterPriority === 'all' ? 'Filter' : `Priority: ${activeFilter?.label}`}
          </span>
          {/* Active indicator dot */}
          {filterPriority !== 'all' && (
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          )}
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute right-0 top-12 w-52 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden">
            <div className="p-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 py-2">
                Filter by Priority
              </p>
              {priorities.map((p) => (
                <button
                  key={p.value}
                  onClick={() => {
                    dispatch(setFilterPriority(p.value));
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition ${
                    filterPriority === p.value
                      ? 'bg-emerald-50 text-emerald-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.color}`}>
                      {p.label}
                    </span>
                  </div>
                  {filterPriority === p.value && (
                    <span className="text-emerald-500 text-base">✓</span>
                  )}
                </button>
              ))}

              {/* Clear filter */}
              {filterPriority !== 'all' && (
                <>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={() => {
                      dispatch(setFilterPriority('all'));
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 transition"
                  >
                    <span>×</span>
                    <span>Clear Filter</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskFilters;