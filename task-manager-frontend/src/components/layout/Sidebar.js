import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetProjectsQuery, useCreateProjectMutation, useDeleteProjectMutation } from '../../features/projects/projectApiSlice';
import { setSelectedProject } from '../../features/ui/uiSlice';
import toast from 'react-hot-toast';

const Sidebar = () => {
  const dispatch = useDispatch();
  const { selectedProject } = useSelector((state) => state.ui);
  const { data: projects, isLoading } = useGetProjectsQuery();
  const [createProject] = useCreateProjectMutation();

  const [showForm, setShowForm] = useState(false);
  const [projectName, setProjectName] = useState('');

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!projectName.trim()) return;
    try {
      const newProject = await createProject({
        title: projectName,
        description: ''
      }).unwrap();
      dispatch(setSelectedProject(newProject));
      toast.success('Project created!');
      setProjectName('');
      setShowForm(false);
    } catch (error) {
      toast.error('Failed to create project');
    }
  };
  const [deleteProject] = useDeleteProjectMutation();

const handleDeleteProject = async (projectId) => {
  try {
    await deleteProject(projectId).unwrap();
    if (selectedProject?._id === projectId) {
      dispatch(setSelectedProject(null));
    }
    toast.success('Project deleted!');
  } catch {
    toast.error('Failed to delete project');
  }
};

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Projects
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition text-xl font-bold"
          >
          +
        </button>
      </div>

      {/* Create Project Form */}
      {showForm && (
        <form onSubmit={handleCreateProject} className="mb-4">
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Project name"
            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 mb-2"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 py-1.5 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-800 transition"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 py-1.5 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Projects List */}
      <div className="flex flex-col gap-1">
        {isLoading ? (
          <p className="text-sm text-gray-400">Loading...</p>
        ) : projects?.length === 0 ? (
          <p className="text-sm text-gray-400">No projects yet</p>
        ) : (
          projects?.map((project) => (
  <div
    key={project._id}
    className={`flex items-center justify-between rounded-lg text-sm transition group ${
      selectedProject?._id === project._id
  ? 'bg-emerald-600 text-white font-medium'
  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
    }`}
  >
    <button
      onClick={() => dispatch(setSelectedProject(project))}
      className="flex-1 text-left px-3 py-2.5"
    >
      📋 {project.title}
    </button>
    <button
      onClick={() => handleDeleteProject(project._id)}
      className={`opacity-0 group-hover:opacity-100 pr-3 transition text-lg leading-none ${
        selectedProject?._id === project._id
          ? 'text-white hover:text-red-200'
          : 'text-gray-400 hover:text-red-500'
      }`}
    >
      ×
    </button>
  </div>
))
        )}
      </div>
    </aside>
  );
};

export default Sidebar;