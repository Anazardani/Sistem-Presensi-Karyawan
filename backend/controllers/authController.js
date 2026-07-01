const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const {
      nama,
      email,
      password,
      telp
    } = req.body;

    const hashedPassword =
      await bcrypt.hash(password, 10);

    db.query(
      `
      INSERT INTO users
      (
        nama_lengkap,
        email,
        password,
        no_hp
      )
      VALUES (?,?,?,?)
      `,
      [
        nama,
        email,
        hashedPassword,
        telp
      ],
      (err, result) => {

        if (err) {
          return res.status(400).json({
            success: false,
            error: err.sqlMessage
          });
        }

        res.json({
          success: true,
          message: "Register berhasil"
        });

      }
    );

  } catch (error) {
    res.status(500).json(error);
  }
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email=?",
    [email],
    async (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      if (result.length === 0) {
        return res.status(401).json({
          message: "Email tidak ditemukan",
        });
      }

      const user = result[0];

      const match = await bcrypt.compare(
        password,
        user.password
      );

      if (!match) {
        return res.status(401).json({
          message: "Password salah",
        });
      }

      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      res.json({
        token,
        user,
      });
    }
  );
};