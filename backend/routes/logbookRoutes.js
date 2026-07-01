const express = require("express");
const router = express.Router();

const logbookController =
require("../controllers/logbookController");

router.post(
  "/",
  logbookController.createLogbook
);

router.get(
  "/:userId",
  logbookController.getLogbook
);

router.delete(
  "/:id",
  logbookController.deleteLogbook
);

module.exports = router;