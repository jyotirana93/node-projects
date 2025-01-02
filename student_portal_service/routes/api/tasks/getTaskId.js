const express = require('express');
const router = express.Router();
const getTaskIdController = require('../../../controllers/pendingTaskController/readTaskIdController');

router.get('/:taskId', getTaskIdController.handleGetTaskId);

module.exports = router;
