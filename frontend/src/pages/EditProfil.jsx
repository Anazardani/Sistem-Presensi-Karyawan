import { API_URL } from "../config";
import { useState, useEffect } from "react";

const C = { navy: "#2c4a8a", text: "#1e2432", muted: "#6b7280", border: "#d8dde6" };

function FieldRow({
  label,
  value,
  k,
  btnLabel,
  btnColor = "#3b9eff",
  onClick,
  setF,
  flash,
  editableField,
  setEditableField,
}) {
  return (
    <div className="profile-fieldrow">
      <input
        value={value}
        onChange={(e) => setF(k, e.target.value)}
        placeholder={label}
        readOnly={editableField !== k}
        style={{
          flex: 1,
          padding: "10px 14px",
          borderRadius: 18,
          border: "1.5px solid #d8dde6",
          fontSize: 13,
          outline: "none",
          fontFamily: "inherit",
          color: "#1e2432",
          background:
            editableField === k
              ? "white"
              : "#f5f5f5",
          transition: "border-color 0.15s",
        }}
      />

      <button
        type="button"
        onClick={() =>
          setEditableField(
            editableField === k ? null : k
          )
        }
        style={{
          padding: "8px 18px",
          background: btnColor,
          color: "white",
          border: "none",
          borderRadius: 6,
          fontSize: 11,
          fontWeight: 700,
          cursor: "pointer",
          minWidth: 130,
          whiteSpace: "nowrap",
          boxShadow: `0 2px 6px ${btnColor}55`,
        }}
      >
        {editableField === k
          ? "Selesai"
          : btnLabel}
      </button>
    </div>
  );
}

export default function EditProfil({ user, setUser, fotoProfil, setFotoProfil }) {
  console.log("render EditProfil");

  const [form, setForm] = useState({
    nama: user?.name || "TITO TAUFIQUR RAHMAN",
    instansi: "IT SUPPORT",
    alamat: "Radian Edu Solution, Yogyakarta",
    nomorHp: "No. Hp 089299291914, Email rahdianita@gmail.com",
    username: "TITO.TAUFIQURRAHMAN",
    posisi: "IT SUPPORT",
    nik: "RA02199003-1112",
    nomorHpEdit: "089299291914",
    emailEdit: "rahdianita@gmail.com",
  });

  const [savedMsg, setSavedMsg] = useState("");

  const [editableField, setEditableField] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const loadProfile = async () => {
    try {
      const loginUser = JSON.parse(
        localStorage.getItem("user")
      );

      if (!loginUser?.id) return;

      const response = await fetch(
        `${API_URL}/api/profile/${loginUser.id}`
      );

      const data = await response.json();

      if (data.foto_profil) {
        setFotoProfil(
          `${API_URL}/uploads/${data.foto_profil}`
        );
      }

      setForm({
        nama: data.nama_lengkap || "",
        instansi: data.instansi || "",
        alamat: data.alamat || "",
        nomorHp: `No. Hp ${data.no_hp || "-"}, Email ${data.email || "-"}`,
        username: data.username || "",
        posisi: data.posisi || "",
        nik: data.nik || "",
        nomorHpEdit: data.no_hp || "",
        emailEdit: data.email || "",
      });

    } catch (err) {
      console.error(err);
    }
  };

  const handleFoto = async (e) => {
    try {
      const file = e.target.files[0];

      if (!file) return;

      const formData = new FormData();
      formData.append("foto", file);

      const loginUser = JSON.parse(
        localStorage.getItem("user")
      );

      const response = await fetch(
        `${API_URL}/api/profile/upload/${loginUser.id}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (result.success) {
        setFotoProfil(result.url);
      }

    } catch (err) {
      console.error(err);
    }
  };

  const flash = (msg) => {
    setSavedMsg(msg);
    setTimeout(() => setSavedMsg(""), 2500);
  };

  const handleSimpan = async () => {
    try {

      const loginUser = JSON.parse(
        localStorage.getItem("user")
      );

      const response = await fetch(
        `${API_URL}/api/profile/${loginUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nama_lengkap: form.nama,
            email: form.emailEdit,
            no_hp: form.nomorHpEdit,
            username: form.username,
            posisi: form.posisi,
            nik: form.nik,
            alamat: form.alamat,
            instansi: form.instansi,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        if (setUser) {
          setUser((u) => ({
            ...u,
            nama_lengkap: form.nama,
          }));
        }

        flash("✓ Perubahan berhasil disimpan");
      } else {
        flash("Gagal menyimpan data");
      }

    } catch (err) {
      console.error(err);
      flash("Gagal menyimpan data");
    }
  };

  const handleBatal = () => {
    loadProfile();
    flash("Perubahan dibatalkan");
  };



  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Title */}
      <div className="page-titlebar">
        <h2 style={{ margin: 0, fontSize: 16, color: C.navy, fontWeight: 700 }}>Edit Profil</h2>
      </div>

      {/* Profile Card */}
      <div className="form-card" style={{
        padding: "26px 28px",
      }}>
        {/* Header: avatar + nama + alamat */}
        <div className="profile-header" style={{
          display: "flex", gap: 22, alignItems: "center",
          paddingBottom: 22,
          borderBottom: `1px solid ${C.border}`,
          marginBottom: 22,
          flexWrap: "wrap",
        }}>
          {/* Avatar besar */}
          <label style={{ cursor: "pointer", position: "relative" }}>
            <div style={{
              width: 110, height: 110, borderRadius: "50%",
              background: fotoProfil ? `url(${fotoProfil}) center/cover` : "linear-gradient(135deg,#90a4ae,#607d8b)",
              border: `3px solid ${C.navy}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 50,
              color: "white",
              overflow: "hidden",
              boxShadow: "0 3px 10px rgba(0,0,0,0.18)",
            }}>
              {!fotoProfil && "👤"}
            </div>
            <div style={{
              position: "absolute", bottom: 4, right: 4,
              background: "#3b9eff",
              width: 32, height: 32, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "2px solid white",
              fontSize: 14,
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            }}>📷</div>
            <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleFoto} />
          </label>

          {/* Nama & alamat */}
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{
              fontSize: 18, fontWeight: 800,
              color: C.navy,
              marginBottom: 4,
              letterSpacing: 0.2,
              wordBreak: "break-word",
            }}>
              {form.nama}
            </div>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 3 }}>
              {form.instansi}
            </div>
            <div style={{ fontSize: 12, color: C.muted }}>
              {form.alamat}
            </div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 3, wordBreak: "break-word" }}>
              {form.nomorHpEdit} · {form.emailEdit}
            </div>
          </div>
        </div>

        {/* Edit fields dengan tombol di kanan */}
        <div>
          <FieldRow
            label="Nama"
            value={form.nama}
            k="nama"
            btnLabel="Edit Nama"
            btnColor="#3b9eff"
            setF={setF}
            flash={flash}
            editableField={editableField}
            setEditableField={setEditableField}
          />

          <FieldRow
            label="Username"
            value={form.username}
            k="username"
            btnLabel="Edit Username"
            btnColor="#3b9eff"
            setF={setF}
            flash={flash}
            editableField={editableField}
            setEditableField={setEditableField}
          />

          <FieldRow
            label="Posisi"
            value={form.posisi}
            k="posisi"
            btnLabel="Edit Posisi"
            btnColor="#3b9eff"
            setF={setF}
            flash={flash}
            editableField={editableField}
            setEditableField={setEditableField}
          />

          <FieldRow
            label="NIK / NIS"
            value={form.nik}
            k="nik"
            btnLabel="Edit NIK"
            btnColor="#3b9eff"
            setF={setF}
            flash={flash}
            editableField={editableField}
            setEditableField={setEditableField}
          />

          <FieldRow
            label="No. Handphone"
            value={form.nomorHpEdit}
            k="nomorHpEdit"
            btnLabel="Edit No.HP"
            btnColor="#3b9eff"
            setF={setF}
            flash={flash}
            editableField={editableField}
            setEditableField={setEditableField}
          />

          <FieldRow
            label="Email"
            value={form.emailEdit}
            k="emailEdit"
            btnLabel="Edit Email"
            btnColor="#3b9eff"
            setF={setF}
            flash={flash}
            editableField={editableField}
            setEditableField={setEditableField}
          />
        </div>

        {/* Action buttons (Simpan hijau, Batal merah) */}
        <div className="profile-actions" style={{
          display: "flex", gap: 12, alignItems: "center",
          paddingTop: 18,
          borderTop: `1px solid ${C.border}`,
          marginTop: 18,
          flexWrap: "wrap",
        }}>
          <button
            onClick={handleSimpan}
            style={{
              padding: "10px 30px",
              background: "#43a047",
              color: "white",
              border: "none", borderRadius: 6,
              fontWeight: 700, fontSize: 13,
              cursor: "pointer",
              boxShadow: "0 3px 10px rgba(67,160,71,0.35)",
            }}
          >
            Simpan
          </button>
          <button
            onClick={handleBatal}
            style={{
              padding: "10px 30px",
              background: "#e53935",
              color: "white",
              border: "none", borderRadius: 6,
              fontWeight: 700, fontSize: 13,
              cursor: "pointer",
              boxShadow: "0 3px 10px rgba(229,57,53,0.35)",
            }}
          >
            Batal
          </button>
          {savedMsg && (
            <span style={{
              fontSize: 12, fontWeight: 600,
              color: savedMsg.startsWith("✓") ? "#2e7d32" : "#c62828",
            }}>
              {savedMsg}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
