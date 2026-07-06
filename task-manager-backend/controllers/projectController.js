const Project = require('../models/Project');

// GET all projects for logged in user
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ 
      owner: req.user.id,
      deleted: false  // add this line
    }).sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET single project
const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members', 'name email');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Make sure only owner can access
    if (project.owner._id.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// CREATE project
const createProject = async (req, res) => {
  try {
    const { title, description } = req.body;

    const project = await Project.create({
      title,
      description,
      owner: req.user.id
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// UPDATE project
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// SOFT DELETE project
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    if (project.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    project.deleted = true;
    project.deletedAt = new Date();
    await project.save();

    res.status(200).json({ message: 'Project deleted', projectId: project._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// RESTORE project
const restoreProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.deleted = false;
    project.deletedAt = null;
    await project.save();

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// PERMANENT DELETE project
const permanentDeleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Project permanently deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { 
  getProjects, 
  getProject, 
  createProject, 
  updateProject, 
  deleteProject,
  restoreProject,
  permanentDeleteProject
};