const express = require('express');
const router = express.Router();
const handleUserLogout = require('../../controllers/userLogoutController');

router.get('/', handleUserLogout);

module.exports = router;
