import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useDeleteProjectMutation,
  useRestoreProjectMutation,
  usePermanentDeleteProjectMutation
} from '../../features/projects/projectApiSlice';
import { setSelectedProject } from '../../features/ui/uiSlice';
import toast from 'react-hot-toast';

const ProjectMenu = ({ project, onClose }) => {
  const dispatch = useDispatch();
  const { selectedProject } = useSelector((state) => state.ui);
  const [deleteProject] = useDeleteProjectMutation();
  const [restoreProject] = useRestoreProjectMutation();
  const [permanentDeleteProject] = usePermanentDeleteProjectMutation();

  const handleDeleteProject = async (e) => {
    e.stopPropagation();
    onClose();
    try {
      await deleteProject(project._id).unwrap();
      if (selectedProject?._id === project._id) {
        dispatch(setSelectedProject(null));
      }
      toast((t) => (
        <div className="flex items-center gap-3">
          <span className="text-sm">Project deleted</span>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              await restoreProject(project._id).unwrap();
              if (selectedProject?._id === project._id) {
                dispatch(setSelectedProject(project));
              }
              toast.success('Project restored!');
            }}
            className="px-3 py-1 bg-emerald-600 text-white text-xs rounded-lg font-medium"
          >
            Undo
          </button>
        </div>
      ), {
        duration: 5000,
        onClose: async () => {
          await permanentDeleteProject(project._id).unwrap();
        }
      });
    } catch {
      toast.error('Failed to delete project');
    }
  };

  return (
    <div className="absolute right-0 top-8 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden">
      {/* Project Info */}
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
        <p className="text-xs font-semibold text-gray-800 dark:text-white truncate">
          {project.title}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
          📅 Created {new Date(project.createdAt).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
          🕐 {new Date(project.createdAt).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>

      {/* Menu Items */}
      <div className="p-1.5">
        <button
          onClick={(e) => {
            e.stopPropagation();
            dispatch(setSelectedProject(project));
            onClose();
          }}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition text-left"
        >
          <span>📋</span>
          <span>Open Project</span>
        </button>

        <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>

        <button
          onClick={handleDeleteProject}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition text-left"
        >
          <span>🗑️</span>
          <span>Delete Project</span>
        </button>
      </div>
    </div>
  );
};

const Sidebar = () => {
  const dispatch = useDispatch();
  const { selectedProject } = useSelector((state) => state.ui);
  const { data: projects, isLoading } = useGetProjectsQuery();
  const [createProject] = useCreateProjectMutation();

  const [showForm, setShowForm] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    } catch {
      toast.error('Failed to create project');
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
              className="flex-1 py-1.5 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Projects List */}
      <div className="flex flex-col gap-1" ref={menuRef}>
        {isLoading ? (
          <p className="text-sm text-gray-400">Loading...</p>
        ) : projects?.length === 0 ? (
          <p className="text-sm text-gray-400">No projects yet</p>
        ) : (
          projects?.map((project) => (
            <div
              key={project._id}
              className={`group relative flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition cursor-pointer ${
                selectedProject?._id === project._id
                  ? 'bg-emerald-600 text-white font-medium'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => dispatch(setSelectedProject(project))}
            >
              <span className="truncate">📋 {project.title}</span>

              {/* Three dots button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenuId(openMenuId === project._id ? null : project._id);
                }}
                className={`opacity-0 group-hover:opacity-100 flex flex-col gap-0.5 p-1 rounded transition ml-1 ${
                  selectedProject?._id === project._id
                    ? 'hover:bg-emerald-500'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <div className={`w-1 h-1 rounded-full ${
                  selectedProject?._id === project._id ? 'bg-white' : 'bg-gray-500'
                }`}></div>
                <div className={`w-1 h-1 rounded-full ${
                  selectedProject?._id === project._id ? 'bg-white' : 'bg-gray-500'
                }`}></div>
                <div className={`w-1 h-1 rounded-full ${
                  selectedProject?._id === project._id ? 'bg-white' : 'bg-gray-500'
                }`}></div>
              </button>

              {/* Dropdown Menu */}
              {openMenuId === project._id && (
                <ProjectMenu
                  project={project}
                  onClose={() => setOpenMenuId(null)}
                />
              )}
            </div>
          ))
        )}
      </div>
    </aside>
  );
};

export default Sidebar;