import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { useDeleteAccountMutation } from '../../features/auth/authApiSlice';
import EditProfileModal from '../common/EditProfileModal';
import toast from 'react-hot-toast';
import NotificationBell from '../common/NotificationBell';
import { toggleDarkMode } from '../../features/ui/uiSlice';

const Navbar = ({ tasks = [] }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.ui);
  const [deleteAccount] = useDeleteAccountMutation();
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const dropdownRef = useRef(null);
  

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setShowDeleteConfirm(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount().unwrap();
      dispatch(logout());
      toast.success('Account deleted successfully');
      navigate('/login');
    } catch {
      toast.error('Failed to delete account');
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase();
  };

  return (
    <>
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <h1 className="text-xl font-bold text-emerald-600">Taskora</h1>

        
        {/* Right side */}
<div className="flex items-center gap-3">
  {/* Dark Mode Toggle */}
<button
  onClick={() => dispatch(toggleDarkMode())}
  className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition"
  title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
>
  {darkMode ? '☀️' : '🌙'}
</button>
  {/* Notification Bell */}

  <NotificationBell tasks={tasks} />
  

  {/* User Dropdown */}
  <div className="relative" ref={dropdownRef}>
          {/* Avatar + Name Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 transition"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-bold">
              {getInitials(user?.name)}
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{user?.name}</span>
            <div className="flex flex-col gap-0.5 ml-1">
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            </div>
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute right-0 top-12 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden">
              {/* Profile Info */}
              <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-bold">
                    {getInitials(user?.name)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">{user?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">

                {/* Edit Profile */}
                <button
                  onClick={() => {
                    setShowEditProfile(true);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition text-left"
                >
                  <span className="text-lg">✏️</span>
                  <span>Edit Profile</span>
                </button>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition text-left"
                >
                  <span className="text-lg">🚪</span>
                  <span>Logout</span>
                </button>

                {/* Divider */}
                <div className="border-t border-gray-100 my-2"></div>

                {/* Delete Account */}
                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition text-left"
                  >
                    <span className="text-lg">🗑️</span>
                    <span>Delete Account</span>
                  </button>
                ) : (
                  <div className="px-3 py-3 bg-red-50 rounded-xl">
                    <p className="text-xs text-red-600 font-medium mb-3">
                      Are you sure? This cannot be undone.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleDeleteAccount}
                        className="flex-1 py-1.5 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition font-medium"
                      >
                        Yes, Delete
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex-1 py-1.5 bg-white text-gray-600 text-xs rounded-lg hover:bg-gray-100 transition font-medium border border-gray-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        </div>
      </nav>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <EditProfileModal onClose={() => setShowEditProfile(false)} />
      )}
    </>
  );
};

export default Navbar;