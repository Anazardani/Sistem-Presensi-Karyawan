const express = require("express");
const router = express.Router();

const perizinanController =
require("../controllers/perizinanController");

router.post(
  "/",
  perizinanController.createPerizinan
);

router.get(
  "/:userId",
  perizinanController.getPerizinanUser
);

router.put(
  "/status/:id",
  perizinanController.updateStatus
);

module.exports = router;