const express = require('express');
const router = express.Router();
const deleteController = require('../../../controllers/pendingTaskController/deleteTaskController');

router.delete('/:taskId', deleteController.handleDeleteTask);

module.exports = router;
