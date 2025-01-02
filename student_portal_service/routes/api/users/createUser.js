const express = require('express');
const router = express.Router();
const userPersonalInformation = require('../../../controllers/userManagementController/createUserPersonalInformationController');

router.post('/', userPersonalInformation.handleAddUserPersonalInformation);

module.exports = router;
