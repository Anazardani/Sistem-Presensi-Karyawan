const db = require("../config/db");

exports.getProfile = (req, res) => {
  const { id } = req.params;

  db.query(
    `
    SELECT
      id,
      nama_lengkap,
      email,
      no_hp,
      username,
      posisi,
      role,
      nik,
      alamat,
      instansi,
      foto_profil
    FROM users
    WHERE id = ?
    `,
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      if (result.length === 0) {
        return res.status(404).json({
          message: "User tidak ditemukan",
        });
      }

      res.json(result[0]);
    }
  );
};

exports.updateProfile = (req, res) => {
  console.log("BODY DITERIMA:");
  console.log(req.body);

  const { id } = req.params;

  const {
    nama_lengkap,
    email,
    no_hp,
    username,
    posisi,
    nik,
    alamat,
    instansi,
  } = req.body;

  db.query(
    `
    UPDATE users
    SET
      nama_lengkap = ?,
      email = ?,
      no_hp = ?,
      username = ?,
      posisi = ?,
      nik = ?,
      alamat = ?,
      instansi = ?
    WHERE id = ?
    `,
    [
      nama_lengkap,
      email,
      no_hp,
      username,
      posisi,
      nik,
      alamat,
      instansi,
      id,
    ],
    (err) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        success: true,
        message: "Profil berhasil diupdate",
      });
    }
  );
};

exports.uploadFoto = (req, res) => {
  const { id } = req.params;

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "File tidak ditemukan",
    });
  }

  const foto = req.file.filename;

  db.query(
    `
    UPDATE users
    SET foto_profil = ?
    WHERE id = ?
    `,
    [foto, id],
    (err) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        success: true,
        url: `http://localhost:5000/uploads/${foto}`,
      });
    }
  );
};