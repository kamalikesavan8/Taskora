import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    isCreateTaskModalOpen: false,
    isEditTaskModalOpen: false,
    selectedTask: null,
    selectedProject: null,
    filterPriority: 'all',
    searchQuery: '',
    darkMode: localStorage.getItem('darkMode') === 'true',
  },
  reducers: {
    openCreateTaskModal: (state) => {
      state.isCreateTaskModalOpen = true;
    },
    closeCreateTaskModal: (state) => {
      state.isCreateTaskModalOpen = false;
    },
    openEditTaskModal: (state, action) => {
      state.isEditTaskModalOpen = true;
      state.selectedTask = action.payload;
    },
    closeEditTaskModal: (state) => {
      state.isEditTaskModalOpen = false;
      state.selectedTask = null;
    },
    setSelectedProject: (state, action) => {
      state.selectedProject = action.payload;
    },
    setFilterPriority: (state, action) => {
      state.filterPriority = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('darkMode', state.darkMode);
    },
  },
});

export const {
  openCreateTaskModal,
  closeCreateTaskModal,
  openEditTaskModal,
  closeEditTaskModal,
  setSelectedProject,
  setFilterPriority,
  setSearchQuery,
  toggleDarkMode,
} = uiSlice.actions;

export default uiSlice.reducer;