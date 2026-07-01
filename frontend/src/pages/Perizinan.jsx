import { API_URL } from "../config";
import { useState, useEffect } from "react";
import axios from "axios";

const C = { navy: "#2c4a8a", text: "#1e2432", muted: "#6b7280", border: "#d8dde6" };

export default function Perizinan({ user }) {
  const [view, setView] = useState("form"); // form | sukses | status
  const [form, setForm] = useState({
    nama: user?.name || "TITO TAUFIQUR RAHMAN",
    email: user?.email || "tito@radianedu.com",
    tanggalMulai: "",
    tanggalSelesai: "",
    keterangan: "",
  });
  const [errors, setErrors] = useState({});
  const [riwayat, setRiwayat] = useState([]);

  useEffect(() => {
    loadRiwayat();
  }, []);

  const loadRiwayat = async () => {

    try {

      const user =
        JSON.parse(
          localStorage.getItem("user")
        );

      const response =
        await axios.get(
          `${API_URL}/api/perizinan/${user.id}`
        );

      setRiwayat(response.data);

    } catch (err) {

      console.log(err);

    }

  };

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.nama.trim()) e.nama = "Nama wajib diisi";
    if (!form.email.trim()) e.email = "Email wajib diisi";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Format email tidak valid";
    if (!form.tanggalMulai) e.tanggalMulai = "Pilih tanggal mulai";
    if (!form.tanggalSelesai) e.tanggalSelesai = "Pilih tanggal selesai";
    if (form.tanggalMulai && form.tanggalSelesai && form.tanggalSelesai < form.tanggalMulai) {
      e.tanggalSelesai = "Tanggal selesai harus setelah tanggal mulai";
    }
    if (!form.keterangan.trim()) e.keterangan = "Keterangan wajib diisi";
    return e;
  };

  const submit = async () => {

    const e = validate();

    if (Object.keys(e).length) {
      return setErrors(e);
    }

    try {

      const user =
        JSON.parse(
          localStorage.getItem("user")
        );

      await axios.post(
        `${API_URL}/api/perizinan`,
        {
          userId: user.id,
          nama: form.nama,
          email: form.email,
          tanggalMulai: form.tanggalMulai,
          tanggalSelesai: form.tanggalSelesai,
          keterangan: form.keterangan,
        }
      );

      setView("sukses");

    } catch (err) {

      console.log(err);
      alert("Gagal mengirim izin");

    }
  };

  const inpStyle = (errKey) => ({
    width: "100%",
    padding: "10px 14px",
    borderRadius: 14,
    border: `1.5px solid ${errors[errKey] ? "#ef5350" : C.border}`,
    fontSize: 13,
    boxSizing: "border-box",
    outline: "none",
    transition: "border-color 0.15s",
    fontFamily: "inherit",
  });

  const labelStyle = {
    fontSize: 11,
    fontWeight: 600,
    color: C.text,
    display: "block",
    marginBottom: 5,
  };

  const statusBadge = (status) => {
    const styles = {
      Disetujui: { bg: "#e8f5e9", color: "#2e7d32", icon: "✓" },
      Menunggu: { bg: "#fff8e1", color: "#e65100", icon: "⏳" },
      Ditolak: { bg: "#ffebee", color: "#c62828", icon: "✕" },
    };
    const s = styles[status] || { bg: "#f5f5f5", color: "#555", icon: "•" };
    return (
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        padding: "3px 10px",
        background: s.bg, color: s.color,
        borderRadius: 12,
        fontSize: 11, fontWeight: 700,
        whiteSpace: "nowrap",
      }}>
        {status} {s.icon}
      </span>
    );
  };

  // ============ HALAMAN SUKSES ============
  if (view === "sukses") return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="page-titlebar">
        <h2 style={{ margin: 0, fontSize: 16, color: C.navy, fontWeight: 700 }}>Perizinan</h2>
      </div>

      <div className="form-card" style={{
        padding: "60px 24px",
        textAlign: "center",
      }}>
        {/* Awan biru dengan centang seperti Figma */}
        <div style={{ marginBottom: 18 }}>
          <svg width="100" height="80" viewBox="0 0 100 80">
            <path d="M75 50 C85 50 90 42 90 35 C90 27 83 22 76 23 C73 14 64 8 54 8 C42 8 32 16 30 27 C20 27 12 35 12 45 C12 55 20 62 30 62 L75 62 C82 62 88 56 88 50 Z"
              fill="#5fb4e6" />
            <path d="M40 38 L48 46 L62 30" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </div>
        <div style={{ fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 6 }}>
          Pengajuan izin berhasil dikirimkan
          <span style={{ color: "#43a047", marginLeft: 6 }}>✓</span>
        </div>
        <p style={{
          fontSize: 12, color: C.muted, margin: "0 0 28px",
          maxWidth: 400, marginLeft: "auto", marginRight: "auto", lineHeight: 1.5,
        }}>
          Silahkan cek status pengajuan izin anda apakah sudah di setujui.
        </p>
        <button
          onClick={async () => {
            await loadRiwayat();
            setView("status");
          }}
          style={{
            padding: "10px 36px",
            background: "#3b9eff",
            color: "white",
            border: "none",
            borderRadius: 6,
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
            boxShadow: "0 3px 10px rgba(59,158,255,0.35)",
          }}
        >
          Cek Status
        </button>
      </div>
    </div>
  );

  // ============ HALAMAN STATUS PENGAJUAN ============
  if (view === "status") return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="page-titlebar">
        <h2 style={{ margin: 0, fontSize: 16, color: C.navy, fontWeight: 700 }}>Perizinan</h2>
        <button onClick={() => setView("form")} style={{
          padding: "8px 16px",
          background: C.navy, color: "white",
          border: "none", borderRadius: 6,
          fontSize: 12, fontWeight: 700, cursor: "pointer",
          boxShadow: "0 2px 6px rgba(44,74,138,0.25)",
          whiteSpace: "nowrap",
        }}>
          + Ajukan Izin
        </button>
      </div>

      <div style={{
        background: "white", borderRadius: 8,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        overflow: "hidden",
      }}>
        <div style={{
          background: "#e8eaef",
          padding: "10px 18px",
          borderBottom: `1px solid ${C.border}`,
          textAlign: "center",
        }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: C.navy }}>
            Status Pengajuan Izin
          </div>
        </div>

        <div className="responsive-table-wrap">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f5f6fa" }}>
                {["Nama", "Gender", "Tanggal", "Keterangan Izin", "Status", "Aksi"].map(h => (
                  <th key={h} style={{
                    padding: "10px 14px",
                    textAlign: "center",
                    color: C.text,
                    fontSize: 12,
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                    borderBottom: `1px solid ${C.border}`,
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {riwayat.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: 36, color: C.muted, fontSize: 13 }}>
                    Belum ada pengajuan izin
                  </td>
                </tr>
              ) : riwayat.map((r, i) => (
                <tr key={r.id} style={{
                  background: i % 2 === 0 ? "white" : "#fafbfc",
                  borderBottom: `1px solid ${C.border}`,
                  transition: "background 0.15s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f0f4ff"}
                  onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? "white" : "#fafbfc"}
                >
                  <td style={{ padding: "10px 14px", fontSize: 12, color: C.text, textAlign: "center", fontWeight: 600, whiteSpace: "nowrap" }}>{r.nama}</td>
                  <td style={{ padding: "10px 14px", fontSize: 12, color: C.muted, textAlign: "center" }}>{r.gender}</td>
                  <td style={{ padding: "10px 14px", fontSize: 12, color: C.text, textAlign: "center", whiteSpace: "nowrap" }}>{r.tanggal}</td>
                  <td style={{ padding: "10px 14px", fontSize: 12, color: C.muted, textAlign: "center" }}>{r.keterangan}</td>
                  <td style={{ padding: "10px 14px", textAlign: "center" }}>{statusBadge(r.status)}</td>
                  <td style={{ padding: "10px 14px", textAlign: "center" }}>
                    <button style={{
                      padding: "5px 14px",
                      background: "#e53935",
                      color: "white",
                      border: "none", borderRadius: 6,
                      fontSize: 11, fontWeight: 700,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}>
                      Kembali
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <button onClick={() => setView("form")} style={{
        alignSelf: "flex-start",
        padding: "9px 22px",
        background: "transparent",
        color: C.navy,
        border: `1.5px solid ${C.navy}`,
        borderRadius: 6,
        fontWeight: 700, fontSize: 12,
        cursor: "pointer",
      }}>
        ← Kembali ke Form
      </button>
    </div>
  );

  // ============ HALAMAN FORM ============
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="page-titlebar">
        <h2 style={{ margin: 0, fontSize: 16, color: C.navy, fontWeight: 700 }}>Perizinan</h2>
        <button
          onClick={async () => {
            await loadRiwayat();
            setView("status");
          }}
          style={{
            padding: "8px 16px",
            background: "transparent",
            color: C.navy,
            border: `1.5px solid ${C.navy}`,
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          Status Pengajuan ({riwayat.length})
        </button>
      </div>

      <div className="form-card" style={{
        padding: "26px 28px",
      }}>
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Nama</label>
          <input
            value={form.nama}
            onChange={e => set("nama", e.target.value)}
            style={inpStyle("nama")}
            onFocus={e => e.target.style.borderColor = C.navy}
            onBlur={e => e.target.style.borderColor = errors.nama ? "#ef5350" : C.border}
          />
          {errors.nama && <div style={{ fontSize: 10, color: "#c62828", marginTop: 3 }}>⚠ {errors.nama}</div>}
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={e => set("email", e.target.value)}
            style={inpStyle("email")}
            onFocus={e => e.target.style.borderColor = C.navy}
            onBlur={e => e.target.style.borderColor = errors.email ? "#ef5350" : C.border}
          />
          {errors.email && <div style={{ fontSize: 10, color: "#c62828", marginTop: 3 }}>⚠ {errors.email}</div>}
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Hari/Tanggal</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <div style={{ fontSize: 10, color: C.muted, marginBottom: 3 }}>Dari</div>
              <input
                type="date"
                value={form.tanggalMulai}
                onChange={e => set("tanggalMulai", e.target.value)}
                style={inpStyle("tanggalMulai")}
              />
              {errors.tanggalMulai && <div style={{ fontSize: 10, color: "#c62828", marginTop: 3 }}>⚠ {errors.tanggalMulai}</div>}
            </div>
            <div>
              <div style={{ fontSize: 10, color: C.muted, marginBottom: 3 }}>Sampai</div>
              <input
                type="date"
                value={form.tanggalSelesai}
                onChange={e => set("tanggalSelesai", e.target.value)}
                style={inpStyle("tanggalSelesai")}
              />
              {errors.tanggalSelesai && <div style={{ fontSize: 10, color: "#c62828", marginTop: 3 }}>⚠ {errors.tanggalSelesai}</div>}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 22 }}>
          <label style={labelStyle}>Keterangan</label>
          <input
            type="text"
            value={form.keterangan}
            onChange={e => set("keterangan", e.target.value)}
            placeholder="Alasan pengajuan izin (mis. Sakit, Acara Keluarga)"
            style={inpStyle("keterangan")}
            onFocus={e => e.target.style.borderColor = C.navy}
            onBlur={e => e.target.style.borderColor = errors.keterangan ? "#ef5350" : C.border}
          />
          {errors.keterangan && <div style={{ fontSize: 10, color: "#c62828", marginTop: 3 }}>⚠ {errors.keterangan}</div>}
        </div>

        <button
          onClick={submit}
          style={{
            padding: "10px 36px",
            background: "#3b9eff",
            color: "white",
            border: "none",
            borderRadius: 6,
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
            boxShadow: "0 3px 10px rgba(59,158,255,0.35)",
          }}
        >
          Kirim
        </button>
      </div>
    </div>
  );
}
