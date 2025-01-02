const express = require('express');
const router = express.Router();
const deleteUserPersonalInformationController = require('../../../controllers/userManagementController/deleteUserPersonalInformationController.js');

router.delete(
  '/:userId',
  deleteUserPersonalInformationController.handleDeleteUserPersonalInformation
);

module.exports = router;
