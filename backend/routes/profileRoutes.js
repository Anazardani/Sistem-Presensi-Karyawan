const router = require("express").Router();

const upload = require("../middleware/upload");

const {
  getProfile,
  updateProfile,
  uploadFoto,
} = require("../controllers/profileController");

router.get("/:id", getProfile);

router.put("/:id", updateProfile);

router.post(
  "/upload/:id",
  upload.single("foto"),
  uploadFoto
);

module.exports = router;