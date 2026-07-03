const express = require('express');
const router = express.Router();
const { getTasks, createTask, updateTask, updateTaskStatus, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

router.use(protect); // all routes below are protected

router.get('/project/:projectId', getTasks);
router.post('/project/:projectId', createTask);
router.put('/:id', updateTask);
router.patch('/:id/status', updateTaskStatus);
router.delete('/:id', deleteTask);

module.exports = router;