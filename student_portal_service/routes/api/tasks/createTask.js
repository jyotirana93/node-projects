const express = require('express');
const router = express.Router();
const createTask = require('../../../controllers/pendingTaskController/createTaskController');

router.post('/', createTask.handleAddTask);

module.exports = router;
