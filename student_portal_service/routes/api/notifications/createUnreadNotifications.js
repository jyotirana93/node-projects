const express = require('express');
const router = express.Router();
const unReadNotificationController = require('../../../controllers/notificationController/unreadNotificationController');

router.post('/', unReadNotificationController.handleAddUnreadNotification);

module.exports = router;
