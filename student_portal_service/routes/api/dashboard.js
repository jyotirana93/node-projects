const express = require('express');
const router = express.Router();
const handleAdminDashboard = require('../../controllers/adminDashboardController');

router.get('/', handleAdminDashboard);

module.exports = router;
