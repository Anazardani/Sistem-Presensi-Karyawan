const db = require("../config/db");

// =========================
// CREATE PERIZINAN
// =========================
exports.createPerizinan = (req, res) => {

  const {
    userId,
    nama,
    email,
    tanggalMulai,
    tanggalSelesai,
    keterangan
  } = req.body;

  db.query(
    `
    INSERT INTO perizinan
    (
      user_id,
      nama,
      email,
      tanggal_mulai,
      tanggal_selesai,
      keterangan
    )
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
      userId,
      nama,
      email,
      tanggalMulai,
      tanggalSelesai,
      keterangan
    ],
    (err, result) => {

      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }

      res.json({
        success: true,
        id: result.insertId
      });

    }
  );

};


// =========================
// GET RIWAYAT PER USER
// =========================
exports.getPerizinanUser = (req, res) => {

  const { userId } = req.params;

  db.query(
    `
    SELECT
      id,
      nama,
      email,
      tanggal_mulai,
      tanggal_selesai,
      keterangan,
      status,
      created_at
    FROM perizinan
    WHERE user_id = ?
    ORDER BY created_at DESC
    `,
    [userId],
    (err, result) => {

      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }

      res.json(result);

    }
  );

};


// =========================
// UPDATE STATUS
// =========================
exports.updateStatus = (req, res) => {

  const { id } = req.params;

  const {
    status
  } = req.body;

  db.query(
    `
    UPDATE perizinan
    SET status = ?
    WHERE id = ?
    `,
    [
      status,
      id
    ],
    (err) => {

      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }

      res.json({
        success: true
      });

    }
  );

};