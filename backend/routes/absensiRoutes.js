const express = require("express");
const router = express.Router();

const absensiController =
require("../controllers/absensiController");

router.post(
  "/",
  absensiController.createAbsensi
);

router.get(
  "/riwayat/:userId",
  absensiController.getRiwayatHariIni
);

router.get(
  "/stats/:userId",
  absensiController.getDashboardStats
);

router.get(
  "/rekap/:userId",
  absensiController.getRekap
);
module.exports = router;