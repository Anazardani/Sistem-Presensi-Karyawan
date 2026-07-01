const router = require("express").Router();

const {
  getDashboard,
  getUsers,
  getPerizinan,
  updateStatusPerizinan,
  getAbsensi,
  getAbsensiStatistik,
  getLogbook,
  getLogbookStatistik,
  getLokasi,
  tambahLokasi,
  updateLokasi,
  deleteLokasi,
} = require("../controllers/adminController");

router.get("/dashboard", getDashboard);

router.get("/users", getUsers);

router.get("/perizinan", getPerizinan);

router.put("/perizinan/:id", updateStatusPerizinan);

router.get("/absensi", getAbsensi);

router.get("/absensi/statistik", getAbsensiStatistik);

router.get("/logbook", getLogbook);

router.get("/logbook/statistik", getLogbookStatistik);

router.get("/lokasi", getLokasi);

router.post("/lokasi", tambahLokasi);

router.put("/lokasi/:id", updateLokasi);

router.delete("/lokasi/:id", deleteLokasi);
module.exports = router;