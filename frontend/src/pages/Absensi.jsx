import { API_URL } from "../config";
import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";
import Swal from "sweetalert2";

const MODEL_URL = "/models";

const C = {
  navy: "#2c4a8a",
  navyDark: "#243d72",
  blue: "#1e88e5",
  green: "#43a047",
  greenDark: "#388e3c",
  greenLight: "#a5d6a7",
  red: "#e53935",
  redDark: "#c62828",
  redLight: "#ef9a9a",
  text: "#1e2432",
  muted: "#6b7280",
  border: "#d8dde6",
  bg: "#f5f6fa",
};

const STATUS = {
  idle: { color: "#90a4ae", text: "Klik tombol Absen untuk memulai kamera" },
  loading: { color: "#fb8c00", text: "Memuat model AI..." },
  ready: { color: "#1e88e5", text: "Posisikan wajah di tengah frame" },
  detecting: { color: "#fb8c00", text: "Mendeteksi wajah..." },
  found: { color: "#43a047", text: "Wajah terdeteksi! Memverifikasi..." },
  success: { color: "#43a047", text: "Absensi berhasil!" },
  error: { color: "#e53935", text: "Wajah tidak terdeteksi, coba lagi" },
};

// Inline styles reusable
const card = {
  background: "white",
  borderRadius: 8,
  boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
};

export default function Absensi({ absenLog = [], setAbsenLog, user }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);
  const progressRef = useRef(0);
  const absenTypeRef = useRef(null);

  const [step, setStep] = useState("idle");
  const [modelsLoaded, setLoaded] = useState(false);
  const [absenType, setAbsenType] = useState(null);
  const [progressVal, setProgressVal] = useState(0);
  const [confidence, setConfidence] = useState(0);
  const [successTime, setSuccessTime] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [now, setNow] = useState(new Date());
  const [locationStatus, setLocationStatus] = useState("idle"); // idle | loading | found | error
  const [coords, setCoords] = useState(null);
  const [loadingAbsen, setLoadingAbsen] = useState(false);
  const [lokasiSekarang, setLokasiSekarang] = useState(null);
  const [cameraOpening, setCameraOpening] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        setLoaded(true);
      } catch {
        setLoaded(false);
      }
    })();
    return () => stopCamera();
  }, []);

  const startCamera = async (type) => {

    if (cameraOpening) return;

    setCameraOpening(true);

    setAbsenType(type);
    absenTypeRef.current = type;

    console.log("SET ABSEN:", type);

    handleLiveLocation();

    setStep("loading");
    progressRef.current = 0;
    setProgressVal(0);
    setConfidence(0);

    try {

      const stream =
        await navigator.mediaDevices.getUserMedia({

          video: {
            width: 640,
            height: 480,
            facingMode: "user"
          },

          audio: false

        });

      streamRef.current = stream;

      if (videoRef.current) {

        videoRef.current.srcObject = stream;

        await videoRef.current.play();

      }

      setStep("ready");

      if (!modelsLoaded) {

        Swal.fire({
          icon: "error",
          title: "Model AI",
          text: "Model Face Recognition belum dimuat."
        });

        stopCamera();

        return;

      }

      startRealDetection();

    } catch (err) {

      console.log(err);

      setStep("error");

      setTimeout(() => {

        setStep("idle");

      }, 2500);

    } finally {

      setCameraOpening(false);

    }

  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    setStep("idle");
    progressRef.current = 0;
    setProgressVal(0);
    setConfidence(0);
  };

  const startRealDetection = () => {
    intervalRef.current = setInterval(async () => {
      if (!videoRef.current || !canvasRef.current) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();
      const dims = faceapi.matchDimensions(canvas, video, true);
      const resized = faceapi.resizeResults(detections, dims);
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (resized.length > 0) {
        const det = resized[0];
        const box = det.detection.box;
        const score = Math.round(det.detection.score * 100);
        setConfidence(score);
        setStep("found");
        ctx.strokeStyle = "#43a047";
        ctx.lineWidth = 2.5;
        ctx.strokeRect(box.x, box.y, box.width, box.height);
        faceapi.draw.drawFaceLandmarks(canvas, [det]);
        progressRef.current = Math.min(progressRef.current + 12, 100);
        setProgressVal(progressRef.current);
        if (progressRef.current >= 100) {
          clearInterval(intervalRef.current);

          await verifyFace();

          return;
        }
      } else {
        setStep("ready");
        setConfidence(0);
        progressRef.current = Math.max(progressRef.current - 5, 0);
        setProgressVal(progressRef.current);
      }
    }, 250);
  };

  const getLocation = () => {

    return new Promise((resolve, reject) => {

      if (!navigator.geolocation) {

        reject(new Error("Browser tidak mendukung GPS"));

        return;

      }

      navigator.geolocation.getCurrentPosition(

        (position) => {

          resolve({

            lat: position.coords.latitude,

            lng: position.coords.longitude,

          });

        },

        (error) => {

          reject(error);

        },

        {

          enableHighAccuracy: true,

          timeout: 10000,

          maximumAge: 0,

        }

      );

    });

  };

  const verifyFace = async () => {
    try {
      setLoadingAbsen(true);
      const detection = await faceapi
        .detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        )
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        Swal.fire({
          icon: "warning",
          title: "Wajah tidak terdeteksi",
          text: "Silakan posisikan wajah di dalam frame kamera."
        });

        stopCamera();
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/face/${user.id}`
      );

      if (
        !response.data ||
        !response.data.face_descriptor
      ) {
        Swal.fire({
          icon: "error",
          title: "Face ID belum terdaftar",
          text: "Silakan daftarkan dahulu Face ID."
        });
        stopCamera();
        return;
      }

      const savedDescriptor =
        new Float32Array(
          JSON.parse(
            response.data.face_descriptor
          )
        );

      const distance =
        faceapi.euclideanDistance(
          detection.descriptor,
          savedDescriptor
        );

      console.log("Distance:", distance);

      if (distance >= 0.45) {
        Swal.fire({
          icon: "error",
          title: "Verifikasi gagal",
          text: "Face ID tidak cocok."
        });
        stopCamera();
        return;
      }

      const lokasi = await getLocation();

      setLokasiSekarang({
        latitude: lokasi.lat,
        longitude: lokasi.lng
      });

      const res = await axios.post(
        `${API_URL}/api/absensi`,
        {
          userId: user.id,
          jenis: absenTypeRef.current,
          latitude: lokasi.lat,
          longitude: lokasi.lng
        }
      );

      Swal.fire({

        icon: "success",

        title: "Absensi Berhasil",

        html: `
        ${res.data.message}
        <br><br>
        <b>${res.data.kantor}</b>
    `

      });

      await loadRiwayat();

      handleSuccess();

    } catch (err) {

      console.log(err);

      stopCamera();

      Swal.fire({

        icon: "error",

        title: "Absensi Gagal",

        text:
          err.response?.data?.message ||
          "Terjadi kesalahan"

      });

    } finally {

    setLoadingAbsen(false);

  }
};

const loadRiwayat = async () => {
  try {

    const response =
      await axios.get(
        `${API_URL}/api/absensi/riwayat/${user.id}`
      );

    const data =
      response.data.map(item => ({
        type: item.jenis,
        time: new Date(item.waktu)
          .toLocaleTimeString("id-ID"),
        date: new Date(item.waktu)
          .toLocaleDateString("id-ID")
      }));

    setAbsenLog(data);

  } catch (err) {

    console.log(err);

  }
};

useEffect(() => {

  if (user?.id) {
    loadRiwayat();
  }

}, [user]);

const handleSuccess = () => {

  const t =
    new Date().toLocaleTimeString(
      "id-ID",
      {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }
    );

  setSuccessTime(t);
  setStep("success");
  setProgressVal(100);

  setTimeout(() => {
    stopCamera();
  }, 3000);

};


useEffect(() => {

  setShowMap(true);

  handleLiveLocation();

}, []);

const handleLiveLocation = () => {

  setLocationStatus("loading");

  if (!navigator.geolocation) {

    setLocationStatus("error");

    Swal.fire({

      icon: "error",

      title: "GPS",

      text: "Browser tidak mendukung GPS"

    });

    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {

      const latitude =
        position.coords.latitude;

      const longitude =
        position.coords.longitude;

      setCoords({
        lat: latitude,
        lng: longitude
      });

      console.log(
        "Live Location:",
        latitude,
        longitude
      );

      setLocationStatus("found");
    },
    (err) => {

      console.log(err);

      setLocationStatus("error");
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
};

const cfg = STATUS[step] || STATUS.idle;
const alreadyMasuk = absenLog.some(l => l.type === "masuk");
const alreadyKeluar = absenLog.some(l => l.type === "keluar");

return (
  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

    {/* ── Title bar ── */}
    <div className="absensi-titlebar" style={{
      ...card,
      padding: "14px 22px",
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 8,
    }}>
      <h2 style={{ margin: 0, fontSize: 16, color: C.navy, fontWeight: 700 }}>Absensi</h2>
      <div style={{ fontSize: 12, color: C.muted, fontVariantNumeric: "tabular-nums" }}>
        {now.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        {" · "}
        <strong style={{ color: C.navy }}>
          {now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
        </strong>
      </div>
    </div>

    {/* ── Camera + Map row ── */}
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr auto",
      gap: 16,
      alignItems: "stretch",
    }}
      className="absensi-cam-row"
    >

      {/* Live Camera */}
      <div style={{
        background: "#1a1a1a",
        borderRadius: 10,
        aspectRatio: "4/3",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
        border: step === "success"
          ? "2px solid #43a047"
          : step === "error"
            ? "2px solid #e53935"
            : "2px solid transparent",
        minHeight: 200,
      }}>
        {/* Video feed */}
        <video
          ref={videoRef}
          autoPlay muted playsInline
          style={{
            width: "100%", height: "100%",
            objectFit: "cover",
            transform: "scaleX(-1)",
            display: step === "idle" ? "none" : "block",
          }}
        />

        {/* Face landmark canvas */}
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute", top: 0, left: 0,
            width: "100%", height: "100%",
            transform: "scaleX(-1)",
            pointerEvents: "none",
            display: step === "idle" || step === "success" ? "none" : "block",
          }}
        />

        {/* Idle placeholder */}
        {step === "idle" && (
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 10,
            color: "rgba(255,255,255,0.65)",
          }}>
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="6" width="20" height="14" rx="2" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
              <circle cx="12" cy="13" r="4" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
              <path d="M9 6l1.5-2h3L15 6" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 0.3 }}>Live Camera</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", maxWidth: 180, textAlign: "center", lineHeight: 1.5 }}>
              Tekan tombol Absen Masuk / Pulang untuk mulai scan wajah
            </div>
          </div>
        )}

        {/* Success overlay */}
        {step === "success" && (
          <div style={{
            position: "absolute", inset: 0,
            background: "rgba(27,94,32,0.92)",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 12,
          }}>
            <div style={{
              width: 60, height: 60, borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                <polyline points="20 6 9 17 4 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div style={{ color: "white", fontWeight: 800, fontSize: 17 }}>Absensi Berhasil!</div>
            <div style={{
              background: "rgba(255,255,255,0.18)",
              borderRadius: 6, padding: "5px 18px",
              color: "rgba(255,255,255,0.9)", fontSize: 12, fontWeight: 600,
            }}>
              {absenType === "masuk" ? "Absen Masuk" : "Absen Pulang"} · {successTime}
            </div>
          </div>
        )}

        {/* Confidence badge */}
        {(step === "found" || step === "detecting") && confidence > 0 && (
          <div style={{
            position: "absolute", top: 10, right: 10,
            background: "rgba(0,0,0,0.68)",
            borderRadius: 5, padding: "3px 10px",
            color: "#76ff03", fontSize: 11, fontWeight: 700,
          }}>
            {confidence}% match
          </div>
        )}

        {/* Cancel button */}
        {step !== "idle" && step !== "success" && (
          <button
            onClick={stopCamera}
            style={{
              position: "absolute", top: 10, left: 10,
              background: "#e53935", color: "white",
              border: "none", borderRadius: 5,
              padding: "5px 12px",
              fontSize: 11, fontWeight: 700, cursor: "pointer",
            }}
          >
            ✕ Batal
          </button>
        )}

        {/* Bottom HUD (progress bar) */}
        {step !== "idle" && step !== "success" && (
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            background: "rgba(0,0,0,0.72)",
            padding: "8px 14px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 11, color: cfg.color, fontWeight: 600 }}>{cfg.text}</span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.55)" }}>{progressVal}%</span>
            </div>
            <div style={{ height: 4, background: "rgba(255,255,255,0.12)", borderRadius: 3 }}>
              <div style={{
                height: "100%",
                background: cfg.color,
                width: `${progressVal}%`,
                borderRadius: 3,
                transition: "width 0.25s",
              }} />
            </div>
          </div>
        )}
      </div>

      {/* Map panel */}
      <div style={{
        width: 280,
        borderRadius: 10,
        background: "#e8f0f7",
        overflow: "hidden",
        position: "relative",
        aspectRatio: "4/3",
        boxShadow: "0 4px 14px rgba(0,0,0,0.10)",
        minHeight: 200,
        flexShrink: 0,
      }}>
        {showMap && locationStatus === "found" && coords ? (
          /* Real iframe map when coords available */
          <iframe
            title="Lokasi Kamu"
            width="100%"
            height="100%"
            style={{ border: 0, display: "block" }}
            loading="lazy"
            src={`https://maps.google.com/maps?q=${coords.lat},${coords.lng}&z=16&output=embed`}
            allowFullScreen
          />
        ) : (
          /* Illustrated map */
          <svg width="100%" height="100%" viewBox="0 0 280 210" preserveAspectRatio="xMidYMid slice" style={{ display: "block" }}>
            <rect width="280" height="210" fill="#eef2f7" />
            {/* Road grid */}
            <path d="M0 70 Q140 60 280 85" stroke="#cfd8dc" strokeWidth="14" fill="none" />
            <path d="M0 140 Q140 135 280 145" stroke="#cfd8dc" strokeWidth="10" fill="none" />
            <path d="M100 0 Q95 105 90 210" stroke="#cfd8dc" strokeWidth="12" fill="none" />
            <path d="M200 0 Q205 105 210 210" stroke="#cfd8dc" strokeWidth="8" fill="none" />
            {/* Road center lines */}
            <path d="M0 70 Q140 60 280 85" stroke="white" strokeWidth="1.5" fill="none" strokeDasharray="8 6" opacity="0.8" />
            <path d="M100 0 Q95 105 90 210" stroke="white" strokeWidth="1.5" fill="none" strokeDasharray="8 6" opacity="0.8" />
            {/* Buildings */}
            <rect x="15" y="12" width="58" height="36" rx="2" fill="#dde4eb" />
            <rect x="130" y="18" width="48" height="32" rx="2" fill="#dde4eb" />
            <rect x="225" y="12" width="42" height="44" rx="2" fill="#dde4eb" />
            <rect x="15" y="165" width="50" height="36" rx="2" fill="#dde4eb" />
            <rect x="175" y="160" width="56" height="38" rx="2" fill="#dde4eb" />
            <rect x="242" y="160" width="30" height="38" rx="2" fill="#dde4eb" />
            {/* Park */}
            <rect x="115" y="98" width="50" height="24" rx="3" fill="#c8e6c9" />
            <text x="140" y="115" textAnchor="middle" fontSize="7" fill="#558b2f" fontWeight="700">PARK</text>
            {/* Location pin */}
            <g transform="translate(140 95)">
              <circle r="24" fill="#e53935" opacity="0.12" />
              <circle r="15" fill="#e53935" opacity="0.22" />
              <path d="M0 -13 C-7 -13 -11 -7.5 -11 -2 C-11 6 0 14 0 14 C0 14 11 6 11 -2 C11 -7.5 7 -13 0 -13 Z" fill="#e53935" />
              <circle r="4.5" cy="-3" fill="white" />
            </g>
          </svg>
        )}

        {/* Map overlays */}
        <div style={{
          position: "absolute", top: 8, left: 8,
          background: "rgba(255,255,255,0.95)",
          padding: "4px 10px", borderRadius: 5,
          fontSize: 10, color: C.navy, fontWeight: 700,
          boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
        }}>
          📍 Lokasi Anda
        </div>

        {locationStatus === "loading" && (
          <div style={{
            position: "absolute", inset: 0,
            background: "rgba(255,255,255,0.7)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexDirection: "column", gap: 8,
            fontSize: 12, color: C.navy, fontWeight: 600,
          }}>
            <div style={{
              width: 28, height: 28, border: `3px solid ${C.navy}`,
              borderTopColor: "transparent", borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }} />
            Mengambil lokasi...
          </div>
        )}

        {showMap && locationStatus === "found" && coords && (
          <div style={{
            position: "absolute", bottom: 8, left: 8, right: 8,
            background: "rgba(255,255,255,0.95)",
            padding: "7px 11px", borderRadius: 6,
            fontSize: 11, color: C.text, lineHeight: 1.4,
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
          }}>
            <div style={{ fontWeight: 700, color: C.green, fontSize: 11 }}>✓ Lokasi berhasil dideteksi</div>
            <div style={{ color: C.muted, fontSize: 10, marginTop: 2 }}>
              {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
            </div>
          </div>
        )}

        {showMap && locationStatus === "error" && (
          <div style={{
            position: "absolute", bottom: 8, left: 8, right: 8,
            background: "rgba(255,255,255,0.95)",
            padding: "7px 11px", borderRadius: 6,
            fontSize: 11, color: C.red, fontWeight: 600,
          }}>
            ⚠ Gagal mendapatkan lokasi. Izinkan akses GPS.
          </div>
        )}
      </div>
    </div>

    {/* ── Action Buttons Row ── exactly matching screenshot */}
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1.6fr",
      gap: 14,
    }}
      className="absensi-btn-row"
    >
      {/* Absen Masuk */}
      <button
        onClick={() => {
          if (!alreadyMasuk && step === "idle") {
            startCamera("masuk");
          }
        }}
        disabled={alreadyMasuk || step !== "idle" || loadingAbsen}
        style={{
          padding: "13px 10px",
          background: alreadyMasuk ? C.greenLight : C.green,
          color: "white",
          border: "none",
          borderRadius: 7,
          fontWeight: 700,
          fontSize: 14,
          cursor:
            alreadyMasuk || step !== "idle" || loadingAbsen
              ? "not-allowed"
              : "pointer",
          boxShadow: alreadyMasuk
            ? "none"
            : "0 3px 10px rgba(67,160,71,0.35)",
          opacity: alreadyMasuk ? 0.75 : 1,
          transition: "all .2s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 7,
        }}
      >
        {loadingAbsen
          ? "Memproses..."
          : alreadyMasuk
            ? (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <polyline
                    points="20 6 9 17 4 12"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Absen Masuk
              </>
            )
            : "Absen Masuk"}
      </button>

      {/* Absen Pulang */}
      <button
        onClick={() => {
          if (!alreadyKeluar && step === "idle") {
            startCamera("keluar");
          }
        }}
        disabled={alreadyKeluar || step !== "idle" || loadingAbsen}
        style={{
          padding: "13px 10px",
          background: alreadyKeluar ? C.redLight : C.red,
          color: "white",
          border: "none",
          borderRadius: 7,
          fontWeight: 700,
          fontSize: 14,
          cursor:
            alreadyKeluar || step !== "idle" || loadingAbsen
              ? "not-allowed"
              : "pointer",
          boxShadow: alreadyKeluar
            ? "none"
            : "0 3px 10px rgba(229,57,53,0.35)",
          opacity: alreadyKeluar ? 0.75 : 1,
          transition: "all .2s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 7,
        }}
      >
        {loadingAbsen
          ? "Memproses..."
          : alreadyKeluar
            ? (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <polyline
                    points="20 6 9 17 4 12"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Absen Pulang
              </>
            )
            : "Absen Pulang"}
      </button>

      {
        lokasiSekarang && (

          <div
            style={{
              marginTop: 20,
              padding: 15,
              borderRadius: 12,
              background: "#eef5ff",
              border: "1px solid #d6e6ff"
            }}
          >

            <b>📍 Lokasi GPS</b>

            <br /><br />

            Latitude :
            <br />
            {lokasiSekarang.latitude}

            <br /><br />

            Longitude :
            <br />
            {lokasiSekarang.longitude}

          </div>

        )
      }

      {/* Live Location */}
      <button
        onClick={() => {

          if (showMap) {

            setShowMap(false);

          } else {

            setShowMap(true);

            handleLiveLocation();

          }

        }}
        style={{
          padding: "13px 10px",
          background: showMap
            ? C.navyDark
            : "#3b6cd1",
          color: "white",
          border: "none",
          borderRadius: 7,
          fontWeight: 700,
          fontSize: 14,
          cursor: "pointer",
          boxShadow:
            "0 3px 10px rgba(59,108,209,0.35)",
          transition: "background 0.15s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 7,
        }}
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            cx="12"
            cy="12"
            r="3"
            stroke="white"
            strokeWidth="2"
          />
          <path
            d="M12 2v3M12 19v3M2 12h3M19 12h3"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        {
          showMap
            ? "Sembunyikan Lokasi"
            : "Live Location"
        }
      </button>
    </div>

    {/* ── Riwayat hari ini ── */}
    <div className="absensi-history" style={{ ...card, padding: "16px 22px" }}>
      <div style={{ fontWeight: 700, fontSize: 13, color: C.navy, marginBottom: 12 }}>
        Riwayat Absensi Hari Ini
      </div>
      {absenLog.length === 0 ? (
        <div style={{
          fontSize: 12, color: C.muted, textAlign: "center",
          padding: "18px 0",
          border: `1px dashed ${C.border}`, borderRadius: 6,
        }}>
          Belum ada riwayat absensi hari ini
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {absenLog.map((log, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "10px 14px", borderRadius: 7,
              background: log.type === "masuk" ? "#e8f5e9" : "#ffebee",
              border: `1px solid ${log.type === "masuk" ? "#c8e6c9" : "#ffcdd2"}`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: "50%",
                  background: log.type === "masuk" ? C.green : C.red,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    {log.type === "masuk"
                      ? <polyline points="20 6 9 17 4 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      : <><line x1="18" y1="6" x2="6" y2="18" stroke="white" strokeWidth="2.5" strokeLinecap="round" /><line x1="6" y1="6" x2="18" y2="18" stroke="white" strokeWidth="2.5" strokeLinecap="round" /></>
                    }
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: log.type === "masuk" ? "#2e7d32" : "#c62828" }}>
                    {log.type === "masuk" ? "Absen Masuk" : "Absen Pulang"}
                  </div>
                  <div style={{ fontSize: 10, color: C.muted, marginTop: 1 }}>{log.date}</div>
                </div>
              </div>
              <div style={{
                fontSize: 13, fontWeight: 800,
                color: C.text,
                fontVariantNumeric: "tabular-nums",
                background: "rgba(255,255,255,0.7)",
                padding: "4px 10px", borderRadius: 5,
              }}>
                {log.time}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

    {/* Warning jika model AI tidak tersedia */}
    {!modelsLoaded && (
      <div style={{
        background: "#fff8e1",
        border: "1px solid #ffe082",
        borderRadius: 7,
        padding: "10px 16px",
        fontSize: 11, color: "#bf360c",
        lineHeight: 1.5,
      }}>
        ⚠ Model AI tidak ditemukan — berjalan dalam <strong>mode simulasi</strong>.
        Letakkan file model face-api.js di folder <code style={{ background: "#ffcc02", padding: "1px 4px", borderRadius: 3 }}>/public/models/</code>.
      </div>
    )}

    {/* Responsive styles */}
    <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Default: camera full width, map as fixed column */
        .absensi-cam-row {
          grid-template-columns: 1fr 280px;
        }

        /* Buttons: 3 column */
        .absensi-btn-row {
          grid-template-columns: 1fr 1fr 1.6fr;
        }

        /* Tablet (≤ 900px): stack map below camera */
        @media (max-width: 900px) {
          .absensi-cam-row {
            grid-template-columns: 1fr !important;
          }
          .absensi-cam-row > div:nth-child(2) {
            width: 100% !important;
            aspect-ratio: 16/6 !important;
          }
        }

        /* Mobile (≤ 600px): buttons go 1 column */
        @media (max-width: 600px) {
          .absensi-btn-row {
            grid-template-columns: 1fr !important;
          }
          .absensi-btn-row button {
            width: 100%;
          }
        }

        /* Button hover effects */
        button:not(:disabled):hover {
          filter: brightness(1.06);
          transform: translateY(-1px);
        }
        button:not(:disabled):active {
          filter: brightness(0.96);
          transform: translateY(0);
        }
      `}</style>
  </div>
);
}