import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForgotPasswordMutation } from '../features/auth/authApiSlice';
import toast from 'react-hot-toast';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [resetUrl, setResetUrl] = useState('');
  const [sent, setSent] = useState(false);
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await forgotPassword({ email }).unwrap();
      setResetUrl(result.resetUrl);
      setSent(true);
      toast.success('Reset link generated!');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to generate reset link');
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-10 w-full max-w-md text-center">
          <h1 className="text-3xl font-bold text-emerald-600 mb-6">Taskora</h1>
          <div className="text-5xl mb-4">🔗</div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
            Reset Link Generated!
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Click the button below to reset your password.
            This link expires in 1 hour.
          </p>
          <a
            href={resetUrl}
            className="inline-block w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-sm transition mb-4"
          >
            Reset My Password →
          </a>
          <Link
            to="/login"
            className="text-emerald-600 font-medium hover:underline text-sm"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-600 mb-2">Taskora</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Reset your password</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
              className="px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-sm transition disabled:opacity-70"
          >
            {isLoading ? 'Generating...' : 'Get Reset Link'}
          </button>

          <Link
            to="/login"
            className="text-center text-sm text-emerald-600 font-medium hover:underline"
          >
            Back to Sign In
          </Link>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;