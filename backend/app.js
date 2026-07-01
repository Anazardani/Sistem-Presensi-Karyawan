require("dotenv").config();
require("./config/db");

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const faceRoutes = require("./routes/faceRoutes");
const absensiRoutes = require("./routes/absensiRoutes");
const logbookRoutes = require("./routes/logbookRoutes");
const perizinanRoutes =require("./routes/perizinanRoutes");
const profileRoutes = require("./routes/profileRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.use("/api", authRoutes);
app.use("/api/face", faceRoutes);

app.use(
  "/api/profile",
  profileRoutes
);

app.use(
  "/api/absensi",
  absensiRoutes
);

app.use(
  "/api/logbook",
  logbookRoutes
);

app.use(
  "/api/perizinan",
  perizinanRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

app.get("/", (req, res) => {
  res.json({
    message: "Backend Presensi Berjalan"
  });
});

app.get("/tes", (req, res) => {
  res.json({
    status: "backend hidup"
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});