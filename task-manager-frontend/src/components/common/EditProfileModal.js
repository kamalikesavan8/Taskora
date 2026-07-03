import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useUpdateProfileMutation } from '../../features/auth/authApiSlice';
import { setCredentials } from '../../features/auth/authSlice';
import { validateName, validatePassword } from '../../utils/validationUtils';
import toast from 'react-hot-toast';

const EditProfileModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: user?.name || '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const newErrors = {};

  const nameError = validateName(formData.name);
  if (nameError) newErrors.name = nameError;

  if (formData.password) {
    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  try {
    const updateData = { name: formData.name };
    if (formData.password) updateData.password = formData.password;
    const result = await updateProfile(updateData).unwrap();
    dispatch(setCredentials({ token, user: result.user }));
    toast.success('Profile updated successfully!');
    onClose();
  } catch {
    toast.error('Failed to update profile');
  }
};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-800 dark: text-white">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"             
              required
            />
          </div>
          {errors.name && (
  <p className="text-xs text-red-500 mt-0.5">⚠️ {errors.name}</p>
)}

          {/* Email (read only) */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Email</label>
            <input
              type="email"
              value={user?.email}
              className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"             
              disabled
            />
            <p className="text-xs text-gray-400">Email cannot be changed</p>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 pt-2">
            <p className="text-xs text-gray-400 mb-3">
              Leave password fields empty to keep current password
            </p>
          </div>

          {/* New Password */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">New Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter new password"
              className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"             
            />
          </div>
          {errors.password && (
  <p className="text-xs text-red-500 mt-0.5">⚠️ {errors.password}</p>
)}

          {/* Confirm Password */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"             
            />
          </div>
          {errors.confirmPassword && (
  <p className="text-xs text-red-500 mt-0.5">⚠️ {errors.confirmPassword}</p>
)}

          {/* Buttons */}
          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-600 transition disabled:opacity-70"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;