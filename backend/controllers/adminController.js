const db = require("../config/db");

exports.getDashboard = async (req, res) => {
  try {

    db.query(
      `
      SELECT COUNT(*) AS totalUser
      FROM users
      `,
      (err1, userResult) => {

        if (err1) {
          return res.status(500).json(err1);
        }

        db.query(
          `
          SELECT COUNT(*) AS totalAbsensi
          FROM absensi
          `,
          (err2, absensiResult) => {

            if (err2) {
              return res.status(500).json(err2);
            }

            db.query(
              `
              SELECT COUNT(*) AS totalLogbook
              FROM logbook
              `,
              (err3, logbookResult) => {

                if (err3) {
                  return res.status(500).json(err3);
                }

                db.query(
                  `
                  SELECT COUNT(*) AS totalPerizinan
                  FROM perizinan
                  `,
                  (err4, izinResult) => {

                    if (err4) {
                      return res.status(500).json(err4);
                    }

                    res.json({
                      totalUser:
                        userResult[0].totalUser,

                      totalAbsensi:
                        absensiResult[0].totalAbsensi,

                      totalLogbook:
                        logbookResult[0].totalLogbook,

                      totalPerizinan:
                        izinResult[0].totalPerizinan,
                    });

                  }
                );

              }
            );

          }
        );

      }
    );

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

exports.getUsers = (req, res) => {

  db.query(
    `
    SELECT
      id,
      nama_lengkap,
      email,
      no_hp,
      posisi,
      instansi,
      role
    FROM users
    ORDER BY id DESC
    `,
    (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.json(result);

    }
  );

};

exports.getPerizinan = (req, res) => {

  db.query(
    `
    SELECT
      p.*,
      u.nama_lengkap
    FROM perizinan p
    JOIN users u
      ON p.user_id = u.id
    ORDER BY p.id DESC
    `,
    (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.json(result);

    }
  );

};

exports.updateStatusPerizinan = (req, res) => {

  const { id } = req.params;
  const { status } = req.body;

  db.query(
    `
    UPDATE perizinan
    SET status = ?
    WHERE id = ?
    `,
    [status, id],
    (err) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        success: true,
        message: "Status berhasil diubah",
      });

    }
  );

};

exports.getAbsensi = (req, res) => {

    const sql = `

    SELECT

        u.id,

        u.nama_lengkap,

        u.instansi,

        u.posisi,

        DATE(CURDATE()) AS tanggal,

        TIME(masuk.waktu) AS jam_masuk,

        TIME(keluar.waktu) AS jam_pulang,

        masuk.latitude,

        masuk.longitude,

        CASE

            WHEN masuk.id IS NULL THEN 'Belum Hadir'

            WHEN masuk.id IS NOT NULL
                 AND keluar.id IS NULL
            THEN 'Sedang Bekerja'

            WHEN masuk.id IS NOT NULL
                 AND keluar.id IS NOT NULL
            THEN 'Hadir'

        END AS status

    FROM users u

    LEFT JOIN absensi masuk

        ON masuk.user_id = u.id

        AND masuk.jenis='masuk'

        AND DATE(masuk.waktu)=CURDATE()

    LEFT JOIN absensi keluar

        ON keluar.user_id = u.id

        AND keluar.jenis='keluar'

        AND DATE(keluar.waktu)=CURDATE()

    ORDER BY u.nama_lengkap ASC

    `;

    db.query(sql,(err,result)=>{

        if(err){

            return res.status(500).json(err);

        }

        res.json(result);

    });

};

exports.getAbsensiStatistik=(req,res)=>{

    db.query(
    `
    SELECT

    COUNT(*) total,

    SUM(jenis='masuk') masuk,

    SUM(jenis='keluar') keluar

    FROM absensi
    `,
    (err,result)=>{

        if(err){

            return res.status(500).json(err);

        }

        res.json(result[0]);

    });

}

exports.getLogbook = (req, res) => {

  db.query(
    `
    SELECT
      id,
      user_id,
      nama,
      email,
      hari_tanggal,
      jam_pengajuan,
      pekerjaan,
      output_hasil,
      lokasi_file,
      created_at
    FROM logbook
    ORDER BY hari_tanggal DESC,
             jam_pengajuan DESC
    `,
    (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.json(result);

    }
  );

};

exports.getLogbookStatistik = (req, res) => {

  db.query(
    `
    SELECT

      COUNT(*) total,

      SUM(
        DATE(hari_tanggal)=CURDATE()
      ) hariIni,

      SUM(
        WEEK(hari_tanggal)=WEEK(CURDATE())
      ) mingguIni,

      SUM(
        MONTH(hari_tanggal)=MONTH(CURDATE())
      ) bulanIni

    FROM logbook
    `,
    (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.json(result[0]);

    }
  );

};

exports.getLokasi = (req, res) => {

    db.query(
        `
        SELECT *
        FROM lokasi_kantor
        ORDER BY id DESC
        `,
        (err, result) => {

            if (err)
                return res.status(500).json(err);

            res.json(result);

        }
    );

};

exports.tambahLokasi = (req, res) => {

    const {
        nama_lokasi,
        alamat,
        latitude,
        longitude,
        radius
    } = req.body;

    db.query(
        `
        INSERT INTO lokasi_kantor
        (
            nama_lokasi,
            alamat,
            latitude,
            longitude,
            radius
        )
        VALUES(?,?,?,?,?)
        `,
        [
            nama_lokasi,
            alamat,
            latitude,
            longitude,
            radius
        ],
        (err) => {

            if (err)
                return res.status(500).json(err);

            res.json({
                success: true
            });

        }
    );

};

exports.updateLokasi = (req, res) => {

    const { id } = req.params;

    const {
        nama_lokasi,
        alamat,
        latitude,
        longitude,
        radius,
        status
    } = req.body;

    db.query(
        `
        UPDATE lokasi_kantor
        SET
        nama_lokasi=?,
        alamat=?,
        latitude=?,
        longitude=?,
        radius=?,
        status=?
        WHERE id=?
        `,
        [
            nama_lokasi,
            alamat,
            latitude,
            longitude,
            radius,
            status,
            id
        ],
        (err) => {

            if (err)
                return res.status(500).json(err);

            res.json({
                success: true
            });

        }
    );

};

exports.deleteLokasi = (req, res) => {

    db.query(
        `
        DELETE FROM lokasi_kantor
        WHERE id=?
        `,
        [req.params.id],
        (err) => {

            if (err)
                return res.status(500).json(err);

            res.json({
                success: true
            });

        }
    );

};