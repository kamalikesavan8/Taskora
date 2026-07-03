import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useRegisterMutation } from '../features/auth/authApiSlice';
import { setCredentials } from '../features/auth/authSlice';
import { validateName, validatePassword, validateEmail } from '../utils/validationUtils';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const validate = () => {
    const newErrors = {};
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    if (nameError) newErrors.name = nameError;
    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      }).unwrap();
      dispatch(setCredentials(result));
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error?.data?.message || 'Registration failed');
    }
  };

  // Password strength checker
  const getPasswordStrength = (password) => {
    if (!password) return null;
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) strength++;
    if (strength <= 1) return { label: 'Weak', color: 'bg-red-500', width: 'w-1/4' };
    if (strength === 2) return { label: 'Fair', color: 'bg-yellow-500', width: 'w-2/4' };
    if (strength === 3) return { label: 'Good', color: 'bg-blue-500', width: 'w-3/4' };
    return { label: 'Strong', color: 'bg-emerald-500', width: 'w-full' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-600 mb-2">Taskora</h1>
          <p className="text-gray-500 text-sm">Create your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={`px-4 py-3 rounded-lg border text-sm transition ${
                errors.name
                  ? 'border-red-400 focus:ring-2 focus:ring-red-100'
                  : 'border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100'
              }`}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-0.5">⚠️ {errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={`px-4 py-3 rounded-lg border text-sm transition ${
                errors.email
                  ? 'border-red-400 focus:ring-2 focus:ring-red-100'
                  : 'border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100'
              }`}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-0.5">⚠️ {errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className={`px-4 py-3 rounded-lg border text-sm transition ${
                errors.password
                  ? 'border-red-400 focus:ring-2 focus:ring-red-100'
                  : 'border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100'
              }`}
            />
            {/* Password Strength Bar */}
            {formData.password && (
              <div className="mt-1">
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className={`h-1.5 rounded-full transition-all ${passwordStrength?.color} ${passwordStrength?.width}`}></div>
                </div>
                <p className={`text-xs mt-0.5 font-medium ${
                  passwordStrength?.label === 'Weak' ? 'text-red-500' :
                  passwordStrength?.label === 'Fair' ? 'text-yellow-500' :
                  passwordStrength?.label === 'Good' ? 'text-blue-500' :
                  'text-emerald-500'
                }`}>
                  {passwordStrength?.label} password
                </p>
              </div>
            )}
            {errors.password && (
              <p className="text-xs text-red-500 mt-0.5">⚠️ {errors.password}</p>
            )}
            {/* Password Rules */}
            {formData.password && (
              <div className="mt-1 flex flex-col gap-0.5">
                <p className={`text-xs ${/[A-Z]/.test(formData.password) ? 'text-emerald-500' : 'text-gray-400'}`}>
                  {/[A-Z]/.test(formData.password) ? '✅' : '⬜'} One uppercase letter
                </p>
                <p className={`text-xs ${/[0-9]/.test(formData.password) ? 'text-emerald-500' : 'text-gray-400'}`}>
                  {/[0-9]/.test(formData.password) ? '✅' : '⬜'} One number
                </p>
                <p className={`text-xs ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password) ? 'text-emerald-500' : 'text-gray-400'}`}>
                  {/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password) ? '✅' : '⬜'} One special character
                </p>
                <p className={`text-xs ${formData.password.length >= 6 ? 'text-emerald-500' : 'text-gray-400'}`}>
                  {formData.password.length >= 6 ? '✅' : '⬜'} Minimum 6 characters
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className={`px-4 py-3 rounded-lg border text-sm transition ${
                errors.confirmPassword
                  ? 'border-red-400 focus:ring-2 focus:ring-red-100'
                  : 'border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100'
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 mt-0.5">⚠️ {errors.confirmPassword}</p>
            )}
            {formData.confirmPassword && formData.password === formData.confirmPassword && (
              <p className="text-xs text-emerald-500 mt-0.5">✅ Passwords match</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-sm transition disabled:opacity-70"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-emerald-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;