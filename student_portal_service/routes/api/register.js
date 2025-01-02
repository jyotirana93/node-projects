const express = require('express');
const router = express.Router();
const handleUserRegister = require('../../controllers/userRegisterController');

router.post('/', handleUserRegister);

module.exports = router;
