const express = require('express');
const router = express.Router();
const readUsersPersonalInformationController = require('../../../controllers/userManagementController/readUserIdPersonalInformationController');

router.get(
  '/:userId',
  readUsersPersonalInformationController.handleGetUserIdPersonalInformation
);

module.exports = router;
