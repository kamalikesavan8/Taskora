import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const features = [
  {
    icon: '📋',
    title: 'Kanban Boards',
    description: 'Visualize your workflow with intuitive drag-and-drop Kanban boards. Move tasks between To Do, In Progress, and Done effortlessly.',
  },
  {
    icon: '🔔',
    title: 'Smart Notifications',
    description: 'Never miss a deadline. Get notified about tasks due today, tomorrow, or coming up soon so you can plan ahead.',
  },
  {
    icon: '🎯',
    title: 'Priority Management',
    description: 'Set Low, Medium, or High priority on every task. Filter your board to focus on what matters most right now.',
  },
  {
    icon: '📊',
    title: 'Progress Tracking',
    description: 'Track project completion with a real-time progress bar. See how many tasks are done at a glance.',
  },
  {
    icon: '🔍',
    title: 'Instant Search',
    description: 'Find any task instantly with real-time search. No more scrolling through hundreds of cards.',
  },
  {
    icon: '👤',
    title: 'Secure Authentication',
    description: 'Your data is safe with JWT authentication and bcrypt password hashing. Only you can access your projects.',
  },
];

const steps = [
  { step: '01', title: 'Create an Account', description: 'Sign up for free in seconds. No credit card required.' },
  { step: '02', title: 'Create a Project', description: 'Organize your work into projects. Each project gets its own Kanban board.' },
  { step: '03', title: 'Add Tasks', description: 'Add tasks with title, description, priority and due date.' },
  { step: '04', title: 'Track Progress', description: 'Drag tasks across columns and watch your progress bar grow!' },
];

const LandingPage = () => {
    const { isAuthenticated } = useSelector((state) => state.auth);
const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-50">
        <h1 className="text-xl font-bold text-emerald-600">Taskora</h1>
        <div className="flex items-center gap-3">
  {isAuthenticated ? (
    <button
      onClick={() => navigate('/dashboard')}
      className="px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition shadow-sm"
    >
      Go to Dashboard →
    </button>
  ) : (
    <>
      <Link
        to="/login"
        className="px-4 py-2 text-sm text-gray-600 font-medium hover:text-emerald-600 transition"
      >
        Sign In
      </Link>
      <Link
        to="/register"
        className="px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition shadow-sm"
      >
        Get Started Free
      </Link>
    </>
  )}
</div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 text-center bg-gradient-to-b from-emerald-50 to-white">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full mb-6 uppercase tracking-wider">
            Full-Stack Task Management
          </span>
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            Manage your tasks with
            <span className="text-emerald-600"> clarity and focus</span>
          </h1>
          <p className="text-lg text-gray-500 mb-10 max-w-xl mx-auto leading-relaxed">
            Taskora helps you organize projects, track deadlines, and get things done — with a beautiful Kanban board, smart notifications, and real-time progress tracking.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
  {isAuthenticated ? (
    <button
      onClick={() => navigate('/dashboard')}
      className="px-8 py-3.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition shadow-lg text-sm"
    >
      Go to Dashboard →
    </button>
  ) : (
    <>
      <Link
        to="/register"
        className="px-8 py-3.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition shadow-lg text-sm"
      >
        Start for Free →
      </Link>
      <Link
        to="/login"
        className="px-8 py-3.5 bg-white text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition border border-gray-200 text-sm"
      >
        Sign In
      </Link>
    </>
  )}
</div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need to stay productive
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Taskora combines powerful features with a clean interface so you can focus on what matters — getting things done.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl border border-gray-100 hover:border-emerald-200 hover:shadow-md transition group"
              >
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:bg-emerald-100 transition">
                  {feature.icon}
                </div>
                <h3 className="text-base font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Get started in minutes
            </h2>
            <p className="text-gray-500">
              No complicated setup. Just sign up and start managing your tasks right away.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-full">
                  <span className="text-3xl font-extrabold text-emerald-100">
                    {step.step}
                  </span>
                  <h3 className="text-sm font-bold text-gray-800 mt-2 mb-2">{step.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-gray-300 text-xl z-10">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-emerald-600">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to get organized?
          </h2>
          <p className="text-emerald-100 mb-8 text-sm">
            Join Taskora today and take control of your projects and deadlines.
          </p>
          {isAuthenticated ? (
  <button
    onClick={() => navigate('/dashboard')}
    className="inline-block px-8 py-3.5 bg-white text-emerald-600 font-bold rounded-xl hover:bg-emerald-50 transition shadow-lg text-sm"
  >
    Go to Dashboard →
  </button>
) : (
  <Link
    to="/register"
    className="inline-block px-8 py-3.5 bg-white text-emerald-600 font-bold rounded-xl hover:bg-emerald-50 transition shadow-lg text-sm"
  >
    Create Free Account →
  </Link>
)}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-100 text-center">
        <p className="text-sm text-gray-400">
          © 2026 <span className="font-semibold text-emerald-600">Taskora</span>. Built with React, Node.js, and MongoDB.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;