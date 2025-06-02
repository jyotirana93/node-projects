const express = require('express');
const router = express.Router();
const pagesController = require('../controllers/pagesController');
const {
  HOME_ROUTE,
  SUBDIR_INDEX_ROUTE,
  NEW_PAGE_ROUTE,
  OLD_PAGE_ROUTE,
} = require('../constants');

router.get(HOME_ROUTE, pagesController.getRootIndexHtmlPage);

router.get(SUBDIR_INDEX_ROUTE, pagesController.getSubdirIndexHtmlPage);

router.get(NEW_PAGE_ROUTE, pagesController.getNewPage);

router.get(OLD_PAGE_ROUTE, pagesController.getNewPageRedirectOnOldPage);

module.exports = router;
