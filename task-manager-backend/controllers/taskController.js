const Task = require('../models/Task');
const Project = require('../models/Project');

// GET all tasks for a project
const getTasks = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const tasks = await Task.find({ project: req.params.projectId, deleted: false })
      .populate('assignee', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// CREATE task
const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, assignee } = req.body;

    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      assignee,
      project: req.params.projectId,
      createdBy: req.user.id
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// UPDATE task
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// UPDATE task status only (for drag and drop)
const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.status = status;
    await task.save();

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// SOFT DELETE task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.deleted = true;
    task.deletedAt = new Date();
    await task.save();

    res.status(200).json({ message: 'Task deleted', taskId: task._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// RESTORE task
const restoreTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.deleted = false;
    task.deletedAt = null;
    await task.save();

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// PERMANENT DELETE task
const permanentDeleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Task permanently deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { 
  getTasks, 
  createTask, 
  updateTask, 
  updateTaskStatus, 
  deleteTask,
  restoreTask,
  permanentDeleteTask
};