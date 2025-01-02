const express = require('express');
const router = express.Router();
const userPersonalInformation = require('../../../controllers/userManagementController/readUsersPersonalInformationController');
const verifyJwtToken = require('../../../middleware/verifyJwtToken');

router.get('/', userPersonalInformation.handleGetUserPersonalInformation);

module.exports = router;
