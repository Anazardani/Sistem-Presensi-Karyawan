import { API_URL } from "../config";
import { useState } from "react";
import logo from "../assets/logo-radian.png";

export default function Login({ onLogin, goRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async () => {

    setError("");

    if (!email.trim())
      return setError("Email tidak boleh kosong.");

    if (!/\S+@\S+\.\S+/.test(email))
      return setError("Format email tidak valid.");

    if (!password)
      return setError("Password tidak boleh kosong.");

    if (password.length < 6)
      return setError("Password minimal 6 karakter.");

    setLoading(true);

    try {

      const response =
        await fetch(
          `${API_URL}/api/login`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json"
            },
            body: JSON.stringify({
              email,
              password
            })
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.message ||
          "Login gagal"
        );
        return;
      }

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      onLogin({
        name:
          data.user.nama_lengkap,
        email:
          data.user.email,
        role:
          data.user.role,
        id:
          data.user.id
      });

    } catch (err) {

      setError(
        "Tidak dapat terhubung ke server"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="auth-page" style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #6b8de8 0%, #4a6bc4 50%, #3955a8 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    }}>
      {/* dekorasi lingkaran lembut */}
      <div style={{ position: "absolute", top: -100, right: -100, width: 350, height: 350, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
      <div style={{ position: "absolute", bottom: -60, left: -60, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />

      {/* CARD LOGIN */}
      <div className="auth-card" style={{
        background: "linear-gradient(180deg, #2c4a8a 0%, #1f3461 100%)",
        borderRadius: 14,
        padding: "36px 30px 30px",
        width: 340,
        boxShadow: "0 18px 50px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)",
        position: "relative",
        color: "white",
      }}>
        {/* Logo (disamakan dengan Register) */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
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
          }}>LOGIN</div>
        </div>

        {/* Email */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 6, color: "rgba(255,255,255,0.95)" }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handle()}
            placeholder="masukkan email"
            style={{
              width: "100%",
              padding: "10px 13px",
              borderRadius: 7,
              border: "1px solid rgba(255,255,255,0.3)",
              background: "rgba(255,255,255,0.08)",
              color: "white",
              fontSize: 13,
              boxSizing: "border-box",
              outline: "none",
            }}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: 22 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 6, color: "rgba(255,255,255,0.95)" }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPass(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handle()}
            placeholder="masukkan password"
            style={{
              width: "100%",
              padding: "10px 13px",
              borderRadius: 7,
              border: "1px solid rgba(255,255,255,0.3)",
              background: "rgba(255,255,255,0.08)",
              color: "white",
              fontSize: 13,
              boxSizing: "border-box",
              outline: "none",
            }}
          />
        </div>

        {error && (
          <div style={{
            background: "rgba(244,67,54,0.2)",
            border: "1px solid rgba(244,67,54,0.5)",
            borderRadius: 6,
            padding: "7px 10px",
            marginBottom: 14,
            fontSize: 11,
            color: "#ffcdd2",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <span>⚠</span> {error}
          </div>
        )}

        <button onClick={handle} disabled={loading} style={{
          display: "block",
          margin: "0 auto",
          padding: "10px 38px",
          background: loading ? "#90a4ae" : "#3b9eff",
          color: "white",
          border: "none",
          borderRadius: 6,
          fontWeight: 700,
          fontSize: 13,
          cursor: loading ? "not-allowed" : "pointer",
          letterSpacing: 0.5,
          boxShadow: "0 3px 8px rgba(59,158,255,0.4)",
          transition: "all 0.15s",
        }}>
          {loading ? "Memproses..." : "Login →"}
        </button>

        <p style={{
          textAlign: "center",
          fontSize: 11,
          color: "rgba(255,255,255,0.7)",
          marginTop: 22,
          marginBottom: 0,
        }}>
          Belum mempunyai akun?{" "}
          <span onClick={goRegister} style={{
            color: "#5fb4e6",
            fontWeight: 700,
            cursor: "pointer",
            textDecoration: "underline",
          }}>
            Register Sekarang
          </span>
        </p>
      </div>
    </div>
  );
}