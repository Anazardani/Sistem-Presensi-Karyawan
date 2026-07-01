const db = require("../config/db");

exports.createLogbook = (req, res) => {

  const {
    userId,
    nama,
    email,
    entries
  } = req.body;

  if (!entries || entries.length === 0) {
    return res.status(400).json({
      message: "Data logbook kosong"
    });
  }

  const values = entries.map(item => [
    userId,
    nama,
    email,
    item.hariTanggal,
    item.jamPengajuan,
    item.pekerjaan,
    item.output,
    item.lokasiFile
  ]);

  db.query(
    `
    INSERT INTO logbook
    (
      user_id,
      nama,
      email,
      hari_tanggal,
      jam_pengajuan,
      pekerjaan,
      output_hasil,
      lokasi_file
    )
    VALUES ?
    `,
    [values],
    (err, result) => {

      if (err) {
        console.log(err);

        return res.status(500).json(err);
      }

      res.json({
        success: true,
        inserted: result.affectedRows
      });
    }
  );
};

exports.getLogbook = (req, res) => {

  const { userId } = req.params;

  db.query(
    `
    SELECT *
    FROM logbook
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

exports.deleteLogbook = (req, res) => {

  const { id } = req.params;

  db.query(
    `
    DELETE FROM logbook
    WHERE id = ?
    `,
    [id],
    (err, result) => {

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