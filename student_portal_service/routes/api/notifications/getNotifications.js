const express = require('express');
const router = express.Router();
const notificationController = require('../../../controllers/notificationController/readNotificationController');

router.get('/', notificationController.handleGetNotification);

module.exports = router;
