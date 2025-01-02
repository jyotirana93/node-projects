const express = require('express');
const router = express.Router();
const handleUserAuth = require('../../controllers/userAuthController');

router.post('/', handleUserAuth);

module.exports = router;
