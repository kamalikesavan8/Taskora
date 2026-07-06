const express = require('express');
const router = express.Router();
const { getTasks, createTask, updateTask, updateTaskStatus, deleteTask,restoreTask,permanentDeleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

router.use(protect); // all routes below are protected

router.get('/project/:projectId', getTasks);
router.post('/project/:projectId', createTask);
router.put('/:id', updateTask);
router.patch('/:id/status', updateTaskStatus);
router.delete('/:id', deleteTask);
router.patch('/:id/restore', restoreTask);
router.delete('/:id/permanent', permanentDeleteTask);

module.exports = router;