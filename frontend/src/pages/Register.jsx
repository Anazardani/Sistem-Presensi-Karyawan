import { API_URL } from "../config";
import { useState } from "react";
import logo from "../assets/logo-radian.png";

const FIELDS = [
  { k: "nama", label: "Nama Lengkap", placeholder: "masukkan nama lengkap", type: "text" },
  { k: "email", label: "Email", placeholder: "masukkan email", type: "email" },
  { k: "password", label: "Password", placeholder: "masukkan kata sandi", type: "password" },
  { k: "telp", label: "No. Handphone", placeholder: "masukkan no.handphone", type: "tel" },
];

export default function Register({ goLogin }) {
  const [form, setForm] = useState({ nama: "", email: "", password: "", telp: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [sukses, setSukses] = useState(false);

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.nama.trim()) e.nama = "Nama wajib diisi";
    if (!form.email.trim()) e.email = "Email wajib diisi";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Format email tidak valid";
    if (!form.password) e.password = "Password wajib diisi";
    else if (form.password.length < 6) e.password = "Minimal 6 karakter";
    if (!form.telp.trim()) e.telp = "No. handphone wajib diisi";
    return e;
  };

  const handle = async () => {

    const e = validate();

    if (Object.keys(e).length) {
      return setErrors(e);
    }

    setLoading(true);

    try {

      const response =
        await fetch(
          `${API_URL}/api/register`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json"
            },
            body: JSON.stringify(form)
          }
        );

      const data =
        await response.json();

      if (data.success) {
        setSukses(true);
      } else {
        alert(data.error || data.message);
      }

    } catch (err) {

      alert("Tidak dapat terhubung ke server");

    } finally {

      setLoading(false);

    }

  };

  if (sukses) return (
    <div className="auth-page" style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #6b8de8 0%, #4a6bc4 50%, #3955a8 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    }}>
      <div className="auth-card" style={{
        background: "white", borderRadius: 14, padding: "44px 32px",
        width: 340, textAlign: "center",
        boxShadow: "0 18px 50px rgba(0,0,0,0.4)",
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: "50%",
          background: "#e8f5e9", border: "3px solid #43a047",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 32, margin: "0 auto 18px",
          color: "#43a047", fontWeight: 800,
        }}>✓</div>
        <h3 style={{ color: "#2e7d32", margin: "0 0 8px", fontSize: 18, fontWeight: 800 }}>Registrasi Berhasil!</h3>
        <p style={{ color: "#777", fontSize: 12, margin: "0 0 6px" }}>
          Akun <strong style={{ color: "#2c4a8a" }}>{form.nama}</strong> telah dibuat.
        </p>
        <p style={{ color: "#999", fontSize: 12, margin: "0 0 24px" }}>Silakan login untuk melanjutkan.</p>
        <button onClick={goLogin} style={{
          padding: "10px 30px",
          background: "#3b9eff",
          color: "white", border: "none", borderRadius: 7,
          fontWeight: 700, fontSize: 13, cursor: "pointer",
          boxShadow: "0 3px 10px rgba(59,158,255,0.35)",
        }}>
          Masuk Sekarang
        </button>
      </div>
    </div>
  );

  return (
    <div className="auth-page" style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #6b8de8 0%, #4a6bc4 50%, #3955a8 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px 14px",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    }}>
      <div style={{ position: "absolute", top: -100, right: -100, width: 350, height: 350, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
      <div style={{ position: "absolute", bottom: -60, left: -60, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />

      <div className="auth-card" style={{
        background: "linear-gradient(180deg, #2c4a8a 0%, #1f3461 100%)",
        borderRadius: 14,
        padding: "28px 30px 26px",
        width: 350,
        boxShadow: "0 18px 50px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)",
        color: "white",
        position: "relative",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 14 }}>
          <div style={{
            width: 90, height: 70, borderRadius: "50%",
            background: "white",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 8px",
            padding: 4, boxSizing: "border-box",
            boxShadow: "0 3px 10px rgba(0,0,0,0.25)",
          }}>
            <img src={logo} alt="logo" style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "50%" }} />
          </div>
          <div style={{
            fontSize: 18, fontWeight: 800,
            color: "white", letterSpacing: 2,
          }}>REGISTER</div>
        </div>

        {/* Fields */}
        {FIELDS.map(({ k, label, placeholder, type }) => (
          <div key={k} style={{ marginBottom: 11 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 5, color: "rgba(255,255,255,0.95)" }}>
              {label}
            </label>
            <input
              type={type}
              value={form[k]}
              onChange={e => set(k, e.target.value)}
              placeholder={placeholder}
              style={{
                width: "100%", padding: "9px 12px",
                borderRadius: 7,
                border: `1px solid ${errors[k] ? "#ef5350" : "rgba(255,255,255,0.3)"}`,
                background: "rgba(255,255,255,0.08)",
                color: "white",
                fontSize: 13,
                boxSizing: "border-box",
                outline: "none",
              }}
            />
            {errors[k] && <div style={{ fontSize: 10, color: "#ffcdd2", marginTop: 3 }}>⚠ {errors[k]}</div>}
          </div>
        ))}

        <button onClick={handle} disabled={loading} style={{
          display: "block", margin: "16px auto 0",
          padding: "10px 42px",
          background: loading ? "#90a4ae" : "#3b9eff",
          color: "white", border: "none", borderRadius: 6,
          fontWeight: 700, fontSize: 13,
          cursor: loading ? "not-allowed" : "pointer",
          boxShadow: "0 3px 8px rgba(59,158,255,0.4)",
          letterSpacing: 0.5,
        }}>
          {loading ? "Mendaftar..." : "Register"}
        </button>

        <p style={{
          textAlign: "center", fontSize: 11,
          color: "rgba(255,255,255,0.7)",
          marginTop: 16, marginBottom: 0,
        }}>
          Sudah mempunyai akun?{" "}
          <span onClick={goLogin} style={{
            color: "#5fb4e6", fontWeight: 700,
            cursor: "pointer", textDecoration: "underline",
          }}>
            Login Sekarang
          </span>
        </p>
      </div>
    </div>
  );
}
