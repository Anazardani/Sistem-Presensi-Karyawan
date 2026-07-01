const db = require("../config/db");
const geolib = require("geolib");

exports.createAbsensi = (req, res) => {

  const {
    userId,
    jenis,
    latitude,
    longitude,
  } = req.body;

  if (!userId || !jenis || !latitude || !longitude) {
    return res.status(400).json({
      success: false,
      message: "Data absensi tidak lengkap.",
    });
  }

  // Ambil semua lokasi kantor yang aktif
  db.query(
    `
        SELECT *
        FROM lokasi_kantor
        WHERE status='Aktif'
        `,
    (err, lokasiKantor) => {

      if (err) {
        return res.status(500).json(err);
      }

      let lokasiValid = false;
      let namaKantor = "";

      for (const kantor of lokasiKantor) {

        const jarak = geolib.getDistance(
          {
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
          },
          {
            latitude: parseFloat(kantor.latitude),
            longitude: parseFloat(kantor.longitude),
          }
        );

        if (jarak <= kantor.radius) {
          lokasiValid = true;
          namaKantor = kantor.nama_lokasi;
          break;
        }
      }

      if (!lokasiValid) {
        return res.status(400).json({
          success: false,
          message: "Anda berada di luar area kantor.",
        });
      }

      // cek absensi hari ini
      db.query(
        `
                SELECT *
                FROM absensi
                WHERE user_id=?
                AND DATE(waktu)=CURDATE()
                ORDER BY waktu ASC
                `,
        [userId],
        (err, today) => {

          if (err) {
            return res.status(500).json(err);
          }

          if (jenis === "masuk") {

            const sudahMasuk =
              today.find(x => x.jenis === "masuk");

            if (sudahMasuk) {
              return res.status(400).json({
                success: false,
                message: "Anda sudah melakukan absen masuk hari ini.",
              });
            }

          }

          if (jenis === "keluar") {

            const masuk =
              today.find(x => x.jenis === "masuk");

            if (!masuk) {
              return res.status(400).json({
                success: false,
                message: "Silakan absen masuk terlebih dahulu.",
              });
            }

            const keluar =
              today.find(x => x.jenis === "keluar");

            if (keluar) {
              return res.status(400).json({
                success: false,
                message: "Anda sudah melakukan absen pulang.",
              });
            }

          }

          db.query(
            `
                        INSERT INTO absensi
                        (
                            user_id,
                            jenis,
                            latitude,
                            longitude
                        )
                        VALUES (?,?,?,?)
                        `,
            [
              userId,
              jenis,
              latitude,
              longitude,
            ],
            (err) => {

              if (err) {
                return res.status(500).json(err);
              }

              res.json({
                success: true,
                kantor: namaKantor,
                message: `Absensi ${jenis} berhasil.`,
              });

            }
          );

        }
      );

    }
  );

};

exports.getRiwayatHariIni = (req, res) => {

  const { userId } = req.params;

  db.query(
    `
    SELECT *
    FROM absensi
    WHERE user_id = ?
    AND DATE(waktu) = CURDATE()
    ORDER BY waktu DESC
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

exports.getDashboardStats = (req, res) => {

  const { userId } = req.params;

  const bulanIni = new Date().getMonth() + 1;
  const tahunIni = new Date().getFullYear();

  db.query(
    `
    SELECT
      COUNT(*) as totalRekap,
      SUM(
        CASE
          WHEN MONTH(waktu)=?
          AND YEAR(waktu)=?
          THEN 1
          ELSE 0
        END
      ) as totalBulan
    FROM absensi
    WHERE user_id=?
    `,
    [
      bulanIni,
      tahunIni,
      userId
    ],
    (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        totalAbsensiBulan:
          result[0].totalBulan || 0,

        totalRekapAbsensi:
          result[0].totalRekap || 0,

        totalAbsenTanpaAlasan: 0
      });
    }
  );
};

exports.getRekap = (req, res) => {

  const { userId } = req.params;

  db.query(
    `
    SELECT
      DATE(waktu) as tanggal,
      jenis,
      waktu,
      latitude,
      longitude
    FROM absensi
    WHERE user_id = ?
    ORDER BY waktu DESC
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