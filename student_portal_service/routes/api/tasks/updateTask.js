const express = require('express');
const router = express.Router();
const updateTaskController = require('../../../controllers/pendingTaskController/updateTaskController');

router.put('/:taskId', updateTaskController.handleUpdateTask);

module.exports = router;
