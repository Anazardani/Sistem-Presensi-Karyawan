import { API_URL } from "../config";
import { useState } from "react";
import axios from "axios";

const C = { navy: "#2c4a8a", text: "#1e2432", muted: "#6b7280", border: "#d8dde6" };

const emptyEntry = () => ({
  hariTanggal: new Date().toISOString().split("T")[0],
  jamPengajuan: new Date().toTimeString().slice(0, 5),
  pekerjaan: "",
  output: "",
  lokasiFile: "",
});

export default function LogBook({ user }) {
  const [nama, setNama] = useState(user?.name || "TITO TAUFIQUR RAHMAN");
  const [email, setEmail] = useState(user?.email || "tito@radianedu.com");
  const [entries, setEntries] = useState([emptyEntry()]);
  const [errors, setErrors] = useState({});
  const [view, setView] = useState("form"); // form | sukses

  const setEntry = (i, k, v) => {
    setEntries(prev => prev.map((e, idx) => idx === i ? { ...e, [k]: v } : e));
    setErrors(e => ({ ...e, [`${i}-${k}`]: "" }));
  };

  const addEntry = () => setEntries(prev => [...prev, emptyEntry()]);
  const removeEntry = (i) => setEntries(prev => prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev);

  const validate = () => {
    const e = {};
    if (!nama.trim()) e.nama = "Nama wajib diisi";
    if (!email.trim()) e.email = "Email wajib diisi";
    entries.forEach((en, i) => {
      if (!en.hariTanggal) e[`${i}-hariTanggal`] = "Pilih tanggal";
      if (!en.jamPengajuan) e[`${i}-jamPengajuan`] = "Isi jam";
      if (en.pekerjaan.trim().length < 5) e[`${i}-pekerjaan`] = "Minimal 5 karakter";
      if (!en.output.trim()) e[`${i}-output`] = "Output wajib diisi";
    });
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
        `${API_URL}/api/logbook`,
        {
          userId: user.id,
          nama,
          email,
          entries
        }
      );

      setView("sukses");

    } catch (err) {

      console.log(err);

      alert(
        "Gagal mengirim logbook"
      );
    }
  };

  const handleDownload = () => {

    const rows = [
      [
        "No",
        "Hari/Tanggal",
        "Jam Pengajuan",
        "Pekerjaan",
        "Output",
        "Lokasi File"
      ],

      ...entries.map((item, index) => [
        index + 1,
        item.hariTanggal || "",
        item.jamPengajuan || "",
        `"${item.pekerjaan || ""}"`,
        `"${item.output || ""}"`,
        `"${item.lokasiFile || ""}"`,
      ])
    ];

    const csvContent = rows
      .map(row => row.join(","))
      .join("\n");

    const blob = new Blob(
      ["\uFEFF" + csvContent],
      {
        type: "text/csv;charset=utf-8;"
      }
    );

    const url =
      window.URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      `logbook-${new Date()
        .toISOString()
        .split("T")[0]}.csv`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  };

  // ============ HALAMAN SUKSES ============
  if (view === "sukses") return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="page-titlebar">
        <h2 style={{ margin: 0, fontSize: 16, color: C.navy, fontWeight: 700 }}>LogBook</h2>
      </div>

      <div className="form-card" style={{
        padding: "60px 24px",
        textAlign: "center",
      }}>
        {/* Awan dengan centang seperti Figma */}
        <div style={{ marginBottom: 20 }}>
          <svg width="100" height="80" viewBox="0 0 100 80">
            <path d="M75 50 C85 50 90 42 90 35 C90 27 83 22 76 23 C73 14 64 8 54 8 C42 8 32 16 30 27 C20 27 12 35 12 45 C12 55 20 62 30 62 L75 62 C82 62 88 56 88 50 Z"
              fill="#5fb4e6" />
            <path d="M40 38 L48 46 L62 30" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </div>
        <div style={{ fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 6 }}>
          LogBook berhasil dikirimkan
          <span style={{ color: "#43a047", marginLeft: 6 }}>✓</span>
        </div>
        <p style={{ fontSize: 12, color: C.muted, margin: "0 0 28px", maxWidth: 360, marginLeft: "auto", marginRight: "auto", lineHeight: 1.5 }}>
          Logbook harian Anda telah berhasil dikirim ke supervisor. Silakan cek status di riwayat.
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 12
          }}
        >
          <button
            onClick={handleDownload}
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
            Download
          </button>

          <button
            type="button"
            onClick={() => {
              setEntries([emptyEntry()]);
              setView("form");
            }}
          >
            Buat Logbook Baru
          </button>
        </div>
      </div>
    </div>
  );

  // ============ FORM ============
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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Title */}
      <div className="page-titlebar">
        <h2 style={{ margin: 0, fontSize: 16, color: C.navy, fontWeight: 700 }}>LogBook</h2>
      </div>

      {/* Form Card */}
      <div className="form-card" style={{
        padding: "26px 28px",
      }}>
        {/* Nama & Email (sekali saja, di atas) */}
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Nama</label>
          <input
            value={nama}
            onChange={e => { setNama(e.target.value); setErrors(er => ({ ...er, nama: "" })); }}
            style={inpStyle("nama")}
            onFocus={e => e.target.style.borderColor = C.navy}
            onBlur={e => e.target.style.borderColor = errors.nama ? "#ef5350" : C.border}
          />
          {errors.nama && <div style={{ fontSize: 10, color: "#c62828", marginTop: 3 }}>⚠ {errors.nama}</div>}
        </div>

        <div style={{ marginBottom: 18 }}>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setErrors(er => ({ ...er, email: "" })); }}
            style={inpStyle("email")}
            onFocus={e => e.target.style.borderColor = C.navy}
            onBlur={e => e.target.style.borderColor = errors.email ? "#ef5350" : C.border}
          />
          {errors.email && <div style={{ fontSize: 10, color: "#c62828", marginTop: 3 }}>⚠ {errors.email}</div>}
        </div>

        {/* Entries (bisa lebih dari satu) */}
        {entries.map((en, i) => (
          <div key={i} style={{
            paddingTop: i === 0 ? 0 : 18,
            borderTop: i === 0 ? "none" : `1px dashed ${C.border}`,
            marginTop: i === 0 ? 0 : 14,
          }}>
            {/* header entry kalau lebih dari satu */}
            {entries.length > 1 && (
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                marginBottom: 10, gap: 8, flexWrap: "wrap",
              }}>
                <div style={{
                  fontSize: 12, fontWeight: 700, color: C.navy,
                  background: "#e8eaef", padding: "4px 12px", borderRadius: 12,
                }}>
                  Kegiatan #{i + 1}
                </div>
                <button
                  onClick={() => removeEntry(i)}
                  style={{
                    background: "transparent", border: "none",
                    color: "#c62828", fontSize: 11, fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  ✕ Hapus
                </button>
              </div>
            )}

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Hari/Tanggal</label>
              <input
                type="date"
                value={en.hariTanggal}
                onChange={e => setEntry(i, "hariTanggal", e.target.value)}
                style={inpStyle(`${i}-hariTanggal`)}
              />
              {errors[`${i}-hariTanggal`] && <div style={{ fontSize: 10, color: "#c62828", marginTop: 3 }}>⚠ {errors[`${i}-hariTanggal`]}</div>}
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Jam Pengajuan</label>
              <input
                type="time"
                value={en.jamPengajuan}
                onChange={e => setEntry(i, "jamPengajuan", e.target.value)}
                style={inpStyle(`${i}-jamPengajuan`)}
              />
              {errors[`${i}-jamPengajuan`] && <div style={{ fontSize: 10, color: "#c62828", marginTop: 3 }}>⚠ {errors[`${i}-jamPengajuan`]}</div>}
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Pekerjaan yang dilakukan</label>
              <input
                type="text"
                value={en.pekerjaan}
                onChange={e => setEntry(i, "pekerjaan", e.target.value)}
                placeholder="Tuliskan pekerjaan yang Anda lakukan"
                style={inpStyle(`${i}-pekerjaan`)}
                onFocus={e => e.target.style.borderColor = C.navy}
                onBlur={e => e.target.style.borderColor = errors[`${i}-pekerjaan`] ? "#ef5350" : C.border}
              />
              {errors[`${i}-pekerjaan`] && <div style={{ fontSize: 10, color: "#c62828", marginTop: 3 }}>⚠ {errors[`${i}-pekerjaan`]}</div>}
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Output Hasil Kerja</label>
              <input
                type="text"
                value={en.output}
                onChange={e => setEntry(i, "output", e.target.value)}
                placeholder="Hasil/output dari pekerjaan"
                style={inpStyle(`${i}-output`)}
                onFocus={e => e.target.style.borderColor = C.navy}
                onBlur={e => e.target.style.borderColor = errors[`${i}-output`] ? "#ef5350" : C.border}
              />
              {errors[`${i}-output`] && <div style={{ fontSize: 10, color: "#c62828", marginTop: 3 }}>⚠ {errors[`${i}-output`]}</div>}
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Lokasi File Pengkerjaan</label>
              <input
                type="text"
                value={en.lokasiFile}
                onChange={e => setEntry(i, "lokasiFile", e.target.value)}
                placeholder="Path / link Drive / lokasi file"
                style={inpStyle(`${i}-lokasiFile`)}
                onFocus={e => e.target.style.borderColor = C.navy}
                onBlur={e => e.target.style.borderColor = C.border}
              />
            </div>
          </div>
        ))}

        {/* Tombol tambah kegiatan */}
        <button
          onClick={addEntry}
          style={{
            background: "transparent",
            border: `1.5px dashed ${C.navy}`,
            color: C.navy,
            padding: "10px 18px",
            borderRadius: 7,
            fontSize: 12, fontWeight: 700,
            cursor: "pointer",
            marginBottom: 18,
            transition: "all 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "#e8eaef"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
        >
          + Tambah Kegiatan
        </button>

        {/* Tombol Kirim */}
        <div>
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
    </div>
  );
}
