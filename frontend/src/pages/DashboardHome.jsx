import { API_URL } from "../config";
import { useState, useEffect } from "react";
import axios from "axios";

const C = {
  navy: "#2c4a8a",
  white: "#fff",
  text: "#1e2432",
  muted: "#6b7280",
  bg: "#dcdcdc",
  contentBg: "#ffffff",
  // 3 stat colors persis figma
  statBlue: "#5fb4e6",
  statMint: "#5fdcb6",
  statGreen: "#4cd97a",
};

export default function DashboardHome({ setPage, absenLog = [], user }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {

    if (!user?.id) return;

    loadStats();

  }, [user]);

  const loadStats = async () => {

    try {

      const response =
        await axios.get(
          `${API_URL}/api/absensi/stats/${user.id}`
        );

      setStats(response.data);

    } catch (err) {

      console.log(err);

    }
  };

  const dateStr = now.toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  });

  const [stats, setStats] = useState({
    totalAbsensiBulan: 0,
    totalRekapAbsensi: 0,
    totalAbsenTanpaAlasan: 0,
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* Title */}
      <div style={{
        background: "white",
        borderRadius: 8,
        padding: "12px 22px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}>
        <h2 style={{ margin: 0, fontSize: 16, color: C.navy, fontWeight: 700 }}>Home</h2>
      </div>

      {/* Welcome Banner */}
      <div className="dash-welcome" style={{
        background: "white",
        borderRadius: 8,
        padding: "30px 36px 28px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
        textAlign: "center",
        border: "1px solid #e5e7ed",
      }}>
        <h1 style={{
          margin: "0 0 14px",
          fontSize: 22,
          color: C.navy,
          fontWeight: 800,
          letterSpacing: 0.2,
          lineHeight: 1.3,
        }}>
          Selamat Datang di website Absensi Radian Edu Solution
        </h1>
        <p style={{
          margin: 0,
          fontSize: 13,
          color: "#5b6573",
          lineHeight: 1.6,
          maxWidth: 720,
          marginLeft: "auto",
          marginRight: "auto",
        }}>
          Selamat datang di sistem absensi digital kami. Platform ini dirancang untuk memudahkan pencatatan
          kehadiran Anda secara akurat dan efisien. Silakan masuk menggunakan email dan password
          terdaftar untuk melihat riwayat absensi, melihat keluar masuk kehadiran, dan mengisi
          jurnal kerja. Kehadiran Anda sangatlah berarti bagi kami.
        </p>
        <div style={{ marginTop: 14, fontSize: 11, color: C.muted, fontStyle: "italic" }}>
          {dateStr} • {now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>

      {/* 3 stat cards seperti Figma */}
      <div className="dash-stats">
        <StatCard
          color={C.statBlue}
          value={stats.totalAbsensiBulan}
          label="Jumlah Absensi Bulan Ini"
          icon={
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="white" strokeWidth="2" />
              <path d="M3 10h18M8 2v4M16 2v4" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          }
          onClick={() => setPage("rekap")}
        />
        <StatCard
          color={C.statMint}
          value={stats.totalRekapAbsensi}
          label="Jumlah Rekap Absensi"
          icon={
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="white" strokeWidth="2" />
              <path d="M14 2v6h6M8 13h8M8 17h8" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          }
          onClick={() => setPage("rekap")}
        />
        <StatCard
          color={C.statGreen}
          value={stats.totalAbsenTanpaAlasan}
          label="Jumlah Absen Tanpa Alasan"
          icon={
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <path d="M9 11l3 3L22 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          }
          onClick={() => setPage("perizinan")}
        />
      </div>

      {/* Quick action row */}
      <div className="dash-quickaccess" style={{
        background: "white",
        borderRadius: 8,
        padding: "16px 22px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: C.navy, marginBottom: 12 }}>
          Akses Cepat
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            { label: "Absensi Sekarang", color: "#1e88e5", to: "absensi" },
            { label: "Lihat Rekap", color: "#43a047", to: "rekap" },
            { label: "Isi LogBook", color: "#fb8c00", to: "logbook" },
            { label: "Ajukan Izin", color: "#8e24aa", to: "perizinan" },
          ].map(b => (
            <button
              key={b.label}
              onClick={() => setPage(b.to)}
              style={{
                padding: "9px 18px",
                background: b.color,
                color: "white",
                border: "none",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: `0 2px 6px ${b.color}55`,
              }}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ color, value, label, icon, onClick }) {
  return (
    <div
      onClick={onClick}
      className="stat-card"
      style={{
        background: color,
        borderRadius: 10,
        padding: "20px 24px",
        color: "white",
        cursor: "pointer",
        boxShadow: `0 4px 14px ${color}50`,
        transition: "transform 0.15s",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
      onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
    >
      <div>
        <div style={{
          fontSize: 11,
          fontWeight: 700,
          opacity: 0.95,
          marginBottom: 8,
          textShadow: "0 1px 2px rgba(0,0,0,0.15)",
        }}>
          {label}
        </div>
        <div className="stat-value" style={{
          fontSize: 44,
          fontWeight: 800,
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
          textShadow: "0 1px 3px rgba(0,0,0,0.18)",
        }}>
          {value}
        </div>
      </div>
      <div style={{ opacity: 0.92, flexShrink: 0 }}>
        {icon}
      </div>
    </div>
  );
}
