const express = require('express');
const router = express.Router();
const { getProjects, getProject, createProject, updateProject, deleteProject,restoreProject,permanentDeleteProject } = require('../controllers/projectController');
const { protect } = require('../middleware/auth');

router.use(protect); // all routes below are protected

router.get('/', getProjects);
router.post('/', createProject);
router.get('/:id', getProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);
router.patch('/:id/restore', restoreProject);
router.delete('/:id/permanent', permanentDeleteProject);

module.exports = router;