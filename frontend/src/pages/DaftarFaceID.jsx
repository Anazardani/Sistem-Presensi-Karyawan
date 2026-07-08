import { API_URL } from "../config";
import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";

const C = { navy: "#2c4a8a", text: "#1e2432", muted: "#6b7280", border: "#d8dde6" };
const MODEL_URL = "/models";

export default function DaftarFaceID({ user }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [step, setStep] = useState("idle"); 
  const [savedFaces, setSavedFaces] = useState([]);
  const [modelsLoaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const init = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);

        setLoaded(true);

        if (user?.id) {
          await loadFace();
        }

      } catch (err) {
        console.error(err);
        setLoaded(false);
      }
    };

    init();

    return () => stopCamera();
  }, [user]);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
  };

  const loadFace = async () => {
    try {

      if (!user?.id) return;

      const response = await axios.get(
        `${API_URL}/api/face/${user.id}`
      );

      if (
        response.data &&
        response.data.face_descriptor
      ) {
        setSavedFaces([
          {
            id: user.id,
            label: "Face ID Aktif",
            dataUrl: null,
            descriptor: response.data.face_descriptor,
            time: "Tersimpan di database",
          }
        ]);
      } else {
        setSavedFaces([]);
      }

    } catch (err) {
      console.error("Gagal load Face ID:", err);
      setSavedFaces([]);
    }
  };

  const startScan = async () => {
    setStep("scanning");
    setProgress(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
          facingMode: "user",
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      let p = 0;

      const interval = setInterval(() => {
        p += 8;

        setProgress(p);

        if (p >= 100) {
          clearInterval(interval);
          handleDone();
        }
      }, 250);

    } catch (err) {
      console.error(err);

      setStep("idle");

      alert(
        "Tidak bisa mengakses kamera. Pastikan izin kamera sudah diberikan."
      );
    }
  };

  const handleDone = async () => {
    try {

      if (!user || !user.id) {
        alert("User ID tidak ditemukan");
        console.log("USER:", user);
        return;
      }

      let dataUrl = null;

      if (videoRef.current) {

        const canvas =
          document.createElement("canvas");

        canvas.width =
          videoRef.current.videoWidth || 320;

        canvas.height =
          videoRef.current.videoHeight || 240;

        const ctx =
          canvas.getContext("2d");

        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);

        ctx.drawImage(
          videoRef.current,
          0,
          0,
          canvas.width,
          canvas.height
        );

        dataUrl =
          canvas.toDataURL("image/png");
      }

      const detection =
        await faceapi
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
        return;
      }

      const descriptor =
        Array.from(detection.descriptor);

      console.log("USER =", user);
      console.log("USER ID =", user?.id);
      console.log("USER NIS =", user?.nis);

      const response =
        await axios.post(
          `${API_URL}/api/face/register`,
          {
            userId: user?.id,
            descriptor,
          }
        );

      console.log("RESPONSE:");
      console.log(response.data);

      if (!response.data.success) {
        alert("Gagal menyimpan Face ID");
        return;
      }

      setSavedFaces([
        {
          id: user.id,
          label: "Face ID Aktif",
          dataUrl,
          descriptor,
          time: new Date().toLocaleString("id-ID")
        }
      ]);

      stopCamera();

      setStep("success");

      alert("Face ID berhasil disimpan");

    } catch (err) {

      console.error("ERROR SAVE FACE:");

      if (err.response) {
        console.log(err.response.data);
        console.log(err.response.status);
      } else {
        console.log(err);
      }

      alert("Gagal menyimpan Face ID");
    }
  };

  const cancelScan = () => {
    stopCamera();
    setStep("idle");
    setProgress(0);
  };

  const removeFace = (id) => {
    setSavedFaces(
      prev => prev.filter(
        f => f.id !== id
      )
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="page-titlebar">
        <h2 style={{ margin: 0, fontSize: 16, color: C.navy, fontWeight: 700 }}>Daftar Face ID</h2>
      </div>

      <div className="form-card faceid-card" style={{
        padding: "26px 28px",
        minHeight: 380,
      }}>
        {step === "idle" && (
          <div style={{ textAlign: "center", padding: "30px 10px" }}>
            <div className="faceid-empty-icon" style={{
              width: 110, height: 110,
              borderRadius: "50%",
              background: "#e8eaef",
              border: `3px dashed ${C.navy}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 22px",
            }}>
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="9" r="3" stroke={C.navy} strokeWidth="2" />
                <path d="M5 19c0-3.5 3-6 7-6s7 2.5 7 6" stroke={C.navy} strokeWidth="2" strokeLinecap="round" />
                <path d="M3 7V5a2 2 0 0 1 2-2h2M21 7V5a2 2 0 0 0-2-2h-2M3 17v2a2 2 0 0 0 2 2h2M21 17v2a2 2 0 0 1-2 2h-2"
                  stroke={C.navy} strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h3 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 700, color: C.text }}>
              Daftarkan Wajah Anda
            </h3>
            <p style={{ fontSize: 12, color: C.muted, margin: "0 0 24px", maxWidth: 420, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
              Sistem akan mengambil foto wajah Anda untuk digunakan sebagai referensi saat absensi.
              Pastikan ruangan cukup terang dan wajah Anda terlihat jelas.
            </p>

            <div style={{ display: "inline-flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
              <button
                onClick={startScan}
                style={{
                  padding: "11px 28px",
                  background: "#3b9eff",
                  color: "white", border: "none",
                  borderRadius: 6,
                  fontWeight: 700, fontSize: 13,
                  cursor: "pointer",
                  boxShadow: "0 3px 10px rgba(59,158,255,0.35)",
                }}
              >
                📷 Mulai Daftar Wajah
              </button>
            </div>

            {!modelsLoaded && (
              <div style={{
                marginTop: 22,
                background: "#fff8e1",
                border: "1px solid #ffe082",
                borderRadius: 7,
                padding: "9px 14px",
                fontSize: 11,
                color: "#bf360c",
                maxWidth: 480,
                marginLeft: "auto", marginRight: "auto",
              }}>
                ⚠ Model AI belum dimuat — sistem akan tetap mengambil foto sebagai snapshot biasa.
              </div>
            )}
          </div>
        )}

        {step === "scanning" && (
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: "100%",
              maxWidth: 480,
              aspectRatio: "4/3",
              margin: "0 auto 18px",
              background: "#1a1a1a",
              borderRadius: 10,
              overflow: "hidden",
              position: "relative",
              boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
            }}>
              <video
                ref={videoRef}
                autoPlay muted playsInline
                style={{
                  width: "100%", height: "100%", objectFit: "cover",
                  transform: "scaleX(-1)",
                }}
              />
              {/* Oval guide */}
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                pointerEvents: "none",
              }}>
                <div style={{
                  width: "min(60%, 200px)", aspectRatio: "3/4",
                  border: "3px dashed rgba(95,180,230,0.85)",
                  borderRadius: "50%",
                }} />
              </div>
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                background: "rgba(0,0,0,0.7)",
                padding: "8px 14px",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: "#5fb4e6", fontWeight: 600 }}>
                    Sedang merekam wajah...
                  </span>
                  <span style={{ fontSize: 11, color: "white" }}>{progress}%</span>
                </div>
                <div style={{ height: 3, background: "rgba(255,255,255,0.15)", borderRadius: 2 }}>
                  <div style={{
                    height: "100%", background: "#5fb4e6",
                    width: `${progress}%`, borderRadius: 2,
                    transition: "width 0.2s",
                  }} />
                </div>
              </div>
            </div>
            <button
              onClick={cancelScan}
              style={{
                padding: "9px 22px",
                background: "#e53935",
                color: "white", border: "none", borderRadius: 6,
                fontWeight: 700, fontSize: 12, cursor: "pointer",
              }}
            >
              ✕ Batal
            </button>
          </div>
        )}

        {step === "success" && (
          <div style={{ textAlign: "center", padding: "30px 10px" }}>
            <div style={{ marginBottom: 14 }}>
              <svg width="80" height="64" viewBox="0 0 100 80">
                <path d="M75 50 C85 50 90 42 90 35 C90 27 83 22 76 23 C73 14 64 8 54 8 C42 8 32 16 30 27 C20 27 12 35 12 45 C12 55 20 62 30 62 L75 62 C82 62 88 56 88 50 Z" fill="#5fb4e6" />
                <path d="M40 38 L48 46 L62 30" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </div>
            <h3 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 700, color: C.text }}>
              Face ID berhasil didaftarkan ✓
            </h3>
            <p style={{ fontSize: 12, color: C.muted, margin: "0 0 22px" }}>
              Wajah Anda kini bisa digunakan untuk absensi.
            </p>
            <button
              onClick={() => setStep("idle")}
              style={{
                padding: "10px 28px",
                background: "#3b9eff",
                color: "white", border: "none", borderRadius: 6,
                fontWeight: 700, fontSize: 13, cursor: "pointer",
                boxShadow: "0 3px 10px rgba(59,158,255,0.35)",
              }}
            >
              Daftarkan Lagi
            </button>
          </div>
        )}
      </div>

      {/* List wajah tersimpan */}
      {savedFaces.length > 0 && (
        <div className="form-card" style={{
          padding: "20px 24px",
        }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: C.navy, marginBottom: 14 }}>
            Face ID Tersimpan ({savedFaces.length})
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 12 }}>
            {savedFaces.map(f => (
              <div key={f.id} style={{
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                overflow: "hidden",
                background: "#fafbfc",
              }}>
                <div style={{
                  width: "100%", aspectRatio: "1",
                  background: f.dataUrl ? `url(${f.dataUrl}) center/cover` : "#e8eaef",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 30,
                }}>
                  {!f.dataUrl && "👤"}
                </div>
                <div style={{ padding: "8px 10px" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.text }}>{f.label}</div>
                  <div style={{ fontSize: 9, color: C.muted, marginTop: 2 }}>{f.time}</div>
                  <button
                    onClick={() => removeFace(f.id)}
                    style={{
                      marginTop: 6,
                      padding: "5px 10px",
                      background: "transparent",
                      color: "#c62828",
                      border: "1px solid #ef9a9a",
                      borderRadius: 4,
                      fontSize: 10, fontWeight: 700,
                      cursor: "pointer",
                      width: "100%",
                    }}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
