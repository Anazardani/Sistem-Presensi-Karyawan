const express = require("express");
const router = express.Router();

const faceController =
  require("../controllers/faceController");

router.post(
  "/register",
  (req, res, next) => {
    console.log("ROUTE REGISTER TERPANGGIL");
    next();
  },
  faceController.registerFace
);

router.get(
  "/:id",
  faceController.getFace
);

module.exports = router;