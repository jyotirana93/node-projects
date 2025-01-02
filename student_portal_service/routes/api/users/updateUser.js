const express = require('express');
const router = express.Router();
const updateUserPersonalInfomation = require('../../../controllers/userManagementController/updateUserPersonalInformationController');

router.put(
  '/:userId',
  updateUserPersonalInfomation.handleUpdateUserPersonalInformation
);

module.exports = router;
