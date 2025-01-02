const express = require('express');
const router = express.Router();
const getAllTasks = require('../../../controllers/pendingTaskController/readTasksController');

router.get('/', getAllTasks.handleGetTasks);

module.exports = router;
