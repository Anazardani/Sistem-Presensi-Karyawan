const db = require("../config/db");

exports.registerFace = (req, res) => {
  console.log("========== REGISTER FACE ==========");
  console.log(req.body);

  const { userId, descriptor } = req.body;

  if (!userId) {
    return res.status(400).json({
      error: "userId kosong"
    });
  }

  if (!descriptor) {
    return res.status(400).json({
      error: "descriptor kosong"
    });
  }

  db.query(
    "UPDATE users SET face_descriptor=? WHERE id=?",
    [
      JSON.stringify(descriptor),
      userId
    ],
    (err, result) => {

      if (err) {
        console.log("MYSQL ERROR:");
        console.log(err);

        return res.status(500).json(err);
      }

      console.log("UPDATE RESULT:");
      console.log(result);

      res.json({
        success: true,
        affectedRows: result.affectedRows
      });
    }
  );
};

exports.getFace = (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT face_descriptor FROM users WHERE id=?",
    [id],
    (err, result) => {

      if (err) {
        console.log(err);

        return res.status(500).json({
          success: false,
          error: err
        });
      }

      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User tidak ditemukan"
        });
      }

      res.json(result[0]);
    }
  );
};